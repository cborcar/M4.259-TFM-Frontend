import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestDTO } from 'src/app/Models/request.dto';
import { RequestsService } from 'src/app/Services/requests.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  requests!: RequestDTO[];
  showEmptyMessage: boolean;
  public loading = false;

  constructor(private router: Router, private requestService: RequestsService) {
    this.showEmptyMessage = false;
  }

  ngOnInit(): void {
    this.loadRequests('Pendientes');
  }

  loadRequests(status: string): void {
    this.loading = true;
    this.showEmptyMessage = false;
    this.requestService.getRequestByStatus(status).subscribe({
      //complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.error);
      },
      next: (requests: RequestDTO[]) => {
        this.loading = false;
        this.requests = requests;
        if (this.requests.length === 0) {
          this.showEmptyMessage = true;
        }
      },
    });
  }

  requestForm(requestId: string): void {
    this.router.navigateByUrl('request/' + requestId);
  }
}
