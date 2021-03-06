import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';

const routes: Routes = [  
  {path: '', component: EntryListComponent},//Listar
  {path: 'new', component: EntryFormComponent},//Novo
  {path: ':id/edit', component: EntryFormComponent}///Editar
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntriesRoutingModule { }
