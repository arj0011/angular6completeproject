import { Component } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { GlobalApp } from './helpers/global';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	
  	loginForm:FormGroup;
  	submitted=false;
	  loading=false;
  	islogin=0;
  	userData=[];
  	
  	public constructor(
  	private titleService: Title,
  	private formBuilder:FormBuilder,
  	private router:Router,
  	private authenticationService: AuthenticationService,
    public globalApp: GlobalApp ) { }
  
	public setTitle( newTitle: string) {
		this.titleService.setTitle( newTitle );
	}
	
	ngOnInit(){
		
    if(localStorage.getItem('currentUser')){
      this.userData = this.globalApp.localStorageItem();
      this.islogin = 1;
      this.router.navigate(['/dashboard']);
    }else{
      this.router.navigate(['/login'], {queryParams: {returnUrl: '/'}});
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });  
    }

	}
  	
  	// convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
   
   doLogin(){
  		this.submitted = true;
  		
  		// stop here if form is invalid
  		if(this.loginForm.invalid){
  			return ;
  		}
  		this.loading = true;

  		this.authenticationService.login(this.f.email.value,this.f.password.value)
      	.pipe(first())
      	.subscribe(
	        data => {
            this.userData = this.globalApp.localStorageItem();
            this.islogin = 1;
            this.router.navigate(['/dashboard']);
	        },
	        error => {
	          this.loading = false;
	        }
	    );
  	}
  	
  	doLogout(){
  		this.authenticationService.logout();
      this.ngOnInit();
  	} 
}
