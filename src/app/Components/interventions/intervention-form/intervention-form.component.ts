import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedUserData } from 'src/app/globals';
import { InterventionDTO } from 'src/app/Models/interventions.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { InterventionsService } from 'src/app/Services/interventions.service';
import { RequestsService } from 'src/app/Services/requests.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-intervention-form',
  templateUrl: './intervention-form.component.html',
  styleUrls: ['./intervention-form.component.scss'],
})
export class InterventionFormComponent implements OnInit {
  intervention: InterventionDTO;
  interventionForm: FormGroup;
  detalle: FormControl;
  created_at: FormControl;
  autor: FormControl;
  cambio_estado: FormControl;
  canEdit: boolean;
  pressedSave: boolean;
  isReadOnly: boolean;
  isUpdateMode: boolean;

  public loading: boolean = false;
  private interventionId: string | null;
  private requestId: string | null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private requestService: RequestsService,
    private userService: UserService,
    private interventionService: InterventionsService,
    public loggedUser: LoggedUserData
  ) {
    this.interventionId =
      this.activatedRoute.snapshot.paramMap.get('id_intervention');
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id_request');
    this.intervention = new InterventionDTO('', '', new Date(), '', '');
    this.canEdit = false;
    this.isUpdateMode = false;
    this.pressedSave = false;
    this.isReadOnly = true;

    this.detalle = new FormControl('', [Validators.required]);
    this.created_at = new FormControl('', [Validators.required]);
    this.autor = new FormControl('', [Validators.required]);
    this.cambio_estado = new FormControl('', [Validators.required]);

    this.interventionForm = this.formBuilder.group({
      detalle: this.detalle,
      created_at: this.created_at,
      cambio_estado: this.cambio_estado,
      autor: this.autor,
    });
  }

  ngOnInit(): void {
    // update
    if (this.interventionId) {
      this.loading = true;
      this.isUpdateMode = true;
      if (
        this.loggedUser.perfil == 'Administrador' ||
        this.loggedUser.perfil == 'Participante'
      ) {
        this.canEdit = true;
      }

      this.interventionService
        .getInterventionById(this.interventionId)
        .subscribe({
          //complete: () => {},
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loading = false;
          },
          next: (intervention: InterventionDTO) => {
            this.loading = false;
            this.intervention = intervention;

            this.detalle.setValue(this.intervention.detalle);
            this.cambio_estado.setValue(this.intervention.cambio_estado);
            this.created_at.setValue(
              formatDate(this.intervention.created_at, 'dd/MM/yyyy', 'en')
            );

            this.getInterventionCreator(this.intervention.id_usuario);

            this.interventionForm = this.formBuilder.group({
              detalle: this.detalle,
              cambio_estado: this.cambio_estado,
              created_at: this.created_at,
              autor: this.autor,
            });
          },
        });
    }
    //create new
    else {
      this.isReadOnly = false;
      if (this.requestId != null) {
        this.intervention.id_solicitud = this.requestId;
      }

      this.created_at.setValue(formatDate(new Date(), 'dd/MM/yyyy', 'en'));
      this.cambio_estado.setValue('Abierta');
      this.intervention.id_usuario = this.loggedUser.id;
      this.autor.setValue(
        this.loggedUser.nombre + ' ' + this.loggedUser.apellidos
      );
    }
  }

  private getInterventionCreator(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      //complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.error);
      },
      next: (user: UserDTO) => {
        this.autor.setValue(user.nombre + ' ' + user.apellidos);
      },
    });
  }

  saveIntervention(): void {
    this.pressedSave = true;

    if (this.interventionForm.invalid) {
      return;
    }

    this.loading = true;
    this.intervention.detalle = this.detalle.value;
    this.intervention.cambio_estado = this.cambio_estado.value;

    if (this.isUpdateMode) {
      this.editIntervention();
    } else {
      this.createIntervention();
    }
  }

  private createIntervention(): void {
    if (this.intervention.id_usuario) {
      this.interventionService.createIntervention(this.intervention).subscribe({
        //complete: () => { },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al crear la intervención',
            type: 2,
          });
        },
        next: () => {
          this.changeRequestStatus();
        },
      });
    }
  }

  private changeRequestStatus(): void {
    this.requestService
      .updateRequestStatus(
        this.intervention.id_solicitud,
        this.intervention.cambio_estado
      )
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message:
              'Ha habido un error al modificar el estado de la solicitud',
            type: 2,
          });
        },
        next: () => {
          this.loading = false;
          this.sharedService.sendMessage({
            message: 'Intervención creada con éxito',
            type: 1,
          });
          this.router.navigateByUrl('requestList');
        },
      });
  }

  activateEdit() {
    this.isReadOnly = false;
  }

  private editIntervention(): void {
    let responseOK: boolean = false;
    if (this.interventionId) {
      this.interventionService
        .updateIntervention(this.interventionId, this.intervention)
        .subscribe({
          complete: () => {
            if (responseOK) {
              this.sharedService.sendMessage({
                message: 'Intervención editada con éxito',
                type: 1,
              });
              this.router.navigateByUrl('requestList');
            }
          },
          error: (error: HttpErrorResponse) => {
            this.loading = false;
            console.log(error.error);
            this.sharedService.sendMessage({
              message: 'Ha habido un error al editar la intervención',
              type: 2,
            });
          },
          next: () => {
            this.loading = false;
            responseOK = true;
          },
        });
    }
  }

  deleteIntervention(interventionId: string): void {
    // show confirmation popup
    let result = confirm('Confirma para borrar la intervención');

    if (result) {
      let responseOK: boolean = false;
      this.loading = true;
      this.interventionService.deleteIntervention(interventionId).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Intervención eliminada con éxito',
              type: 1,
            });
            this.router.navigateByUrl('requestList');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al eliminar la intervención',
            type: 2,
          });
        },
        next: () => {
          this.loading = false;
          responseOK = true;
        },
      });
    }
  }
}
