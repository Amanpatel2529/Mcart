import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Login } from './Login';
import { LoginService } from './login.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    login = new Login();
    users: Login[] = [];
    valid = true;    
    @ViewChild('uname') usernameElement!: ElementRef; 
    loginForm!: FormGroup;

    constructor(private router: Router, private formBuilder: FormBuilder,
        private loginService: LoginService, private renderer: Renderer2) {
    }

    ngOnInit() {
        // Makes a service call to fetch users data from the backend
        this.loginService.getUsers().subscribe({next:users => this.users = users});
        this.loginForm = this.formBuilder.group({
            userName: [this.login.userName, Validators.required],
            password: [this.login.password, Validators.required]
        })
    }

    // Invoked when user clicks submit in login form
    // Validates the credentials with the data fetched from the backend
    onSubmit() {
        
         //fetches the form object containing the values of all the form controls
        this.login = this.loginForm.getRawValue();      
        const user = this.users.filter(currUser => currUser.userName === this.login.userName && currUser.password === this.login.password)[0];
        if (user) {
             this.loginService.username = this.login.userName;      
            this.router.navigate(['/products']);
        } else {
            this.valid = false;
        }
    }
}
