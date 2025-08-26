import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IProduct } from '../models/IProduct';
import { environment } from '../../environments/environment.development';
import { ICategory } from '../models/ICategory';
import { IUser, IAuthResponse, ILoginRequest, IRegisterRequest } from '../models/IUser';
import { ICart, IAddToCartRequest, IUpdateCartRequest } from '../models/ICart';
import { IOrder, ICreateOrderRequest } from '../models/IOrder';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token: string = '';

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }

  private loadToken(): void {
    this.token = localStorage.getItem('token') || '';
  }

  private getHeaders(): HttpHeaders {
    this.loadToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }

  register(userData: IRegisterRequest): Observable<IAuthResponse> {
    return this.httpClient.post<IAuthResponse>(`${environment.baseUrl}/auth/register`, userData);
  }

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.httpClient.post<IAuthResponse>(`${environment.baseUrl}/auth/login`, credentials);
  }

  getCurrentUser(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${environment.baseUrl}/auth/me`, { headers: this.getHeaders() });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.baseUrl}/auth/changepassword`, { currentPassword, newPassword }, { headers: this.getHeaders() });
  }

  deleteAccount(): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.baseUrl}/auth/deleteaccount`, { headers: this.getHeaders() });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.baseUrl}/auth/forgotpassword`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.baseUrl}/auth/resetpassword/${token}`, { newPassword });
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return this.token;
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAllProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.baseUrl}/products`);
  }

  getProductById(id: string): Observable<IProduct> {
    return this.httpClient.get<IProduct>(`${environment.baseUrl}/products/${id}`);
  }

  updateProduct(id: string, updates: Partial<IProduct>): Observable<IProduct> {
    return this.httpClient.put<IProduct>(`${environment.baseUrl}/products/${id}`, updates, { headers: this.getHeaders() });
  }

  createProduct(product: { title: string; description: string; price: number; category: string; stock: number; image: string }): Observable<IProduct> {
    return this.httpClient.post<IProduct>(`${environment.baseUrl}/products`, product, { headers: this.getHeaders() });
  }

  getProductsByCategory(categoryId: string): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.baseUrl}/products?category=${categoryId}`);
  }

  searchProducts(query: string): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.baseUrl}/products?search=${query}`);
  }

  getAllCategories(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>(`${environment.baseUrl}/categories`);
  }

  getCategoryById(id: string): Observable<ICategory> {
    return this.httpClient.get<ICategory>(`${environment.baseUrl}/categories/${id}`);
  }

  updateCategory(id: string, updates: Partial<ICategory>): Observable<ICategory> {
    return this.httpClient.put<ICategory>(`${environment.baseUrl}/categories/${id}`, updates, { headers: this.getHeaders() });
  }

  createCategory(data: { title: string; description?: string }): Observable<ICategory> {
    return this.httpClient.post<ICategory>(`${environment.baseUrl}/categories`, data, { headers: this.getHeaders() });
  }

  getCart(): Observable<ICart> {
    return this.httpClient.get<ICart>(`${environment.baseUrl}/cart`, { headers: this.getHeaders() });
  }

  addToCart(cartData: IAddToCartRequest): Observable<ICart> {
    return this.httpClient.post<ICart>(`${environment.baseUrl}/cart/add`, cartData, { headers: this.getHeaders() });
  }

  updateCartItem(cartData: IUpdateCartRequest): Observable<ICart> {
    return this.httpClient.put<ICart>(`${environment.baseUrl}/cart/update`, cartData, { headers: this.getHeaders() });
  }

  removeFromCart(productId: string): Observable<ICart> {
    return this.httpClient.delete<ICart>(`${environment.baseUrl}/cart/remove`, {
      headers: this.getHeaders(),
      body: { productId }
    });
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/cart/clear`, { headers: this.getHeaders() });
  }

  createOrder(orderData: ICreateOrderRequest): Observable<IOrder> {
    return this.httpClient.post<IOrder>(`${environment.baseUrl}/orders`, orderData, { headers: this.getHeaders() });
  }

  getUserOrders(): Observable<IOrder[]> {
    return this.httpClient.get<IOrder[]>(`${environment.baseUrl}/orders/user`, { headers: this.getHeaders() });
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`${environment.baseUrl}/orders/${id}`, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<IOrder[]> {
    return this.httpClient.get<IOrder[]>(`${environment.baseUrl}/orders`, { headers: this.getHeaders() });
  }

  updateOrderStatus(id: string, status: 'pending' | 'done'): Observable<IOrder> {
    return this.httpClient.put<IOrder>(`${environment.baseUrl}/orders/${id}/status`, { status }, { headers: this.getHeaders() });
  }
}
