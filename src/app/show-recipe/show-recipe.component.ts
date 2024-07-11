import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrl: './show-recipe.component.scss'
})
export class ShowRecipeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private el: ElementRef, private location: Location, private backend: BackendService, private route: ActivatedRoute) {}

  user: any;
  recipes: any;
  selectedRecipe: any;
  selectedRecipeId: any;
  sub: any;
  formData: FormData = new FormData();
  totalCF: any;
  totalWF: any;
  totalEF: any;

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
      this.setColor(this.selectedRecipe.footprint_score)
      this.getTotalCF();
      this.getTotalWF();
      this.getTotalEF();
    })
  }

  getSelectedRecipe(id: any) {
    console.log(id)
    this.selectedRecipe = this.recipes.find((recipe: { id: any; }) => recipe.id == id);
    console.log(this.selectedRecipe)
    console.log(this.selectedRecipe.footprint_score)
    this.setColor(this.selectedRecipe.footprint_score);
    this.getRecipeIngredients(this.selectedRecipeId);
  }

  getTotalCF() {
    let total: any = 0;
    for (let i = 0; i < this.selectedRecipe.recipeIngredients.length; i++) {
      const element = this.selectedRecipe.recipeIngredients[i];
      total += element.weight * this.selectedRecipe.ingredients[i].CF;
    }
    console.log(total);
    this.totalCF = total;
  }
  getTotalWF() {
    let total: any = 0;
    for (let i = 0; i < this.selectedRecipe.recipeIngredients.length; i++) {
      const element = this.selectedRecipe.recipeIngredients[i];
      total += element.weight * this.selectedRecipe.ingredients[i].WF;
    }
    console.log(total);
    this.totalWF = total;
  }

  getTotalEF() {
    let total: any = 0;
    for (let i = 0; i < this.selectedRecipe.recipeIngredients.length; i++) {
      const element = this.selectedRecipe.recipeIngredients[i];
      total += element.weight * this.selectedRecipe.ingredients[i].EF;
    }
    console.log(total);
    this.totalEF = total;
  }

  setColor(footprint: any) {
    console.log(footprint)
    if (footprint >= 0 && footprint < 1) {
        this.selectedRecipe.color = '#004d00'; 
    } else if (footprint >= 1 && footprint < 2) {
        this.selectedRecipe.color = '#006400'; 
    } else if (footprint >= 2 && footprint < 3) {
        this.selectedRecipe.color = '#008000'; 
    } else if (footprint >= 3 && footprint < 4) {
        this.selectedRecipe.color = '#ADFF2F'; 
    } else if (footprint >= 4 && footprint < 5) {
        this.selectedRecipe.color = '#eded15'; 
    } else if (footprint >= 5 && footprint < 6) {
        this.selectedRecipe.color = '#FFD700';
    } else if (footprint >= 6 && footprint < 7) {
        this.selectedRecipe.color = '#FFA500';
    } else if (footprint >= 7 && footprint < 8) {
        this.selectedRecipe.color = '#FF5733';
    } else if (footprint >= 8 && footprint < 9) {
        this.selectedRecipe.color = '#FF0000';
    } else if (footprint >= 9 && footprint <= 10) {
        this.selectedRecipe.color = '#8B0000';
    }
      console.log(this.selectedRecipe)
  }

  getRecipeIngredients(recipeId: any) {
    this.backend.getRecipeIngredients(recipeId).subscribe((resp) => {
      console.log(resp);
      this.selectedRecipe.ingredients = resp;
      this.getTotalCF();
    })
  }

  getTotalKcal() {
    let totalKcal: number = 0;
    this.selectedRecipe.recipeIngredients.forEach((element: any, index: any) => {
        totalKcal += (this.selectedRecipe.ingredients[index].kcal / 100) * element.weight;
      })
      console.log(totalKcal)
    return totalKcal;
  }

  getTotalValue(value: any) {
    let total: number = 0;
    this.selectedRecipe.recipeIngredients.forEach((food: any, index: any) => {
          if (value == "proteins") {
            console.log(value + ' ' + this.selectedRecipe.ingredients[index].protein)
            total += (this.selectedRecipe.ingredients[index].protein / 100) * food.weight;
          } else if (value == "carbohydrates") {
            console.log(value + ' ' + this.selectedRecipe.ingredients[index].carbohydrates)
            total += (this.selectedRecipe.ingredients[index].carbohydrates / 100) * food.weight;
          } else if (value == "fats") {
            console.log(value + ' ' + this.selectedRecipe.ingredients[index].fats)
            total += (this.selectedRecipe.ingredients[index].fats / 100) * food.weight;
          } else if (value == "sugars") {
            console.log(value + ' ' + this.selectedRecipe.ingredients[index].sugar)
            total += (this.selectedRecipe.ingredients[index].sugar / 100) * food.weight;
          }
    })
    console.log(value + ' ' + total)
    return total;
  }

  proteins: number = 0;
  carbohydrates: number = 0;
  fats: number = 0;
  sugars: number = 0;

  setResultsFoodValues() {
    this.proteins = 0;
    this.carbohydrates = 0;
    this.fats = 0;
    this.sugars = 0;

    this.selectedRecipe.recipeIngredients.forEach((food: any, index: any) => {
          this.proteins += Math.round((this.selectedRecipe.ingredients[index].protein / 100) * food.weight);        
          this.carbohydrates += Math.round((this.selectedRecipe.ingredients[index].carbohydrates / 100) * food.weight); 
          this.fats += Math.round((this.selectedRecipe.ingredients[index].fats / 100) * food.weight);       
          this.sugars += Math.round((this.selectedRecipe.ingredients[index].sugar / 100) * food.weight);
    })
    console.log(this.proteins);
    console.log(this.carbohydrates);
    console.log(this.fats);
    console.log(this.sugars);
    this.chartOptions.data[0].dataPoints[0].y = this.proteins;
    this.chartOptions.data[0].dataPoints[1].y = this.carbohydrates;
    this.chartOptions.data[0].dataPoints[2].y = this.fats;
    this.chartOptions.data[0].dataPoints[3].y = this.sugars;
  }

  chartOptions = {
	  animationEnabled: true,
	  theme: "light2",
	  exportEnabled: false,
	  title: {
		text: ""
	  },
	  subtitles: [{
		text: ""
	  }],
	  data: [
      {
        type: "doughnut", //change type to column, line, area, doughnut, etc
        indexLabel: "{name} {y} gr.",
        dataPoints: [
          { name: "Proteine", y: this.proteins },
          { name: "Carboidrati", y: this.carbohydrates },
          { name: "Zuccheri", y: this.sugars },
          { name: "Grassi", y: this.fats },
        ]
      }
    ]
  }
}
