import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseI } from '@models/responseData';
import { Login } from '@models/login';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup;

  errors!: {
    username: string;
    password: string;
  };

  constructor(
    private toastr: ToastrService,
    public authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submitForm(): void {
    this.loading = true;
    const values = this.loginForm.getRawValue();
    this.authService.login(values).subscribe(
      (response: ResponseI<Login>) => {
        if (response.success === true) {
          // user successfully logged
          this.router.navigate(['system']);
          this.toastr.success('User successfully logged', 'Greate !');
        } else {
          // incorrect ogin or password
          this.toastr.error('Incorrect login or password.', 'Wrong!');
          // this.loading = false;
          setTimeout(() => (this.loading = false), 300);
        }
      },
      (err) => {
        this.errors = err.error.errors;
        this.loading = false;
      },
    );
  }
}
