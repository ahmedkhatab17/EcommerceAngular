import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../models/ICategory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainComponent } from '../main/main.component';
import { ApiService } from '../../service/apiservice.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MainComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  today: Date = new Date();
  totalPrice: number = 0;
  selectedCategory: string = 'all';
  categories: ICategory[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.apiService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = [
          { _id: 'all', title: 'All Categories' },
          ...categories
        ];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  updateTotalPrice(price: number): void {
    this.totalPrice = price;
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
  }
}
