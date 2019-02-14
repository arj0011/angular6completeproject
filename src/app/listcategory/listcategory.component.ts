import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../services/category.service';

const API_URL = environment.apiUrl;

class Categories{
  id:number;
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
  selector: 'app-listcategory',
  templateUrl: './listcategory.component.html',
  styleUrls: ['./listcategory.component.css']
})
export class ListcategoryComponent implements OnInit {
  	private status:number;
  	private message:string;
    // private categories: any;
    private  categories: Categories[];
    dtOptions: DataTables.Settings = {};
  	private categoryDetail: any;
  	private categoryObservable : Observable<any[]>
  	categoryForm:FormGroup;
    loading = false;
    submitted = false;
  	constructor(private categoryService : CategoryService,
      private formBuilder:FormBuilder,
      private router: Router,
      private http: HttpClient,
      private toastrService:ToastrService) { }
  	
    fileToUpload: File  = null;
  	
    ngOnInit() {
  		const that = this;

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          that.http
            .post<DataTablesResponse>(
              API_URL + 'category',
              dataTablesParameters
            ).subscribe(resp => {
              console.log(resp);
              that.categories = resp.data;

              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'category' }, {data: 'image'}, { data: 'created_at'}, {data: 'action'}]
      };
      
  	}
  	
    get f(){ return this.categoryForm.controls;}

    getCategory(id:string){
      this.categoryService.getCategoryById(id)
      .pipe(first())
      .subscribe( (data:any) => {
        this.categoryForm = this.formBuilder.group({
          id:[''],
          category:['',Validators.required],
          image  :['']
        });
        this.categoryDetail = data.data;
        this.categoryForm.patchValue({id:this.categoryDetail.id,category:this.categoryDetail.category});
      });
    }

    doUpdate(){
      this.submitted = true;
      if(this.categoryForm.invalid){
        return;
      }
      this.loading = true;

      this.categoryService.editCategory(this.f.id.value,this.f.category.value,this.fileToUpload)
      .pipe(first())
      .subscribe( (data:any) => {
        this.status = data.status;
        this.loading = false;
        this.message = data.msg;
        if(this.status){
            this.toastrService.success(this.message);
            this.categoryDetail=false;
            this.ngOnInit();  
        }else{
          this.toastrService.error(this.message);
        }
      });
    }

    deleteCategory(id:string){
      this.categoryService.removeCategory(id)
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

    getFiles(files: FileList){ 
        let fileList = files.item(0);
        this.fileToUpload = fileList; 
    }

    cancelUpdate(){
      this.categoryDetail = false;
      this.ngOnInit();
    }

    getCategories(){
      this.categoryService.getAllCategory()
      .pipe(first())
      .subscribe( (data:any) => {
        this.categories = data.data;
      });
    }

}
