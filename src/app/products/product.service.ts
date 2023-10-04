import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'

import { Product } from './product';

@Injectable()
export class ProductService {

    private apiUrl = 'http://localhost:8080/api/products';
    selectedProducts: any = [];
    products: any = [];
    producttype="tablet";
    username: string = '';


    // Fetches selectedProducts data from the sessionStorage
    constructor(private http: HttpClient) {
        
        if (sessionStorage.getItem('selectedProducts')) {
            this.selectedProducts = JSON.parse(sessionStorage.getItem('selectedProducts') + '');
        }
    }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
      }
    
      createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
      }

    // Makes a get request to backend to fetch products data
    getProducts(): Observable<Product[]> {
        if (this.producttype === 'tablet') {
            return this.http.get<Product[]>('./assets/products/tablets.json').pipe(
                tap((products) => this.products = products),
                catchError(this.handleError));
        } else if (this.producttype === 'mobile') {
            return this.http.get<Product[]>('./assets/products/mobiles.json').pipe(
                tap((products) => this.products = products),
                catchError(this.handleError));
        }
        else
         throw new Error();
    }

    // Fetches the selected product details
    getProduct(id: number): Observable<Product> {
        return this.getProducts().pipe(
            map(products => products.filter(product => product.productId === id)[0]));
    }

    // Error Handling code
    private handleError(err: HttpErrorResponse) {
        return throwError(() => err.error() || 'Server error');
    }
}
