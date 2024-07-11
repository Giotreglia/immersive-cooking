import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  documents: any = []
  fileName: any;
  fileData: any = {
    id_ricetta: null,
    title: null,
    type: null,
    course: null,
    url: null
  }
  isLoading: boolean = false;

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.sub = this.route.params.subscribe(params => {
      this.selectedRecipeId = +params['recipeId'];
    })
    this.getRecipe();
    this.getFiles(this.selectedRecipeId);
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

  getFiles(recipeId: any) {
    this.backend.getFiles(recipeId).subscribe((resp) => {
      console.log(resp);
      this.documents = resp;
      this.documents.forEach((element: { type: string; icon: string; }) => {
        if (element.type == 'pdf') {
          element.icon = 'fa-regular fa-file-pdf'
        }
        if (element.type == 'doc') {
          element.icon = 'fa-solid fa-file-word'
        }
        if (element.type == 'csv') {
          element.icon = 'fa-solid fa-file-csv'
        }
      });
    })
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
      console.log(file.type)
      console.log(this.fileName)
      if (this.fileName.endsWith('.pdf')) {
        this.fileData.type = 'pdf'
      } else if (this.fileName.endsWith('.doc') || this.fileName.endsWith('.docx')) {
        this.fileData.type = 'doc'
      } else if (this.fileName.endsWith('.csv')) {
        this.fileData.type = 'csv'
      } else {
        this.fileData.type = 'unknown';
      }
      console.log(this.fileData.type)
    
  }

  submitForm() {
    this.isLoading = true;
    if (this.file) {
      console.log(this.file);
      let now = new Date().getTime();
      console.log(now);
      let basepath = 'file/';
      const sanitizedFileName = this.file.name.replace(/[^a-zA-Z0-9.]/g, '');
      let thumbFilename =  'file-' + now + '-' + sanitizedFileName;
      console.log(thumbFilename);
      this.backend.getpresigneduploadurl(basepath + thumbFilename, this.file.type).subscribe(
        response => {
          console.log(response)
          let requestUrl = response.body;
          this.backend.s3Upload(requestUrl, this.file, this.file.type).subscribe(
            response => {
              console.log(response);
              if(response.status==200 || response.status== 201) {
                this.formData.append('id_ricetta', this.selectedRecipeId);
                this.formData.append('url', thumbFilename);
                this.formData.append('title', this.fileData.title);
                this.formData.append('course', this.fileData.course);
                this.formData.append('type', this.fileData.type);
                this.backend.addFile(this.formData).subscribe((resp) => {
                  console.log(resp);
                  this.isLoading = false;
                  this.getFiles(this.selectedRecipeId);
                  const myModalEl: any = document.getElementById('addModal');
                  console.log(myModalEl)
                })
              }
            })
        }
      )
    }
  }

  deleteFile(fileId: any) {
    let formData: FormData = new FormData();
    formData.append('id', fileId);
    this.backend.deleteFile(fileId).subscribe((resp) => {
      console.log(resp);
      this.getFiles(this.selectedRecipeId);
    })
  }

}
