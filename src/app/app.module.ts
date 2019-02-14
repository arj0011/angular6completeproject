import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards';
import { GlobalApp } from './helpers/global';
import { AuthenticationService } from './services/authentication.service'
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { AppComponent } from './app.component';
import { ListcategoryComponent } from './listcategory/listcategory.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListproductComponent } from './listproduct/listproduct.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { AddproductComponent } from './addproduct/addproduct.component';

@NgModule({
  declarations: [
    AppComponent,
    ListcategoryComponent,
    DashboardComponent,
    ListproductComponent,
    AddcategoryComponent,
    AddproductComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() 
  ],
  providers: [
    AuthGuard,
    GlobalApp,
    AuthenticationService,
    CategoryService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
