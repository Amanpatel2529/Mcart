import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements AfterViewInit {
  [x: string]: any;
  
    loginTitle = 'Login';
    userName = '';
    welcomeMessage = '';
    @ViewChild('loginEl')
    loginVal!: ElementRef;
    @ViewChild('welcomeEl')
    welcomeVal!: ElementRef;

    constructor(private loginService: LoginService, private router: Router, private renderer: Renderer2) {
               
    }
ngOnInit(){}
    ngAfterViewInit() {
        this.userName = this.loginService.username;     
        this.loginService.loginElement = this.loginVal;
        this.loginService.welcomeElement = this.welcomeVal;        
    }

    // Invoked when user clicks on login button
    // Navigates to login page
    login() {
        const value = this.loginVal.nativeElement.innerText;
        this.loginTitle='';
        if (value === 'Login') {
           this.router.navigate(['/login']);
        } else if (value === 'Logout') {
            sessionStorage.clear();
            this.loginTitle = 'Login';
            this.renderer.setProperty(this.loginVal.nativeElement, 'innerText', 'Login');
            this.renderer.setStyle(this.welcomeVal.nativeElement, 'display', 'none');
            this.router.navigate(['/welcome']);
        }
    }
}
