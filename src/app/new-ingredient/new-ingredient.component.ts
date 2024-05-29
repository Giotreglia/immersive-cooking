import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';


@Component({
  selector: 'app-new-ingredient',
  templateUrl: './new-ingredient.component.html',
  styleUrl: './new-ingredient.component.scss'
})
export class NewIngredientComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private backend: BackendService) {}

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
  ingredientCategory: any;
  ingredientKcal: any;
  ingredientProteins: any;
  ingredientSugars: any;
  ingredientFats: any;
  ingredientCarbohydrates: any;
  categories: any = [];

  user: any;

  ingredient: FormData = new FormData();

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.getCategories();
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

  getCategories() {
    this.backend.getCategories().subscribe((resp) => {
      console.log(resp);
      this.categories = resp;
    })
  }

  submitForm() {
    if (this.file) {
      console.log(this.file);
      let basepath = 'ingredient/';
      let thumbFilename =  'cover_image-' + this.file.name.split(" ").join("");
      console.log(thumbFilename);
      this.backend.getpresigneduploadurl(basepath + thumbFilename, this.file.type).subscribe(
        response => {
          console.log(response)
          let requestUrl = response.body;
          this.backend.s3Upload(requestUrl, this.file, this.file.type).subscribe(
            response => {
              console.log(response);
              if(response.status==200 || response.status== 201) {
                this.ingredient.append('cover_image_name', thumbFilename);
                this.ingredient.append('name', this.ingredientName);
                this.ingredient.append('id_category', this.ingredientCategory);
                this.ingredient.append('weight', this.ingredientWeight);
                this.ingredient.append('kcal', this.ingredientKcal);
                this.ingredient.append('CF', this.ingredientCF);
                this.ingredient.append('WF', this.ingredientWF);
                this.ingredient.append('EF', this.ingredientEF);
                this.ingredient.append('protein', this.ingredientProteins);
                this.ingredient.append('carbohydrates', this.ingredientCarbohydrates);
                this.ingredient.append('fats', this.ingredientFats);
                this.ingredient.append('sugar', this.ingredientSugars);
                console.log(this.ingredient);
                this.backend.addIngredient(this.ingredient).subscribe((resp) => {
                  console.log(resp);
                  this.router.navigate(['/dashboard/ingredienti']);
                })
              }
            })
        }
      )
    }

    if (!this.file) {
      // Aggiungi i valori al FormData
      this.ingredient.append('name', this.ingredientName);
      this.ingredient.append('id_category', this.ingredientCategory);
      this.ingredient.append('weight', this.ingredientWeight);
      this.ingredient.append('kcal', this.ingredientKcal);
      this.ingredient.append('CF', this.ingredientCF);
      this.ingredient.append('WF', this.ingredientWF);
      this.ingredient.append('EF', this.ingredientEF);
      console.log(this.ingredient);
      this.backend.addIngredient(this.ingredient).subscribe((resp) => {
        console.log(resp);
        this.router.navigate(['/dashboard/ingredienti']);
      })
    }
  }

  imageSrc: any;
  file: any;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.file = file;
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
}
