import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/service/notification';

@Component({
  selector: 'app-reset-pass',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css',
})
export class ResetPass {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  errorMessage: string = '';

  resetPassForm: FormGroup = this.formBuild.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit(): void {
    if (this.resetPassForm.invalid) {
      this.resetPassForm.markAllAsTouched();
      return;
    }

    const token = this.route.snapshot.queryParams['token'] || '';
    const userData = {
      ...this.resetPassForm.value,
      token: token
    }

    this.authService.resetPass(userData).subscribe({
      next: () => {
        this.notification.show('Senha alterada com sucesso, maravilha meu genin!')
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha ao realizar o reset de senha!';
      }
    })
  }
}
