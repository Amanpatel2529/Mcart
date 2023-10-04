import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { ProductService } from '../product.service';
import { Cart } from '../cart/Cart';
import { Product } from '../product';
import { LoginService } from 'src/app/login/login.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector : 'app-product-list',
    templateUrl: 'product-list.component.html',
    styleUrls: ['product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
   
    chkman: any = [];
    chkmanos: any = [];
    rate: number = 0;
    pageTitle = 'mCart';
    imageWidth = 80;
    imageHeight = 120;
    imageMargin = 12;
    showImage = false;
    listFilter: string = '';
   
    manufacturers = [{ 'id': 'Samsung', 'checked': false },
    { 'id': 'Microsoft', 'checked': false },
    { 'id': 'Apple', 'checked': false },
    { 'id': 'Micromax', 'checked': false }
    ];
    os = [{ 'id': 'Android', 'checked': false },
    { 'id': 'Windows', 'checked': false },
    { 'id': 'iOS', 'checked': false }];
    price_range = [{ 'id': '300-450', 'checked': false },
    { 'id': '450-600', 'checked': false },
    { 'id': '600-800', 'checked': false },
    { 'id': '800-1000', 'checked': false }];
    errorMessage: string = '';
    products: Product[] = [];
    selectedItems: any = 0;
    cart!: Cart;
    total = 0;
    orderId = 0;
    selectedManufacturers: string[] = [];
    selectedOStypes: string[] = [];
    selectedPrice: string[] = [];
    checkedManufacturers: any[] = [];
    checkedOS: any[] = [];
    checkedPrice: any[] = [];
    sub: any;
    i = 0;
    sortoption = '';
    chkmanosprice: any = [];

    @ViewChild('loginEl')
    loginVal!: ElementRef;
    @ViewChild('welcomeEl')
    welcomeVal!: ElementRef;

    // Fetches the products data from service class
    constructor(private productService: ProductService, private loginService: LoginService, private renderer: Renderer2, private http:HttpClient) {
    }
    ngAfterViewInit() {
        this.loginVal = this.loginService.loginElement;
        this.welcomeVal = this.loginService.welcomeElement;    

        this.renderer.setProperty(this.loginVal.nativeElement, 'innerText', 'Logout');
       this.renderer.setStyle(this.welcomeVal.nativeElement, 'display', 'inline');
        let welcomeText="Welcome "+this.loginService.username+ "  "; 
        this.renderer.setProperty(this.welcomeVal.nativeElement, 'innerText', welcomeText);
       this.renderer.setStyle(this.welcomeVal.nativeElement, 'color', '#ff0080');

    }
    ngOnInit():void {
        this.productService.getAllProducts().subscribe(products => this.products = products);

        this.orderId++;

        this.productService.getProducts()
            .subscribe({
                next:products => {
                    this.productService.products = products;
                    this.products = this.productService.products; 
                    this.chkmanosprice =this.products
                },
                error:error => this.errorMessage = error});

        if (this.productService.selectedProducts.length > 0) {
            this.selectedItems = Number(sessionStorage.getItem('selectedItems'));
            this.total = Number(sessionStorage.getItem('grandTotal'));
        }
    }
    checkManufacturers(cManuf: any[], cProducts: any[], chkman: any[]) {
        if (cManuf.length > 0) {
            for (let checkManuf of cManuf) {
                for (let checkProd of cProducts) {
                    if (checkProd.manufacturer.toLowerCase() === checkManuf.toLowerCase()) {
                        this.chkman.push(checkProd);


                    }
                }
            }
        } else {
            this.chkman = cProducts;

        }

    }
    checkOpsystem(cOS: any[], chkman: any[], chkmanos: any[]) {

        if (cOS.length > 0) {

            for (let checkOS of cOS) {
                for (let chkmann of chkman) {
                    if (chkmann.ostype.toLowerCase() === checkOS.toLowerCase()) {
                        this.chkmanos.push(chkmann);

                    }
                }
            }
        } else {

            this.chkmanos = chkman;

        }
    }

    checkPrices(checkedPrice: any[], chkmanosprice: any[], chkmanos: any[]) {

        if (checkedPrice.length > 0) {

            for (let checkPrice of checkedPrice) {
                for (let chkmanfos of chkmanos) {
                    if (checkPrice === '300-450') {
                        if (chkmanfos.price >= 300 && chkmanfos.price <= 450) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }
                    if (checkPrice === '450-600') {
                        if (chkmanfos.price > 450 && chkmanfos.price <= 600) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }
                    if (checkPrice === '600-800') {
                        if (chkmanfos.price > 600 && chkmanfos.price <= 800) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }
                    if (checkPrice === '800-1000') {
                        if (chkmanfos.price > 800 && chkmanfos.price <= 1000) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }


                }
            }
        } else {

            this.chkmanosprice = chkmanos;
           
        }
    }
    // filtering functionality
    filter(name: any) {      
        let checkedProducts: any[];
        this.chkman = [];
        this.chkmanos = [];
        this.chkmanosprice = [];
        const index = 0;
        checkedProducts = this.productService.products;     
      
        name.checked = (name.checked) ? false : true;     
        this.checkedManufacturers = this.manufacturers.filter(product => product.checked).map(product => product.id);
        this.checkedOS = this.os.filter(product => product.checked).map(product => product.id);
        this.checkedPrice = this.price_range.filter(product => product.checked).map(product => product.id);
      
        
        this.checkManufacturers(this.checkedManufacturers, checkedProducts, this.chkman);
        this.checkOpsystem(this.checkedOS, this.chkman, this.chkmanos);
        this.checkPrices(this.checkedPrice, this.chkmanosprice, this.chkmanos);
        //this.products = [];
        this.products = this.chkmanosprice;
    }


    // Invoked when user clicks on Add to Cart button
    // Adds selected product details to service class variable 
    // called selectedProducts
    addCart(id: number) {
        this.cart = new Cart();
        this.selectedItems += 1;

        // fetching selected product details
        const product = this.productService.products.filter((currProduct: any) => currProduct.productId === id)[0];
        this.total += product.price;
        sessionStorage.setItem('selectedItems', this.selectedItems);
        const sp = this.productService.selectedProducts.filter((currProduct: any) => currProduct.productId === id)[0];
        if (sp) {
            const index = this.productService.selectedProducts.findIndex((currProduct: any) => currProduct.productId === id);
            this.productService.selectedProducts[index].quantity += 1;
            this.productService.selectedProducts[index].totalPrice += product.price;
        } else {
            this.cart.orderId = 'ORD_' + this.orderId;
            this.cart.productId = id;
            this.cart.userId = sessionStorage.getItem('username') + '';
            this.cart.productName = product.productName;
            this.cart.price = product.price;
            this.cart.quantity = 1;
            this.cart.dateOfPurchase = new Date().toString();
            this.cart.totalPrice = product.price * this.cart.quantity;
            this.productService.selectedProducts.push(this.cart);
            sessionStorage.setItem('selectedProducts', JSON.stringify(this.productService.selectedProducts));
            this.orderId++;
        }
    }

    // Search box functionality
    // Searches based on manufacturer name
    searchtext() {
        this.products = this.productService.products;
        if (this.listFilter.length > 0) {
          this.products = this.products.filter((product: Product) =>
            product.manufacturer.toLowerCase().indexOf(this.listFilter.toLowerCase()) !== -1
          );
        }
      }
      

    // Invoked when a tab (Tablets/Mobiles) is clicked
    // Displays tablets or mobiles data accordingly
    tabselect(producttype: string) {
        this.manufacturers = [{ 'id': 'Samsung', 'checked': false },
        { 'id': 'Microsoft', 'checked': false },
        { 'id': 'Apple', 'checked': false },
        { 'id': 'Micromax', 'checked': false }
        ];
        this.os = [{ 'id': 'Android', 'checked': false },
        { 'id': 'Windows', 'checked': false },
        { 'id': 'iOS', 'checked': false }];
        this.price_range = [{ 'id': '300-450', 'checked': false },
        { 'id': '450-600', 'checked': false },
        { 'id': '600-800', 'checked': false },
        { 'id': '800-1000', 'checked': false }];


        this.products = [];
        this.productService.producttype = producttype;
        this.productService.getProducts().subscribe({
            next: products => {        
                this.products = products;
                this.sortoption='';
            },
            error: error => this.errorMessage = error
        });
      
    }

    // Invoked when user select an option in sort drop down
    // changes the sortoption value accordingly
    onChange(value: string) {
        this.sortoption = value;
    }


    fetchProducts() {
        this.http.get<any[]>('http://localhost:8080/products/').subscribe(
          (response) => {
            this.products = response;
          },
          (error) => {
            console.log(error);
          }
        );
    }
}


