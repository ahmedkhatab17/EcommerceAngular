import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../models/IProduct';
import { MyStyleDirective } from '../../directives/my-style.directive';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/apiservice.service';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, MyStyleDirective, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnChanges, OnInit {
  products: IProduct[] = [];
  filteredProduct: IProduct[] = [];
  loading: boolean = false;
  error: string = '';

  @Input() CatId: string = 'all';
  @Output() priceUpdated = new EventEmitter<number>();

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService,
    private _router: Router
  ) {
    this.loadProducts();
  }

  ngOnInit(): void {
    // Initial load
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['CatId']) {
      this.filterProducts();
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filterProducts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    if (this.CatId === 'all') {
      this.filteredProduct = this.products;
    } else {
      this.filteredProduct = this.products.filter(product => product.category._id === this.CatId);
    }
    this.updateTotalPriceOnFilter();
  }

  updateTotalPrice(): void {
    const totalPrice = this.filteredProduct.reduce((sum, product) => sum + product.price, 0);
    this.priceUpdated.emit(totalPrice);
  }

  private updateTotalPriceOnFilter(): void {
    setTimeout(() => {
      this.updateTotalPrice();
    }, 100);
  }

  trackByProductId(index: number, product: IProduct): string {
    return product._id;
  }

  addToCart(product: IProduct, quantity: number): void {
    if (!this.authService.isAuthenticated()) {
      this._router.navigate(['/login']);
      return;
    }

    if (quantity > 0 && quantity <= product.stock) {
      this.cartService.addToCart(product, quantity).subscribe({
        next: () => {
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
        }
      });
    }
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product._id === id);
  }

  getDetails(id: string): void {
    this._router.navigate(['/product', id]);
  }
}
