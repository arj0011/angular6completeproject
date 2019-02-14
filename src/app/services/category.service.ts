import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { Category } from '../models/category.model';

const API_URL = environment.apiUrl;
// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
// };

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
	responseData: any;
	
	constructor(private http:HttpClient) { 
	}

  	getAllCategory(){
  		return this.http.get(API_URL + 'category');
  	}

  	getAllCategoryName(){
  		return this.http.get(API_URL + 'category/getAllCategoryName');	
  	}

  	addCategory(category:string,fileItem:File) {
	    let input = new FormData();
		input.append('category', category);
		input.append('image', fileItem, fileItem.name);
		return this.http.post( API_URL + 'category/addCategory', input);
  	}

  	getCategoryById(id:string) {
	    let input = new FormData();
		input.append('id', id);
		return this.http.post( API_URL + 'category/getCategoryById', input);
  	}

  	editCategory(id:string,category:string,fileItem?: File){
  		let input = new FormData();
		input.append('id', id);
		input.append('category', category);
		console.log(fileItem);
		if(fileItem){
			input.append('image', fileItem, fileItem.name);	
		}
		
		return this.http.post( API_URL + 'category/editCategory', input);
  	}

  	removeCategory(id:string) {
	    let input = new FormData();
		input.append('id', id);
		return this.http.post( API_URL + 'category/changeStatus', input);
  	}

}
