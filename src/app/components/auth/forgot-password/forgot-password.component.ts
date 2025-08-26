import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/apiservice.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';
  error = '';

  constructor(private apiService: ApiService) {}

  submit(): void {
    if (!this.email) {
      this.error = 'Email is required';
      return;
    }
    this.loading = true;
    this.error = '';
    this.message = '';
    this.apiService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.message = res.message || 'If this email exists, a reset code has been sent.';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send reset email';
        this.loading = false;
      }
    });
  }
}


