import { Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { finalize, takeUntil, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  swal = Swal;
  constructor(private snackBar: MatSnackBar) {}

  showNotification(
    colorName: any,
    text: any,
    placementFrom: any = 'top',
    placementAlign: any = 'right'
  ) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  showConfirmDialog(
    title: string,
    content: string,
    action?: Observable<any>,
    processingText?: string
  ): Observable<any> {
    if (action) {
      return from(
        this.swal.fire({
          title: title,
          text: content,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3F51B5',
          cancelButtonColor: '#F44336',
          confirmButtonText: 'Yes'
        })
      ).pipe(
        flatMap(isConfirmed => {
          if (isConfirmed.value) {
            if (processingText) {
              return this.showProcessingDialog(processingText, action);
            } else {
              return of({});
            }
          } else {
            return of({});
          }
        })
      );
    } else {
      return from(
        this.swal.fire({
          title: title,
          text: content,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3F51B5',
          cancelButtonColor: '#F44336',
          confirmButtonText: 'Yes'
        })
      );
    }
  }

  showProcessingDialog(text: string, action: Observable<any>) {
    return from(
      this.swal.fire({
        showCancelButton: true,
        showConfirmButton: false,
        html: `<div class="my-3">
      <div class="preloader pl-size-sm mb-1">
        <div class="spinner-layer pl-purple">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <p>${text}</p>
    </div>`
      })
    ).pipe(
      takeUntil(action),
      finalize(() => {
        this.swal.close();
      })
    );
  }
}
