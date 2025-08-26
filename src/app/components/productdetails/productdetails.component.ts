import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../models/IProduct';
import { ApiService } from '../../service/apiservice.service';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;
  prdId: string | null;
  totalPrice: number = 0;
  quantity: number = 1;
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService,
    private _router: Router,
    private _location: Location
  ) {
    this.prdId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.prdId = params.get('id');
      if (this.prdId) {
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    if (!this.prdId) return;

    this.loading = true;
    this.apiService.getProductById(this.prdId).subscribe({
      next: (data) => {
        this.product = data;
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.error = 'Failed to load product details';
        this.loading = false;
      }
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.quantity * this.product.price;
  }

  onQuantityChange(): void {
    if (this.quantity > this.product.stock) {
      this.quantity = this.product.stock;
    }
    if (this.quantity < 1) {
      this.quantity = 1;
    }
    this.calculateTotal();
  }

  addToCart(): void {
    if (!this.authService.isAuthenticated()) {
      this._router.navigate(['/login']);
      return;
    }

    if (this.quantity > 0 && this.quantity <= this.product.stock) {
      this.cartService.addToCart(this.product, this.quantity).subscribe({
        next: () => {
          // You could add a toast notification here
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
        }
      });
    }
  }

  goBack() {
    this._location.back();
  }

  next() {
    this.apiService.getAllProducts().subscribe({
      next: (products) => {
        const idArr = products.map(p => p._id);
        const index = idArr.findIndex(id => id === this.prdId);
        if (index !== -1) {
          if (index === idArr.length - 1) {
            this._router.navigate(['/product', idArr[0]]);
          } else {
            this._router.navigate(['/product', idArr[index + 1]]);
          }
        }
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  previous() {
    this.apiService.getAllProducts().subscribe({
      next: (products) => {
        const idArr = products.map(p => p._id);
        const index = idArr.findIndex(id => id === this.prdId);
        if (index !== -1) {
          if (index === 0) {
            this._router.navigate(['/product', idArr[idArr.length - 1]]);
          } else {
            this._router.navigate(['/product', idArr[index - 1]]);
          }
        }
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }
}
