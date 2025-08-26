import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ApiService } from '../../service/apiservice.service';
import { IUser } from '../../models/IUser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: IUser | null = null;
  isEditing = false;
  loading = false;
  error = '';
  success = '';
  isResetMode = false;

  profileData = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    resetCode: ''
  };

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileData.name = this.user.name;
      this.profileData.email = this.user.email;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.isResetMode = false;
    this.error = '';
    this.success = '';

    if (!this.isEditing) {
      this.loadUserProfile(); // Reset form
    }
  }

  updateProfile(): void {
    if (!this.profileData.name || !this.profileData.email) {
      this.error = 'Name and email are required';
      return;
    }

    if (this.profileData.newPassword && this.profileData.newPassword !== this.profileData.confirmPassword) {
      this.error = 'New passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const performUpdate = () => {
      if (this.user) {
        this.user.name = this.profileData.name;
        this.user.email = this.profileData.email;
        this.authService.updateCurrentUser(this.user);
      }
      this.loading = false;
      this.success = 'Profile updated successfully!';
      this.isEditing = false;
    };

    if (this.isResetMode && this.profileData.newPassword) {
      // Use email reset code flow
      this.apiService.resetPassword(this.profileData.resetCode, this.profileData.newPassword).subscribe({
        next: () => performUpdate(),
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Failed to reset password';
        }
      });
    } else if (this.profileData.newPassword) {
      this.apiService.changePassword(this.profileData.currentPassword, this.profileData.newPassword).subscribe({
        next: () => performUpdate(),
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Failed to change password';
        }
      });
    } else {
      performUpdate();
    }
  }

  sendResetCode(): void {
    if (!this.profileData.email) {
      this.error = 'Email is required';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.apiService.forgotPassword(this.profileData.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.isResetMode = true;
        this.success = res.message || 'Reset code sent to your email.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to send reset code';
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserProfile();
    this.error = '';
    this.success = '';
  }

  getInitials(): string {
    if (!this.user?.name) return '';
    return this.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  deleteAccount(): void {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }
    this.loading = true;
    this.apiService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to delete account';
      }
    });
  }
}
