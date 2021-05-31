import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';//Formulário
import { ActivatedRoute, Router } from '@angular/router';//rotas

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from "toastr"; //importa tudo em apenas um objeto
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;//"new" ou "edit"
  categoryForm: FormGroup; //formulário de categorias
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category(); //para editar

  constructor( //injeção de dependencias
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.setCurrentAction();//qual ação
    this.buildCategoryForm();//construir formulário
    this.loadCategory();//carregar a categoria se estiver editando uma categoria
  }

  ngAfterContentChecked(){ //após todo o carregamento dos dados 
    this.setPageTitle();
  }

  submitForm(){ //botão de enviar
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createCategory();
    else //currentAction == edit
      this.updateCategory();
  }

  //private methods

  private setCurrentAction(){
    console.log('setCurrentAction');
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"; // se criando o primeiro será new ou o numero
    else
      this.currentAction = "edit"; 
  }

  private buildCategoryForm(){
    console.log('buildCategoryForm');
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null] //objeto nulo
    })
  }

  private loadCategory(){
    console.log('loadCategory');
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id"))) // o + para converter em número
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(this.category) //binds loaded category data to CategoryForm
        },
        (error) => alert('ocorreu um erro no servidor, tente mais tarde!')
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria"
    else{
      const categoryName = this.category.name || "";//na primeira vez que for executado a categoria será null
      this.pageTitle = "Editando Categoria: " + categoryName;//para não exibir null na tela
    }    
  }

  private createCategory(){

    const category: Category = Object.assign(new Category(), this.categoryForm.value);//criando um objeto de categoria nova e atribuindo os valores do categoryForm
    
    this.categoryService.create(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);//criando um objeto de categoria nova e atribuindo os valores do categoryForm
    this.categoryService.update(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private actionsForSuccess(category: Category){
    toastr.success("Solicitação processada com sucesso!");
    //forçar um recarregamento do formulário para categories e depois para o edit
    this.router.navigateByUrl("categories", {skipLocationChange: true})//skipLocationChange não armazenar no histórico do navegador
    .then( //uma promisse
      () => this.router.navigate(["categories", category.id, "edit"])//redirect/reload component page
    )
  }

  private  actionForError(error){ //recebe o error como parametro da requisição
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;//esse é um exemplo do rails retorna um array de string dos erros
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor, tente novamente mais tarde!"];  
  }

}
