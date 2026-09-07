import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        errorMessage =
          error.error?.message ||
          `Error Code: ${error.status}\nMessage: ${error.message}`;
      }

      console.error('Interceptor Caught Error:', errorMessage);
      
      return throwError(() => new Error(errorMessage));
    })
  );
};