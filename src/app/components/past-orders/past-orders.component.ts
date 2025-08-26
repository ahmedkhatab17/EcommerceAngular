import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ApiService } from '../../service/apiservice.service';
import { IOrder } from '../../models/IOrder';

@Component({
  selector: 'app-past-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './past-orders.component.html',
  styleUrls: ['./past-orders.component.css']
})
export class PastOrdersComponent implements OnInit {
  orders: IOrder[] = [];
  loading = false;
  error = '';
  selectedOrder: IOrder | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.apiService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        if (err.status === 401) {
          this.error = 'Please login to view your orders';
          this.router.navigate(['/login']);
        } else if (err.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Failed to load orders. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  viewOrderDetails(order: IOrder): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
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

  getOrderTotal(order: IOrder): number {
    return order.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getOrderItemCount(order: IOrder): number {
    return order.products.reduce((total, item) => total + item.quantity, 0);
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
}
