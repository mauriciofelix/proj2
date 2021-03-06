import { Component, OnInit } from '@angular/core';

import { Entry } from '../shared/entry.module';
import { EntryService } from '../shared/entry.service';
import { InMemoryDatabase } from '../../../in-memory-database';
import { element } from 'protractor';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { //passar service como dependencia no construtor

  }

  ngOnInit() { //trazer as categorias
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      error => alert("Erro ao carregar a lista")
    )
  }

  deleteEntry(entry){
    const mustDelete = confirm('Deseja realmente excluir esse item?');
    if(mustDelete){
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element != entry),
        () => alert("Erro ao tentar excluir!")
      )
    }    
  }
}
