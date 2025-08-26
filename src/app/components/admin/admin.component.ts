import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/apiservice.service';
import { IProduct } from '../../models/IProduct';
import { IOrder } from '../../models/IOrder';
import { ICategory } from '../../models/ICategory';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: IProduct[] = [];
  orders: IOrder[] = [];
  categories: ICategory[] = [];
  selectedCategoryId: string = '';
  categoryTypesInput: string = '';
  loading = false;
  error = '';

  // Create product form model
  newProduct: { title: string; description: string; price: number; stock: number; image: string; category: string } = {
    title: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    category: ''
  };
  newCategoryTitle: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.apiService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });

    this.apiService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      }
    });

    this.apiService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        if (cats.length && !this.selectedCategoryId) {
          this.selectedCategoryId = cats[0]._id;
          this.categoryTypesInput = (cats[0].types || []).join(',');
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  updateStock(product: IProduct, newStock: number): void {
    if (newStock < 0) return;
    this.apiService.updateProduct(product._id, { stock: newStock }).subscribe({
      next: (updated) => {
        const idx = this.products.findIndex(p => p._id === updated._id);
        if (idx !== -1) this.products[idx] = updated;
      },
      error: (err) => {
        console.error('Failed to update stock', err);
      }
    });
  }

  updateProduct(product: IProduct): void {
    const updates: Partial<IProduct> = {
      title: product.title,
      price: product.price,
      stock: product.stock
    } as any;
    this.apiService.updateProduct(product._id, updates).subscribe({
      next: (updated) => {
        const idx = this.products.findIndex(p => p._id === updated._id);
        if (idx !== -1) this.products[idx] = updated;
      },
      error: (err) => {
        console.error('Failed to update product', err);
      }
    });
  }

  updateOrderStatus(order: IOrder, status: 'pending' | 'done'): void {
    this.apiService.updateOrderStatus(order._id, status).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o._id === updated._id);
        if (idx !== -1) this.orders[idx] = updated;
      },
      error: (err) => {
        console.error('Failed to update order status', err);
      }
    });
  }

  saveCategoryTypes(): void {
    const cat = this.categories.find(c => c._id === this.selectedCategoryId);
    if (!cat) return;
    const types = this.categoryTypesInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    this.apiService.updateCategory(cat._id, { types } as any).subscribe({
      next: (updated: any) => {
        const idx = this.categories.findIndex(c => c._id === updated._id);
        if (idx !== -1) this.categories[idx] = updated;
      },
      error: (err) => console.error('Failed to save category types', err)
    });
  }

  createProduct(): void {
    if (!this.newProduct.title || !this.newProduct.description || !this.newProduct.image || !this.newProduct.category) {
      return;
    }
    const payload = {
      title: this.newProduct.title,
      description: this.newProduct.description,
      price: Number(this.newProduct.price) || 0,
      stock: Number(this.newProduct.stock) || 0,
      image: this.newProduct.image,
      category: this.newProduct.category
    };
    this.apiService.createProduct(payload).subscribe({
      next: (created) => {
        this.products = [created, ...this.products];
        this.newProduct = { title: '', description: '', price: 0, stock: 0, image: '', category: '' };
      },
      error: (err) => {
        console.error('Failed to create product', err);
      }
    });
  }

  addCategory(): void {
    const title = (this.newCategoryTitle || '').trim();
    if (!title) return;
    this.apiService.createCategory({ title }).subscribe({
      next: (created) => {
        this.categories = [created, ...this.categories];
        this.newCategoryTitle = '';
      },
      error: (err) => console.error('Failed to create category', err)
    });
  }
}


