import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  	categories: Array<{text:string,value:number}>;
  	productForm:FormGroup;
  	loading = false;
  	submitted = false;

  	private status:number;
  	private message:string;
  	
  	constructor(
  		private categoryService : CategoryService,
  		private productService : ProductService,
  		private formBuilder:FormBuilder,
	    private router: Router,
	    private toastrService: ToastrService
      	) { }
  	
  	fileToUpload: File  = null;
  
	ngOnInit() {
		this.categoryService.getAllCategoryName()
		.pipe(first())
		.subscribe((data:any)=>{
			this.categories = data.data;
		});

		this.productForm = this.formBuilder.group({
			product:['',Validators.required],
			descr:['',Validators.required],
			category:[null,Validators.required],
			price:['',Validators.required],
			discount:[''],
			image	:['',Validators.required]
		});
	}
	
	get f(){ return this.productForm.controls;}

  	getFiles(files: FileList){ 
        let fileList = files.item(0);
        this.fileToUpload = fileList; 
    }

	onSubmit(){
		this.submitted = true;
		if(this.productForm.invalid){
			return;
		}
		this.loading = true;

		this.productService.addProduct(
			this.f.product.value,
			this.f.descr.value,
			this.f.category.value,
			this.f.price.value,
			this.f.discount.value,
			this.fileToUpload
			)
		.pipe(first())
		.subscribe((data:any) => {
			this.status = data.status;
  			this.message = data.msg;
  			this.loading = false;
  			this.submitted = false;
        	this.productForm.reset();
  			this.toastrService.success(this.message);
  			this.ngOnInit();
		})		
	}


}
