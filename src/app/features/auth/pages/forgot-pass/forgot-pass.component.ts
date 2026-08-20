import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/service/auth.service';
import { NotificationService } from '../../../../core/service/notification';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.css',
})
export class ForgotPassComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);

  errorMessage: string = '';

  forgotPassForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotPassForm.invalid) {
      this.forgotPassForm.markAllAsTouched();
      return;
    }

    const credentials = this.forgotPassForm.value;

    this.authService.forgotPass(credentials).subscribe({
      next: () => {
        this.notification.show('E-mail de redefinição de senha enviado para seu e-mail meu genin!')
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha ao disparar e-mail de reset de senha, tente novamente mais tarde!';
      }
    })
  }
}
