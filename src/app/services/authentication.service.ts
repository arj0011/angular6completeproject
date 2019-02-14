import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const APIURL = 'http://localhost/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  	constructor(private http:HttpClient,private router: Router,) { }
  
  	login(email:string,password:string){
  		let input = new FormData();
      input.append('email', email);
      input.append('password', password);
      return this.http.post<any>(APIURL+'users/login',input)
  			.pipe(map(user => {
                // login successful if there's a jwt token in the response
                // if (user && user.token) {
                if (user && user.status) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
  	}
  	
    // logout user called from home component 
  	logout(){
  		localStorage.removeItem('currentUser');
  	}

    // if user is logged in redirect to home component
    // islogin(){
    //   if(localStorage.getItem('currentUser')){
    //     this.router.navigate(['/']);
    //   }
    // }

    // check user is authorized or not
    // isauth(){
    //   if(!localStorage.getItem('currentUser')){
    //     this.router.navigate(['/']);
    //   }
    // }
}
