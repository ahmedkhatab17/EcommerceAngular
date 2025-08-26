import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

export const AdminGuard: CanActivateFn = () => {
  const guard = inject(AdminGuardService);
  return guard.canActivate();
};


