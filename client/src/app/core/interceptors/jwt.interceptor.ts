import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { exhaustMap, Observable, take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  token?: string;

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //return next.handle(request);
    // return this.accountService.currentUser$.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     //console.log(user);
    //       if(!user){
    //           return next.handle(request);
    //       }
    //       const modifiedReq = request.clone({headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`)})
    //       return next.handle(modifiedReq);
    //   }));
    this.accountService.currentUser$.pipe(take(1)).subscribe({next: user => this.token = user?.token})
    
    if (this.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      })
    }
    return next.handle(request);
  }
}
