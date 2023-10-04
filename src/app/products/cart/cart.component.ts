import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../product.service';
import { Cart } from './Cart';

@Component({
    templateUrl: 'cart.component.html',
    styleUrls: ['cart.component.css']
})
export class CartComponent {
    pageTitle = 'My Cart';
    selectedProducts: any = [];
    imageWidth = 50;
    imageMargin = 2;
    grandTotal: any = 0;
    quantity: any = 0;
    submit: boolean;

    // fetches the selectedProducts from the service class and calculates
    // grandTotal and quantity which are then stored in a sessionStorage
    constructor(private productService: ProductService,
        private route: ActivatedRoute, private router: Router) {
        this.submit = true;
        this.selectedProducts = this.productService.selectedProducts;
        for (let selProducts of this.selectedProducts) {
            this.grandTotal += selProducts.totalPrice;
            this.quantity += selProducts.quantity;
        }
        sessionStorage.setItem('grandTotal', this.grandTotal);
        sessionStorage.setItem('selectedItems', this.quantity);
    }

    //Updates the cart if user changes the quantity in the page
    updateCart(product: Cart) {
        product.totalPrice = product.price * product.quantity;
        this.grandTotal = 0;
        this.quantity = 0;
        for (let selProducts of this.selectedProducts) {
            this.grandTotal += selProducts.totalPrice;
            this.quantity += selProducts.quantity;
        }
        sessionStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
        sessionStorage.setItem('grandTotal', this.grandTotal);
        sessionStorage.setItem('selectedItems', this.quantity);
    }

    // deletes the selected product if delete icon is clicked
    remove(index: number) {
        this.selectedProducts.splice(index, 1);
        this.grandTotal = 0;
        this.quantity = 0;
        for (let selProducts of this.selectedProducts) {
            this.grandTotal += selProducts.totalPrice;
            this.quantity += selProducts.quantity;
        }
        sessionStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
        sessionStorage.setItem('grandTotal', this.grandTotal);
        sessionStorage.setItem('selectedItems', this.quantity);
    }

    // Invoked when user clicks on 'Continue Shopping' button on the page
    onBack(): void {
        this.router.navigate(['/products', this.selectedProducts]);
    }

    // Invoked when checkout button is clicked
    // Removes the selectedProducts data
    checkout() {
        this.submit = false;
        this.productService.selectedProducts = [];
        sessionStorage.removeItem('selectedProducts');
    }

    // Invoked when user clicks on 'Goto Products Page' in Thank you section
    // Navigates to products page
    gotoProducts() {
        sessionStorage.removeItem('grandTotal');
        sessionStorage.removeItem('selectedItems');
        this.router.navigate(['/products']);
    }
}
