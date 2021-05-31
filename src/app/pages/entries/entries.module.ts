import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; //importações repetidas em módulos diferentes
import { EntriesRoutingModule } from './entries-routing.module';

import { CalendarModule} from 'primeng/calendar';
import { IMaskModule } from "angular-imask";

import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
@NgModule({
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EntriesRoutingModule,    
    CalendarModule,
    IMaskModule
  ]
})
export class EntriesModule { }
