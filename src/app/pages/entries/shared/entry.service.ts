import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from './entry.module';
@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries'; //src\app\in-memory-database.ts

  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  getAll(): Observable<Entry[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)//recebe o retorno da api
    )
  }

  getById(id: number): Observable<Entry>{
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)//recebe o retorno da api
    )
  }

  create(entry: Entry): Observable<Entry>{

    //observable recebe o retorno do interior
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {  //aula 36 05:00 +-
        entry.category = category;
        //retorna um observable contendo um entry
        return this.http.post(this.apiPath, entry).pipe( //passar retorno por um pipe
          catchError(this.handleError),
          map(this.jsonDataToEntry)//recebe o retorno da api
        )
      })
    )

    
  }

  update(entry: Entry): Observable<Entry>{
    const url = `${this.apiPath}/${entry.id}`;

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {  //aula 36 05:00 +-
        entry.category = category;

        return this.http.put(url, entry).pipe( //no put não tem nenhum dado de retorno
          catchError(this.handleError),
          map(() => entry)//força o retorno do objeto da própria categoria (apenas nos testes no real será retornado a atualização)
        )
      })
    )    
  }

  delete(id: number): Observable<any>{
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //private methods
  private jsonDataToEntries(jsonData: any[]): Entry[]{
    //console.log(jsonData[0] as Entry);//apenas um cast aula 25 - 00:20
    //console.log(Object.assign(new Entry(), jsonData[0]));//criou o objeto mesmo
    const entries: Entry[] = [];
    //jsonData.forEach(element => entries.push(element as Entry));//não transforma no tipo Entry, apenas ficou "parecido"
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element); //criou o objeto mesmo
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry{
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any>{
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }

}
