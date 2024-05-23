import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';


@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.scss'
})
export class NewRecipeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private backend: BackendService, private ngxCsvParser: NgxCsvParser) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  currentPage: number = 0;
  lastPage: number = 0;
  pages: any = Array(this.lastPage);
  organizations: any[] = [];
  totalPages: number = 0;
  pagesToShow: number[] = [];
  curators: any[] = [];
  authorId: any = 0;
  searchText: any = '';
  fileName: any;
  createdRecipeId: any;
  csvRecords: any;
  header: boolean = false;
  categories: any = [];
  recipes: any;
  execution: any = {
    recipe_id: 0,
    portion_number: null,
    portion_unit: null,
    note: null
  };

  user: any;

  recipe: any = {
    name: null,
    description: null,
    image: null,
    portion_number: null,
    portion_unit: null,
    footprint_score: null
  };

  recipeData: FormData = new FormData();

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    console.log(this.user)
  }

  nextPage() {
    this.currentPage ++;
  }
  prevPage() {
    this.currentPage --;
  }

  goToPage(page:any) {
    this.currentPage = page;
  }

  routeTo(route: any) {
    this.router.navigate([route]);
  }

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 3;

 nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
    console.log(this.selectedIndex);
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
    console.log(this.selectedIndex);
  }

  imageSrc: any;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    // Puoi gestire il file selezionato qui
    console.log('File selezionato:', file);
    if (file) {
      let basepath = 'recipe/';
      let thumbFilename =  'cover_image-' + file.name.split(" ").join("");
      console.log(thumbFilename);
      this.backend.getpresigneduploadurl(basepath, thumbFilename, file.type).subscribe(
        response => {
          console.log(response)
          let requestUrl = response.body;
          this.recipeData.append('cover', thumbFilename);
          this.backend.s3Upload(requestUrl, file, file.type).subscribe(
            response => {
              console.log(response.url);
            })
        }
      )
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }}

      this.fileName = file.name;

      const formData = new FormData();

      formData.append("file", file);
    
  }

  getTotalFootprint() {
    let total: any = 0;
    console.log(this.ingredients)
    for (let i = 0; i < this.ingredients.length; i++) {
      const element = this.ingredients[i];
      total += element.CF * element.weight;
      total += (element.WF * element.weight) / 1000;
      total += element.EF * element.weight;
    }
    console.log(total);
    this.recipe.footprint_score = 10 - (total / 8);
  }

  saveRecipe(next: any) {
    // Aggiungi i valori al FormData


    this.recipeData.append('id_user', this.user.id);
    this.recipeData.append('id_organization', this.user.id_organization);
    this.recipeData.append('name', this.recipe.name);
    this.recipeData.append('portion_number', this.recipe.portion_number);
    this.recipeData.append('portion_unit', this.recipe.portion_unit);
    this.recipeData.append('description', this.recipe.description);
    this.recipeData.append('footprint_score', this.recipe.footprint_score);
    console.log(this.recipeData);
    this.backend.saveRecipe(this.recipeData).subscribe(
      response => {
        let recipe;
        recipe = response.body;
        console.log(response.body);
        this.createdRecipeId = recipe.id;
        this.addIngredientsToRecipe(this.createdRecipeId);
        if (next == 'next') {
          this.nextStep();          
        } 
        if (next == 'out') {
          this.router.navigate(['/dashboard/home']);
        }
        /* this.router.navigate(['/dashboard/home']); */
      },
      error => {
        console.error('Errore durante la chiamata:', error);
        // Gestisci l'errore se necessario
      }
    )
  }

  ingredients: any;
  onIngredientAdded(eventData: any) {
    console.log(eventData)
    this.ingredients = eventData;
    this.getTotalFootprint();
  }

  addIngredientsToRecipe(recipeId: any) {
    if (this.ingredients) {
      this.ingredients.forEach((element: { id: any; weight: any; }) => {
        this.addRecipeIngredient(recipeId, element.id, element.weight);
      });
      
    } else {
      alert('aggiungi almeno un ingrediente')
    }
  }

  addRecipeIngredient(recipeId: any, ingredientId: any, weight: any) {
    let formData = new FormData();
    formData.append('recipeId', recipeId);
    formData.append('ingredientId', ingredientId);
    formData.append('weight', weight);

    this.backend.addRecipeIngredient(formData).subscribe((resp) => {
      console.log(resp);
      this.nextStep();
    })
  }

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header =
        (this.header as unknown as string) === 'true' ||
        this.header === true;

    this.ngxCsvParser
        .parse(files[0], {
            header: this.header,
            delimiter: ',',
            encoding: 'utf8'
        })
        .pipe()
        .subscribe(
            (result: any) => {
                console.log('Result', result);
                this.csvRecords = result;
            },
            (error: NgxCSVParserError) => {
                console.log('Error', error);
            }
        );
  }

  submitForm() {
    let executionForm = new FormData();
    this.execution.recipe_id = this.recipe.id;
    console.log()
    executionForm.append('recipeId', this.createdRecipeId);
    executionForm.append('portion_number', this.execution.portion_number);
    executionForm.append('portion_unit', this.execution.portion_unit);
    executionForm.append('note', this.execution.note);
    executionForm.append('csv_name', this.csvRecords);

    this.backend.addExecution(executionForm).subscribe((resp) => {
      console.log(resp);
      localStorage.setItem('results'+resp.id, this.csvRecords);
      this.router.navigate(['/dashboard/home']);
    })
  }

}
