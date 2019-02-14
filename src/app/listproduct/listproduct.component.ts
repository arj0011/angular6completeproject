import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';

const API_URL = environment.apiUrl;

class Products{
  id:number;
  product:string;
  price:number;
  discount:number;
  descr:string;
  category:string;
  image:string;
  created_at:string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.css']
})
export class ListproductComponent implements OnInit {

  	private status:number;
  	private message:string;
    // private products: any;
    private  products: Products[];
    dtOptions: DataTables.Settings = {};
    // dtTrigger: Subject<any> = new Subject();
    categories: Array<{text:string,value:number}>;
  	private productDetail: any;

  	productForm:FormGroup;
    loading = false;
    submitted = false;
  	constructor(
  	  private productService : ProductService,
  	  private categoryService : CategoryService,
      private formBuilder:FormBuilder,
      private router: Router,
      private http: HttpClient,
      private toastrService:ToastrService) { }
  	
    fileToUpload: File  = null;
  	
    ngOnInit(): void{

      const that = this;

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          that.http
            .post<DataTablesResponse>(
              API_URL + 'products',
              dataTablesParameters
            ).subscribe(resp => {
              console.log(resp);
              that.products = resp.data;

              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'product' }, { data: 'price'}, { data: 'discount'}, { data: 'descr'}, { data: 'category'}, {data: 'image'}, { data: 'created_at'}, {data: 'action'}]
      };
  	}
  	
  	get f(){ return this.productForm.controls;}
  	
    getFiles(files: FileList){ 
        let fileList = files.item(0);
        this.fileToUpload = fileList; 
    }

  	getProduct(id:string){
      	
      	this.categoryService.getAllCategoryName()
		.pipe(first())
		.subscribe((data:any)=>{
			this.categories = data.data;
		});
      	
      	this.productService.getProductById(id)
      	.pipe(first())
      	.subscribe( (data:any) => {
	        this.productForm = this.formBuilder.group({
		        id:[''],
		        product:['',Validators.required],
				    descr:['',Validators.required],
				    category:[null,Validators.required],
				    price:['',Validators.required],
				    discount:[''],
				    image	:['']
	        });
	        this.productDetail = data.data;
	        this.productForm.patchValue({id:this.productDetail.id,product:this.productDetail.product,category:this.productDetail.category_id,descr:this.productDetail.descr,price:this.productDetail.price,discount:this.productDetail.discount});
	        // this.productForm.controls['category'].setValue(this.productDetail.category_id, {onlySelf: true});
      });
    }

    doUpdate(){
      this.submitted = true;
      if(this.productForm.invalid){
        return;
      }
      this.loading = true;

      this.productService.editProduct(this.f.id.value,this.f.product.value,this.f.category.value,this.f.descr.value,this.f.price.value,this.f.discount.value,this.fileToUpload)
      .pipe(first())
      .subscribe( (data:any) => {
        this.status = data.status;
        this.loading = false;
        this.message = data.msg;
        if(this.status){
            this.toastrService.success(this.message);
            this.productDetail=false;
            this.ngOnInit();  
        }else{
          this.toastrService.error(this.message);
        }
      });
    }

    deleteProduct(id:string){
      this.productService.removeProduct(id)
      .pipe(first())
      .subscribe( (data:any) => {
        if(data.status){
          this.toastrService.success(data.msg);
          this.ngOnInit();   
        }else{
          this.toastrService.error(data.msg);
        }
        
      });
    }

    cancelUpdate(){
      this.productDetail = false;
      this.ngOnInit();
    }

    getProducts(){
      this.productService.getAllProduct()
      .pipe(first())
      .subscribe( (data:any) => {
        this.products = data.data;
      });
    }

}
