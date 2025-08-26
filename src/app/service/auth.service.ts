import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser, IAuthResponse, ILoginRequest, IRegisterRequest } from '../models/IUser';
import { ApiService } from './apiservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    if (this.apiService.isAuthenticated()) {
      this.apiService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    } else {
      this.currentUserSubject.next(null);
    }
  }

  register(userData: IRegisterRequest): Observable<IAuthResponse> {
    return new Observable(observer => {
      this.apiService.register(userData).subscribe({
        next: (response) => {
          this.apiService.setToken(response.token);
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return new Observable(observer => {
      this.apiService.login(credentials).subscribe({
        next: (response) => {
          this.apiService.setToken(response.token);
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  logout(): void {
    this.apiService.logout();
    this.currentUserSubject.next(null);
    // Clear any cached data to prevent data leakage
    this.clearUserData();
  }

  private clearUserData(): void {
    // Clear any user-specific data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    // Clear any other user-specific cached data
  }

  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.apiService.isAuthenticated();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateCurrentUser(updatedUser: IUser): void {
    this.currentUserSubject.next(updatedUser);
  }

  // Refresh current user data from server
  refreshCurrentUser(): void {
    if (this.apiService.isAuthenticated()) {
      this.apiService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }
}
