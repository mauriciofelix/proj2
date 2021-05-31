import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//interceptador não é para buscar externo
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';//apenas requisições internas
import { InMemoryDatabase } from './in-memory-database';//apenas requisições internas
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)//apenas requisições internas
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
