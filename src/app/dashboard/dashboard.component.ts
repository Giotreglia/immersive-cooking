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

  recipes: any[] = [
    new Recipe (1, 'Carbonara', '../assets/carbonara.png', 'Primi', 1, false,
          [
            new Food(1, 'Spaghetti', 356, 80, '../../assets/spaghetti.png', 'Pasta', 1, 10.8, 82, 2.7, 0.3, false, 0.01425, 14.07414, 0.011001),
            new Food(1, 'Guanciale', 117, 20, '../../assets/baconfette.png', 'Carne', 1, 21.5, 0, 0, 3.4, false, 0.06497, 60.92000, 0.02347),
            new Food(1, "Uova di gallina", 128, 100, "uovodigallina.png", "Uova", 1, 12.04, 0, 8.07, 0, false, 0.02700, 14.95000, 0.01613),
            new Food(1, "Pecorino", 404, 100, "pecorinoromano.png", "Latte e derivati", 1, 28.8, 0.02, 32, 0.02, false, 0.08944, 38.67000, 0.02037),
            new Food(1, "Pepe nero", 296, 100, "pepenerograni2.png", "Spezie", 1, 10, 68, 2, 0, false, 0.00000, 0.00000, 0.03578)
          ] 
    ),
    new Recipe (2, 'Cacio e pepe', '../assets/cacioepepe.png', 'Primi', 1, false,
          [
            new Food(1, 'Spaghetti', 356, 80, '../../assets/spaghetti.png', 'Pasta', 1, 10.8, 82, 2.7, 0.3, false, 0.01425, 14.07414, 0.011001),
            new Food(1, "Pecorino", 404, 100, "pecorinoromano.png", "Latte e derivati", 1, 28.8, 0.02, 32, 0.02, false, 0.08944, 38.67000, 0.02037),
            new Food(1, "Pepe nero", 296, 100, "pepenerograni2.png", "Spezie", 1, 10, 68, 2, 0, false, 0.00000, 0.00000, 0.03578)
          ] 
    ),
    new Recipe (3, 'Amatriciana', '../assets/amatriciana.png', 'Primi', 1, false,
          [
            new Food(1, 'Spaghetti', 356, 80, '../../assets/spaghetti.png', 'Pasta', 1, 10.8, 82, 2.7, 0.3, false, 0.01425, 14.07414, 0.011001),
            new Food(1, "Pecorino", 404, 100, "pecorinoromano.png", "Latte e derivati", 1, 28.8, 0.02, 32, 0.02, false, 0.08944, 38.67000, 0.02037),
            new Food(1, "Pepe nero", 296, 100, "pepenerograni2.png", "Spezie", 1, 10, 68, 2, 0, false, 0.00000, 0.00000, 0.03578)
          ] 
),

  ];
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


}
