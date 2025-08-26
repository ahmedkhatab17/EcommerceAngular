import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICart, ICartItem, IAddToCartRequest, IUpdateCartRequest } from '../models/ICart';
import { IProduct } from '../models/IProduct';
import { ApiService } from './apiservice.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<ICart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    // Listen to authentication changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  private loadCart(): void {
    if (this.authService.isAuthenticated()) {
      this.apiService.getCart().subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          this.cartSubject.next(null);
        }
      });
    } else {
      this.cartSubject.next(null);
    }
  }

  addToCart(product: IProduct, quantity: number): Observable<ICart> {
    const cartData: IAddToCartRequest = {
      productId: product._id,
      quantity: quantity
    };

    return new Observable(observer => {
      this.apiService.addToCart(cartData).subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
          observer.next(cart);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  updateCartItem(productId: string, quantity: number): Observable<ICart> {
    const cartData: IUpdateCartRequest = {
      productId: productId,
      quantity: quantity
    };

    return new Observable(observer => {
      this.apiService.updateCartItem(cartData).subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
          observer.next(cart);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  removeFromCart(productId: string): Observable<ICart> {
    return new Observable(observer => {
      this.apiService.removeFromCart(productId).subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
          observer.next(cart);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  clearCart(): Observable<any> {
    return new Observable(observer => {
      this.apiService.clearCart().subscribe({
        next: () => {
          this.cartSubject.next({ _id: '', user: '', items: [] });
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getCart(): ICart | null {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    const cart = this.getCart();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    const cart = this.getCart();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  refreshCart(): void {
    this.loadCart();
  }

  forceRefreshCart(): void {
    if (this.authService.isAuthenticated()) {
      this.apiService.getCart().subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
        },
        error: (error) => {
          console.error('Error force refreshing cart:', error);
          this.cartSubject.next(null);
        }
      });
    } else {
      this.cartSubject.next(null);
    }
  }
}
