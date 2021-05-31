import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Routes = [
  {path: '', component: CategoryListComponent},//Listar
  {path: 'new', component: CategoryFormComponent},//Novo
  {path: ':id/edit', component: CategoryFormComponent}//Editar
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
