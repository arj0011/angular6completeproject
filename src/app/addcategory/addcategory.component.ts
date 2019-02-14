import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {
  	categoryForm:FormGroup;
  	loading = false;
  	submitted = false;

  	private status:number;
  	private message:string;
  	private categoryObservable : Observable<any[]>
  	
  	constructor(
  		private categoryService : CategoryService,
  		private formBuilder:FormBuilder,
      private router: Router,
      private toastrService: ToastrService
      	) { }
  	
  	fileToUpload: File  = null;
  
	ngOnInit() {
		this.categoryForm = this.formBuilder.group({
			category:['',Validators.required],
			image	:['',Validators.required]
		});
	}
	
	get f(){ return this.categoryForm.controls;}

  	getFiles(files: FileList){ 
        let fileList = files.item(0);
        this.fileToUpload = fileList; 
    }

	onSubmit(){
		this.submitted = true;
		if(this.categoryForm.invalid){
			return;
		}
		this.loading = true;
		this.categoryService.addCategory(this.f.category.value,this.fileToUpload)
		.pipe(first())
		.subscribe((data:any) => {
			this.status = data.status;
  			this.message = data.msg;
  			this.loading = false;
        this.categoryForm.reset();
  			this.toastrService.success(this.message);
		})		
	}

}
