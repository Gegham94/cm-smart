import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.auth_key) {
      request = request.clone({
        setHeaders: {
          auth_key: currentUser.auth_key,
        },
      });
    }

    return next.handle(request).pipe(
      tap(
        (res: any) => {
          if (res?.body?.success === false) {
            this.authService.updateCurrentUserValue(null);
            localStorage.removeItem('currentUser');
            this.router.navigate(['']);
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 400) {
              return;
            }
            this.authService.updateCurrentUserValue(null);
            localStorage.removeItem('currentUser');
            this.router.navigate(['']);
          }
        },
      ),
    );
  }
}
