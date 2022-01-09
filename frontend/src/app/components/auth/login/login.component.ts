import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  loginMessage!: string;
  private emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';

  constructor(private readonly auth: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly toastr: ToastrService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]
      ],
      matkhau: ["", [Validators.required, Validators.minLength(9)]]
    });
  }
  get formControls() {
    return this.loginForm.controls;
  }

  resetForm(){
    this.loginForm.reset();
  }

  login(){
    this.submitted = true;
    if(this.loginForm.invalid){
      this.toastr.warning(`Bạn phải nhập email và mật khẩu`, "Vui lòng kiểm tra lại", {
        timeOut: 1500,
        progressAnimation: 'increasing',
        positionClass: 'toast-bottom-right'
      });
      return;
    }
    this.loading = true;
    this.auth.loginUser(this.formControls.email.value, this.formControls.matkhau.value)
      .pipe(first())
      .subscribe(
          data => {
            if (this.auth.currentUserValue) {
              this.toastr.success(`Bạn đã đăng nhập thành công`, "Chúc mừng", {
                timeOut: 1500,
                progressAnimation: 'increasing',
                positionClass: 'toast-bottom-right'
              });
              this.router.navigate(['/']);
            }
            else {
              this.toastr.warning(`Email hoặc mật khẩu không đúng`, "Vui lòng kiểm tra lại", {
                timeOut: 1500,
                progressAnimation: 'increasing',
                positionClass: 'toast-bottom-right'
              });
              this.resetForm();
            }
          },
          error => {
            this.loading = false;
      });
      
      this.auth.loginMessage$.subscribe(msg => {
        this.loginMessage = msg;
        setTimeout(() => {
          this.loginMessage = '';
        }, 2000);
      });
  }
}
