import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IOrder } from '../../models/IOrder';
import { ApiService } from '../../service/apiservice.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  order: IOrder | null = null;
  orderId: string = '';
  loading = true;
  error = '';
  savingStatus = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      if (this.orderId) {
        this.loadOrderDetails();
      } else {
        this.error = 'No order ID provided';
        this.loading = false;
      }
    });
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.apiService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order:', err);
        this.error = 'Failed to load order details';
        this.loading = false;
      }
    });
  }

  getOrderTotal(): number {
    if (!this.order) return 0;
    return this.order.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getOrderItemCount(): number {
    if (!this.order) return 0;
    return this.order.products.reduce((total, item) => total + item.quantity, 0);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge bg-warning';
      case 'done':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  updateStatus(newStatus: 'pending' | 'done'): void {
    if (!this.order) return;
    this.savingStatus = true;
    this.apiService.updateOrderStatus(this.order._id, newStatus).subscribe({
      next: (updated) => {
        this.order = { ...updated };
        this.savingStatus = false;
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        this.savingStatus = false;
      }
    });
  }

  editProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}
