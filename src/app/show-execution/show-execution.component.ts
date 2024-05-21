import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { LOCALE_ID } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/it';
registerLocaleData(localeFr, 'it');

@Component({
  selector: 'app-show-execution',
  templateUrl: './show-execution.component.html',
  styleUrl: './show-execution.component.scss'
})
export class ShowExecutionComponent implements OnInit {

  @ViewChild('fileImportInput') fileImportInput: any;

  constructor(private http: HttpClient, private router: Router, private el: ElementRef, private location: Location, private backend: BackendService, private route: ActivatedRoute, private ngxCsvParser: NgxCsvParser) {}

  user: any;
  recipes: any;
  selectedRecipe: any;
  selectedRecipeId: any;
  sub: any;
  formData: FormData = new FormData();
  executions: any;
  selectedExecution: any;
  selectedExecutionId: any = 0;
  totalCF: any;
  totalWF: any;
  totalEF: any;
  showResults: boolean = false;

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.sub = this.route.params.subscribe(params => {
      this.selectedExecutionId = +params['executionId'];
    })
    this.getExecutions();
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

  getRecipe(recipeId: any) {
    this.formData.append('recipeId', recipeId);
    this.backend.getRecipe(this.formData).subscribe((resp) => {
      console.log(resp)
      this.selectedRecipe = resp;
      this.setColor(this.selectedRecipe.footprint_score);
      this.selectedExecution.recipe = this.selectedRecipe;
      this.getTotalCF();
      this.getTotalEF();
      this.getTotalWF();
      console.log(this.selectedExecution)
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

  setColor(footprint: any) {
    console.log(footprint)
    if (footprint >= 0 && footprint < 1) {
        this.selectedRecipe.color = '#8B0000';
    } else if (footprint >= 1 && footprint < 2) {
        this.selectedRecipe.color = '#FF0000';
    } else if (footprint >= 2 && footprint < 3) {
        this.selectedRecipe.color = '#FF5733';
    } else if (footprint >= 3 && footprint < 4) {
        this.selectedRecipe.color = '#FFA500';
    } else if (footprint >= 4 && footprint < 5) {
        this.selectedRecipe.color = '#FFD700';
    } else if (footprint >= 5 && footprint < 6) {
        this.selectedRecipe.color = '#eded15';
    } else if (footprint >= 6 && footprint < 7) {
        this.selectedRecipe.color = '#ADFF2F';
    } else if (footprint >= 7 && footprint < 8) {
        this.selectedRecipe.color = '#008000';
    } else if (footprint >= 8 && footprint < 9) {
        this.selectedRecipe.color = '#006400';
    } else if (footprint >= 9 && footprint <= 10) {
        this.selectedRecipe.color = '#004d00';
    }
      console.log(this.selectedRecipe)
  }

  getRecipeIngredients(recipeId: any) {
    this.backend.getRecipeIngredients(recipeId).subscribe((resp) => {
      console.log(resp);
      this.selectedRecipe.ingredients = resp;
    })
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
      this.getSelectedExecution(this.selectedExecutionId);
    })
  }

  getSelectedExecution(id: any) {
    console.log(id)
    this.selectedExecution = this.executions.find((execution: { id: any; }) => execution.id == id);
    console.log(this.selectedExecution)
    this.getRecipe(this.selectedExecution.recipe_id);
  }

  csvRecords: any;
  header: boolean = false;

  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
  }

  fileReader(fileUrl: any): void {
    console.log(fileUrl)
    /* this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(fileUrl, { header: this.header, delimiter: ',', encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      }); */

      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('csv content', e.target.result);
      };
      reader.readAsDataURL(fileUrl);
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

  public openPDF(): void {
    this.showResults = true;
    let DATA: any = document.getElementById('results');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 210;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('nome-ricetta.pdf');
    });
  }
}
