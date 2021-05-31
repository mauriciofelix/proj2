import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';//Formulário
import { ActivatedRoute, Router } from '@angular/router';//rotas
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Entry } from '../shared/entry.module';
import { EntryService } from '../shared/entry.service';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from "toastr"; //importa tudo em apenas um objeto

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;//"new" ou "edit"
  entryForm: FormGroup; //formulário de categorias
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry(); //para editar
  categories: Array<Category>;
  imaskConfig = {
    mask: Number,
    scale: 2, 
    thousandsSeparator: '.',
    padFractionalZeros: true, 
    normalizeZeros: true, 
    radix: ','
  }
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }
  constructor( //injeção de dependencias
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.setCurrentAction();//qual ação
    this.buildEntryForm();//construir formulário
    this.loadEntry();//carregar a categoria se estiver editando uma 
    this.loadCategories();
  }

  ngAfterContentChecked(){ //após todo o carregamento dos dados 
    this.setPageTitle();
  }

  submitForm(){ //botão de enviar
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createEntry();
    else //currentAction == edit
      this.updateEntry();
  }

  get typeOption(): Array<any>{ 
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  //private methods

  private setCurrentAction(){
    console.log('setCurrentAction');
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"; // se criando o primeiro será new ou o numero
    else
      this.currentAction = "edit"; 
  }

  private buildEntryForm(){
    console.log('buildEntryForm');
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null], //objeto nulo
      type: ["expense", [Validators.required]], 
      amount: [null, [Validators.required]], 
      date: [null, [Validators.required]], 
      paid: [true, [Validators.required]], 
      categoryId: [null, [Validators.required]]
    })
  }

  private loadEntry(){
    console.log('loadEntry');
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id"))) // o + para converter em número
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry) //binds loaded entry data to EntryForm
        },
        (error) => alert('ocorreu um erro no servidor, tente mais tarde!')
      )
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  private setPageTitle(){
    if(this.currentAction == "new")
    this.pageTitle = "Cadastro de Novo Lançamento"
    else{
      const entryName = this.entry.name || "";//na primeira vez que for executado a categoria será null
      this.pageTitle = "Editando Lançamento: " + entryName;//para não exibir null na tela
    }    
  }

  private createEntry(){

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);//criando um objeto de categoria nova e atribuindo os valores do entryForm
    
    this.entryService.create(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionForError(error)
    )
  }

  private updateEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);//criando um objeto de categoria nova e atribuindo os valores do entryForm
    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionForError(error)
    )
  }

  private actionsForSuccess(entry: Entry){
    toastr.success("Solicitação processada com sucesso!");
    //forçar um recarregamento do formulário para entries e depois para o edit
    this.router.navigateByUrl("entries", {skipLocationChange: true})//skipLocationChange não armazenar no histórico do navegador
    .then( //uma promisse
      () => this.router.navigate(["entries", entry.id, "edit"])//redirect/reload component page
    )
  }

  private actionForError(error){ //recebe o error como parametro da requisição
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;//esse é um exemplo do rails retorna um array de string dos erros
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor, tente novamente mais tarde!"];  
  }

}
