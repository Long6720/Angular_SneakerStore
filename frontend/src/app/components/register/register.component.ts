import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ComparePassword } from 'src/app/validators/customvalidator.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  submitted = false;

  private emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';

  constructor(private readonly auth: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly toastr: ToastrService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.registerForm = this.fb.group({
      tennd: ["", [Validators.required]],
      diachi: ["", [Validators.required]],
      sdt: ["", [Validators.required, Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(11)]],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]
      ],
      matkhau: ["", [Validators.required, Validators.minLength(9)]],
      confirmPassword: ["", [Validators.required]],
    },{
      validator: ComparePassword('matkhau', 'confirmPassword')
   });
  }
  resetForm(){
    this.registerForm.reset();
  }
  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if(this.registerForm.invalid){
      this.toastr.warning(`Bạn chưa nhập thông tin đăng ký`, "Vui lòng kiểm tra lại", {
        timeOut: 1500,
        progressAnimation: 'increasing',
        positionClass: 'toast-bottom-right'
      });
      return 
    }
      this.auth.registerUser({...this.registerForm.value})
      .pipe(
        map(user => this.router.navigate(['login']))
      ).subscribe();
      this.toastr.success(`Bạn đã đăng ký thành công`, "Chúc mừng", {
        timeOut: 1500,
        progressAnimation: 'increasing',
        positionClass: 'toast-bottom-right'
      });
      this.resetForm();
  }
}

/* Dùng để kiểm tra có bị trùng email... */
// validateUserNameFromAPI(control: AbstractControl): Observable<ValidationErrors | null> {
//   return timer(300).pipe(
//     switchMap(() => {
//       return this.auth.loginUser(control.value).pipe(
//         map(isValid => {
//           if (!isValid) {
//             return {
//               isNotValid: true
//             };
//           }
//           return null;
//         })
//       );
//     })
//   );
// }