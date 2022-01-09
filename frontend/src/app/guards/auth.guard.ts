
import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router,
    private auth: AuthService,
    private toastr: ToastrService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const currentUser = this.auth.currentUserValue;
      if(currentUser) {return true;}

      this.router.navigate(['auth/login'], {queryParams: {returnUrl: state.url }});
      this.toastr.warning(`Bạn phải đăng nhập mới sử dụng chức năng này.`, "Thông báo", {
        timeOut: 1500,
        progressAnimation: 'increasing',
        positionClass: 'toast-bottom-right'
      })
      return false;
    }
  
}
