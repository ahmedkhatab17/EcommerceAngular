import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { ICart } from '../../models/ICart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: ICart | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to load cart';
        this.loading = false;
        console.error('Cart loading error:', err);
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartService.updateCartItem(productId, quantity).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error updating cart:', err);
        this.error = 'Failed to update cart';
      }
    });
  }

  onQuantityChange(event: Event, productId: string): void {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      const quantity = parseInt(target.value, 10);
      this.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item';
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
          this.error = 'Failed to clear cart';
        }
      });
    }
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  proceedToCheckout(): void {
    if (this.cart && this.cart.items.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}
