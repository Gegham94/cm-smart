import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseI } from '@models/responseData';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  loading = false;
  isShowPopup = false;
  resetPasswordForm: FormGroup;
  errors!: {
    email: string;
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
  ) {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submitForm(): void {
    this.loading = true;
    const values = this.resetPasswordForm.getRawValue();
    this.authService.resetPassword(values).subscribe(
      (response: ResponseI<[]>): void => {
        if (response.success === true) {
          this.toastr.success(
            'Check Your E-mail to see new password.',
            'Password successfuly changed.',
          );
          this.router.navigate(['']);
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          this.toastr.error('User not found', 'Wrong!');
        }
      },
      (err) => {
        this.errors = err.error.errors;
        this.loading = false;
      },
    );
  }

  closePopup(): void {
    this.isShowPopup = false;
  }
}
