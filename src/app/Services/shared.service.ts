import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, throwError } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: number;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private notificationSubject: Subject<ToastMessage> =
    new Subject<ToastMessage>();

  constructor(private toastrService: ToastrService) {
    this.notificationSubject.subscribe(
      (message) => {
        if (message.type == 1) {
          this.toastrService.success(message.message, undefined, {
            positionClass: 'toast-center-center',
          });
        }
        if (message.type == 2) {
          this.toastrService.error(message.message, undefined, {
            positionClass: 'toast-center-center',
          });
        }
        if (message.type == 3) {
          this.toastrService.info(message.message, undefined, {
            positionClass: 'toast-center-center',
          });
        }
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  sendMessage(message: ToastMessage) {
    this.notificationSubject.next(message);
  }
}
