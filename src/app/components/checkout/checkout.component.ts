import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { ApiService } from '../../service/apiservice.service';
import { ICart } from '../../models/ICart';
import { IOrder, ICreateOrderRequest } from '../../models/IOrder';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: ICart | null = null;
  loading: boolean = false;
  error: string = '';
  orderData = {
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'credit_card'
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        if (!cart || cart.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (err) => {
        this.error = 'Failed to load cart';
      }
    });
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  placeOrder(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.error = 'Cart is empty';
      return;
    }

    this.loading = true;
    const orderRequest: ICreateOrderRequest = {
      items: this.cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress: this.orderData.shippingAddress,
      paymentMethod: this.orderData.paymentMethod,
      totalAmount: this.getCartTotal()
    };

    this.apiService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.cartService.clearCart().subscribe(() => {
          this.router.navigate(['/order-confirmation', order._id]);
        });
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.error = 'Failed to place order';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
