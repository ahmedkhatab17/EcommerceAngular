import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { ApiService } from '../../service/apiservice.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.testApiConnection();
  }

  loadProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (products) => {
        console.log('✅ Products loaded:', products.length);
      },
      error: (error) => {
        console.error('❌ Failed to load products:', error);
      }
    });
  }

  loadCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (categories) => {
        console.log('✅ Categories loaded:', categories.length);
      },
      error: (error) => {
        console.error('❌ Failed to load categories:', error);
      }
    });
  }

  testApiConnection(): void {
    this.apiService.getAllProducts().subscribe({
      next: (products) => {
        console.log('✅ API Connection successful! Products loaded:', products.length);
      },
      error: (error) => {
        console.error('❌ API Connection failed:', error);
        console.log('Current baseUrl:', environment.baseUrl);
      }
    });
  }
}
