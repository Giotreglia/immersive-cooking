import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-executions',
  templateUrl: './executions.component.html',
  styleUrl: './executions.component.scss'
})
export class ExecutionsComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private el: ElementRef, private location: Location, private backend: BackendService) {}

  PATH: any = '../../assets/icone_ingredienti/';

  currentPage: number = 0;
  lastPage: number = 0;
  pages: any = Array(this.lastPage);
  organizations: any[] = [];
  totalPages: number = 0;
  pagesToShow: number[] = [];
  curators: any[] = [];
  recipeId: any = 0;
  searchText: any = '';
  ingredients: any[] = [];
  categories: any = [];
  user: any;
  executions: any;
  filteredExecutions: any;
  recipes: any;
  executionNames: any[] = [];

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    console.log(this.user)
    this.getRecipes();
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

  setPopover() {
    this.executions.forEach((food: { popover: boolean; }) => {
      food.popover = false;
    });
  }

  setShowModal() {
    this.executions.forEach((execution: { showModal: boolean; recipe_id: any; recipe: any; }) => {
      execution.showModal = false;
      let recipe;
      recipe = this.recipes.find((recipe: any) => recipe.id == execution.recipe_id);
      execution.recipe = recipe;
      console.log(this.executions)
    });
  }

  getExecutions() {
    this.backend.getExecutions().subscribe((resp) => {
      console.log(resp);
      this.executions = resp;
      this.filteredExecutions = this.executions;
      this.executions.forEach((element: { recipe_id: any; }) => {
        if (!this.executionNames.includes(element.recipe_id)) {
          this.executionNames.push(element.recipe_id);
        }
      });
      console.log(this.executionNames)
      this.setShowModal();
    })
  }

  getRecipeName(recipeId: any) {
    let recipe = this.recipes.find((recipe: { id: any; }) => recipe.id == recipeId);
    return recipe.name
  }

  getRecipes() {
    this.backend.getRecipes().subscribe(
      response => {
      console.log(response);
      this.recipes = response;
      this.getExecutions();
      },
      error => {
        console.error('Errore durante la chiamata:', error);
      })
  }

  getCategories() {
    this.backend.getCategories().subscribe((resp) => {
      console.log(resp);
      this.categories = resp;
    })
  }

  deleteExecution(executionId: any) {
    this.backend.deleteExecution(executionId).subscribe((resp) => {
      console.log(resp);
      this.getExecutions();
      /* window.location.reload(); */
    })
  }

  findCategory(categoryId: any) {
    let category = this.categories.find((category: any) => category.id == categoryId);
    return category.name
  }

  filterExecutions() {
    console.log(this.recipeId)
    this.filteredExecutions = this.executions.filter((execution: { recipe: { name: string; }; recipe_id: any }) => {
      const matchesName = execution.recipe.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesRecipe = this.recipeId == 0 || execution.recipe_id == this.recipeId;

      return matchesName && matchesRecipe;
    })
    /* if (this.recipeId == 0) {
      this.filteredExecutions = this.executions;
    } else {
      this.filteredExecutions = this.executions.filter((execution: { recipe_id: any; }) => execution.recipe_id == this.recipeId);
    } */
  }

  /* filterIngredients() {
    console.log(this.ingredients)
    console.log(this.categoryId)
    this.filteredIngredients = this.ingredients.filter(ingredient => {
      const matchesName = ingredient.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.categoryId == 0 || ingredient.id_category == this.categoryId;
      console.log(matchesCategory)
      return matchesName && matchesCategory;
    });
  } */
}
