import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recipe-documents',
  templateUrl: './recipe-documents.component.html',
  styleUrl: './recipe-documents.component.scss'
})
export class RecipeDocumentsComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private el: ElementRef, private location: Location, private backend: BackendService, private route: ActivatedRoute) {}
  
  user: any;
  recipes: any;
  selectedRecipe: any;
  selectedRecipeId: any;
  sub: any;
  formData: FormData = new FormData();
  documents: any = [
    {
      type: 'pdf',
      name: 'Ricetta in inglese',
      icon: 'fa-regular fa-file-pdf',
      course: 'Inglese'
    },
    {
      type: 'doc',
      name: 'Ricerca sulla carbonara',
      icon: 'fa-solid fa-file-word',
      course: 'Storia'
    },
    {
      type: 'csv',
      name: 'Statistiche cottura carbonara',
      icon: 'fa-solid fa-file-csv',
      course: 'Matematica'
    },
  ]

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.sub = this.route.params.subscribe(params => {
      this.selectedRecipeId = +params['recipeId'];
    })
    this.getRecipe();
  }

  routeTo(route: any) {
    this.router.navigate([route]);
  }

  getRecipes() {
    this.backend.getRecipes().subscribe((resp) => {
      console.log(resp);
      this.recipes = resp;
      this.getSelectedRecipe(this.selectedRecipeId);
    })
  }

  getRecipe() {
    this.formData.append('recipeId', this.selectedRecipeId);
    this.backend.getRecipe(this.formData).subscribe((resp) => {
      console.log(resp)
      this.selectedRecipe = resp;
    })
  }

  getSelectedRecipe(id: any) {
    console.log(id)
    this.selectedRecipe = this.recipes.find((recipe: { id: any; }) => recipe.id == id);
    console.log(this.selectedRecipe)
    console.log(this.selectedRecipe.footprint_score)
    this.getRecipeIngredients(this.selectedRecipeId);
  }

  getRecipeIngredients(recipeId: any) {
    this.backend.getRecipeIngredients(recipeId).subscribe((resp) => {
      console.log(resp);
      this.selectedRecipe.ingredients = resp;
    })
  }

}
