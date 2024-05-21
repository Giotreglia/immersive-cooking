import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrl: './edit-ingredient.component.scss'
})
export class EditIngredientComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private backend: BackendService, private route: ActivatedRoute) {}

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
  ingredientName: any = '';
  ingredientWeight: any = 100;
  ingredientCF: any;
  ingredientWF: any;
  ingredientEF: any;
  foods: any;
  selectedIngredient: any;
  selectedIngredientId: any;
  sub: any;
  categories: any[] = [];

  user: any;

  ingredient: FormData = new FormData();

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    console.log(this.user)
    this.sub = this.route.params.subscribe(params => {
      this.selectedIngredientId = +params['ingredientId'];
    })
    this.getIngredients(this.selectedIngredientId);
    this.getCategories();
  }

  getCategories() {
    this.backend.getCategories().subscribe((resp) => {
      console.log(resp);
      this.categories = resp;
    })
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

  getIngredients(ingredientId: any) {
    this.backend.getIngredients().subscribe((resp) => {
      console.log(resp);
      this.foods = resp;
      this.selectedIngredient = this.foods.find((food: any) => food.id == ingredientId);
      console.log(this.selectedIngredient)
    })
  }

  imageSrc: any;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Puoi gestire il file selezionato qui
    console.log('File selezionato:', file);
    if (file) {
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

  submitForm() {
    // Aggiungi i valori al FormData
    this.ingredient.append('name', this.selectedIngredient.name);
    this.ingredient.append('weight', this.selectedIngredient.weight);
    this.ingredient.append('CF', this.selectedIngredient.CF);
    this.ingredient.append('WF', this.selectedIngredient.WF);
    this.ingredient.append('EF', this.selectedIngredient.EF);
    console.log(this.ingredient);
    this.backend.saveIngredient(this.ingredient, this.selectedIngredientId).subscribe((resp) => {
      console.log(resp);
      this.router.navigate(['/dashboard/ingredienti']);
    })
  }
}
