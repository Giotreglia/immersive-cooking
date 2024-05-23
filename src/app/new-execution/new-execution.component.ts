import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-new-execution',
  templateUrl: './new-execution.component.html',
  styleUrl: './new-execution.component.scss'
})
export class NewExecutionComponent implements OnInit {
  csvRecords: any;
  header: boolean = false;
  user: any;
  categories: any = [];
  recipes: any;
  execution: any = {
    recipe_id: 0,
    portion_number: null,
    portion_unit: null,
    note: null
  };

  constructor(private ngxCsvParser: NgxCsvParser, private http: HttpClient, private router: Router, private backend: BackendService) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  ngOnInit(): void {
    let userStorage: any = localStorage.getItem('user');
    this.user = JSON.parse(userStorage);
    this.getRecipes();
    console.log(this.user)
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

  routeTo(route: any) {
    this.router.navigate([route]);
  }

  getCategories() {
    this.backend.getCategories().subscribe((resp) => {
      console.log(resp);
      this.categories = resp;
    })
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
  

  submitForm() {
    let executionForm = new FormData();
    executionForm.append('recipeId', this.execution.recipe_id);
    executionForm.append('portion_number', this.execution.portion_number);
    executionForm.append('portion_unit', this.execution.portion_unit);
    executionForm.append('note', this.execution.note);
    executionForm.append('csv_name', this.csvRecords);
    this.backend.addExecution(executionForm).subscribe((resp) => {
      console.log(resp);
      localStorage.setItem('results'+resp.id, this.csvRecords);
      this.router.navigate(['/dashboard/esecuzioni']);
    })
  }

  
  

}
