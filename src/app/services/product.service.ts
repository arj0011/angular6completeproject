import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
	responseData: any;
	
	constructor(private http:HttpClient) { 
	}

  	getAllProduct(){
  		return this.http.get(API_URL + 'products');
  	}

  	addProduct(product:string,descr:string,category:string,price:string,discount:string,fileItem:File) {
	    let input = new FormData();
	    input.append('product', product);
	    input.append('descr', descr);
	    input.append('category', category);
	    input.append('price', price);
	    input.append('discount', discount);
		input.append('image', fileItem, fileItem.name);
		return this.http.post( API_URL + 'products/addProduct', input);
  	}

  	getProductById(id:string) {
	    let input = new FormData();
		input.append('id', id);
		return this.http.post( API_URL + 'products/getProductById', input);
  	}

  	editProduct(id:string,product:string,category:string,descr:string,price:string,discount:string,fileItem?: File){
  		let input = new FormData();
		input.append('id', id);
		input.append('product', product);
		input.append('category', category);
		input.append('descr', descr);
		input.append('price', price);
		input.append('discount', discount);
		if(fileItem){
			input.append('image', fileItem, fileItem.name);	
		}
		
		return this.http.post( API_URL + 'products/editProduct', input);
  	}

  	removeProduct(id:string) {
	    let input = new FormData();
		input.append('id', id);
		return this.http.post( API_URL + 'products/changeStatus', input);
  	}

}
