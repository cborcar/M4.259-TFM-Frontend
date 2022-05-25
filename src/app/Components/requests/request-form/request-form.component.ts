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
import { RequestDTO } from 'src/app/Models/request.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { InterventionsService } from 'src/app/Services/interventions.service';
import { RequestsService } from 'src/app/Services/requests.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent implements OnInit {
  request: RequestDTO;
  interventions!: InterventionDTO[];
  interventionCreator: string[] = [];
  requestForm: FormGroup;
  detalle: FormControl;
  created_at: FormControl;
  autor: FormControl;
  tipo: FormControl;
  canEdit: boolean;
  pressedSave: boolean;
  isReadOnly: boolean;
  isUpdateMode: boolean;
  haveInterventions: boolean;

  public loading: boolean = false;
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
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
    this.request = new RequestDTO('', '', '', new Date(), '');
    this.canEdit = false;
    this.isUpdateMode = false;
    this.pressedSave = false;
    this.isReadOnly = true;
    this.haveInterventions = false;

    this.detalle = new FormControl('', [Validators.required]);
    this.created_at = new FormControl('', [Validators.required]);
    this.autor = new FormControl('', [Validators.required]);
    this.tipo = new FormControl('', [Validators.required]);

    this.requestForm = this.formBuilder.group({
      detalle: this.detalle,
      created_at: this.created_at,
      tipo: this.tipo,
      autor: this.autor,
    });
  }

  ngOnInit(): void {
    // update
    if (this.requestId) {
      this.loading = true;
      this.isUpdateMode = true;
      if (
        this.loggedUser.perfil == 'Administrador' ||
        this.loggedUser.perfil == 'Participante'
      ) {
        this.canEdit = true;
      }

      this.requestService.getRequestById(this.requestId).subscribe({
        //complete: () => {},
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
          this.loading = false;
        },
        next: (request: RequestDTO) => {
          this.request = request;

          this.detalle.setValue(this.request.detalle);
          this.tipo.setValue(this.request.tipo);
          this.created_at.setValue(
            formatDate(this.request.created_at, 'dd/MM/yyyy', 'en')
          );

          this.getRequestCreator(this.request.id_usuario);

          this.requestForm = this.formBuilder.group({
            detalle: this.detalle,
            tipo: this.tipo,
            created_at: this.created_at,
            autor: this.autor,
          });
        },
      });
    }
    //create new
    else {
      this.isReadOnly = false;
      this.created_at.setValue(formatDate(new Date(), 'dd/MM/yyyy', 'en'));
      this.tipo.setValue('Averia');

      this.request.id_usuario = this.loggedUser.id;
      this.autor.setValue(
        this.loggedUser.nombre + ' ' + this.loggedUser.apellidos
      );
    }
  }

  private getRequestCreator(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      //complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.error);
      },
      next: (user: UserDTO) => {
        this.autor.setValue(user.nombre + ' ' + user.apellidos);
        this.getInterventions(this.request.id);
      },
    });
  }

  saveRequest(): void {
    this.pressedSave = true;

    if (this.requestForm.invalid) {
      return;
    }

    this.loading = true;
    this.request.detalle = this.detalle.value;
    this.request.tipo = this.tipo.value;

    if (this.isUpdateMode) {
      this.editRequest();
    } else {
      this.createRequest();
    }
  }

  private createRequest(): void {
    this.request.estado = 'Abierta';
    let responseOK: boolean = false;

    if (this.request.id_usuario) {
      this.requestService.createRequest(this.request).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Solicitud creada con éxito',
              type: 1,
            });
            this.router.navigateByUrl('requestList');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al crear la solicitud',
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

  activateEdit() {
    this.isReadOnly = false;
  }

  private editRequest(): void {
    let responseOK: boolean = false;
    if (this.requestId) {
      this.requestService
        .updateRequest(this.requestId, this.request)
        .subscribe({
          complete: () => {
            if (responseOK) {
              this.sharedService.sendMessage({
                message: 'Solicitud editada con éxito',
                type: 1,
              });
              this.router.navigateByUrl('requestList');
            }
          },
          error: (error: HttpErrorResponse) => {
            this.loading = false;
            console.log(error.error);
            this.sharedService.sendMessage({
              message: 'Ha habido un error al editar la solicitud',
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

  deleteRequest(requestId: string): void {
    // show confirmation popup
    let result = confirm('Confirma para borrar la solicitud');

    if (result) {
      let responseOK: boolean = false;
      this.loading = true;
      this.requestService.deleteRequest(requestId).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Solicitud eliminada con éxito',
              type: 1,
            });
            this.router.navigateByUrl('requestList');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al eliminar la solicitud',
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

  private getInterventions(requestId: string): void {
    this.interventionService.getInterventionsByRequestId(requestId).subscribe({
      //complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.error);
      },
      next: (interventions: InterventionDTO[]) => {
        this.loading = false;
        this.interventions = interventions;
        const interventionsLength = this.interventions.length;
        if (interventionsLength > 0) {
          this.haveInterventions = true;
          for (let i = 0; i < interventionsLength; i++) {
            this.userService
              .getUserById(this.interventions[i].id_usuario)
              .subscribe({
                error: (error: HttpErrorResponse) => {
                  console.log(error.error);
                },
                next: (user: UserDTO) => {
                  this.interventionCreator[i] =
                    user.nombre + ' ' + user.apellidos;
                },
              });
          }
        }
      },
    });
  }

  interventionForm(interventionId: string): void {
    this.router.navigateByUrl(
      'intervention/' + this.request.id + '/' + interventionId
    );
  }
}
