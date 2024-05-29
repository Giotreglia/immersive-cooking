import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';


class Food {
  constructor(
    public id: number,
    public name: string,
    public kcal: number,
    public defaultWeight: number,
    public image: any,
    public category: string,
    public list: number,
    public proteins: number,
    public carbohydrates: number,
    public fats: number,
    public sugars: number,
    public popover: boolean,
    public CF: number,
    public WF: number,
    public EF: number,
  ) {}
}

class Recipe {
  constructor(
    public id: number,
    public name: string,
    public image: any,
    public category: string,
    public list: number,
    public showModal: boolean,
    public ingredients: Food[]
  ) {}
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private el: ElementRef, private location: Location, private backend: BackendService) {}

  recipes: any[] = [];
  filteredRecipes: any;
  currentPage: number = 0;
  lastPage: number = 0;
  pages: any = Array(this.lastPage);
  organizations: any[] = [];
  totalPages: number = 0;
  pagesToShow: number[] = [];
  curators: any[] = [];
  authorId: any = 0;
  searchText: any = '';

  user: any;
  session_expire: any;

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.getRecipes();
    this.filterRecipes();
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

  getRecipes() {
    this.backend.getRecipes().subscribe(
      response => {
      console.log(response);
      this.recipes = response;
      this.filteredRecipes = this.recipes;
      },
      error => {
        console.error('Errore durante la chiamata:', error);
      })
  }

  deleteRecipe(recipeId: any) {
    this.backend.deleteRecipe(recipeId).subscribe((resp) => {
      console.log(resp);
      this.getRecipes();
    })
  }

  filterRecipes() {
    this.filteredRecipes = this.recipes.filter(recipe => {
      const matchesTitle = recipe.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesAuthor = this.authorId === 0 || recipe.authorId === this.authorId;
      return matchesTitle;
    });
  }

  // Metodo per chiamare il filtro ogni volta che i campi cambiano
  onSearchTextChange() {
    console.log('ciao')
    this.filterRecipes();
  }

  onAuthorChange() {
    this.filterRecipes();
  }

}
