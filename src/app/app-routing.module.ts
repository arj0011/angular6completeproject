import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './guards';
import { AppComponent }   from '../app/app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { ListcategoryComponent }   from './listcategory/listcategory.component';
import { AddcategoryComponent }   from './addcategory/addcategory.component';
import { ListproductComponent }   from './listproduct/listproduct.component';
import { AddproductComponent }   from './addproduct/addproduct.component';

const routes: Routes = [
  // { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category-list', component: ListcategoryComponent },
  { path: 'category-add', component: AddcategoryComponent },
  { path: 'product-list', component: ListproductComponent },
  { path: 'product-add', component: AddproductComponent },
  
  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
