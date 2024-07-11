import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { BackendService } from '../services/backend.service';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker';

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
    note: null,
    kWh: null
  };

  constructor(private ngxCsvParser: NgxCsvParser, private http: HttpClient, private router: Router, private backend: BackendService) {
        // Configura il workerSrc di pdfjsLib
        /* @vite-ignore */
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

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
    executionForm.append('kwh', this.execution.kWh);
    this.backend.addExecution(executionForm).subscribe((resp) => {
      console.log(resp);
      localStorage.setItem('results'+resp.id, this.csvRecords);
      this.router.navigate(['/dashboard/esecuzioni']);
    })
  }

  fileUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileUrl = e.target.result;
        this.extractText(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  extractText(pdfData: ArrayBuffer) {
    const typedarray = new Uint8Array(pdfData);

    pdfjsLib.getDocument(typedarray).promise.then((pdf: any) => {
      pdf.getPage(1).then((page: any) => {
        page.getTextContent().then((textContent: any) => {
          const textItems = textContent.items;
          let finalString = '';
          console.log(textItems)
          for (let i = 0; i < textItems.length; i++) {
            finalString += textItems[i].str + ' ';
          }
          console.log(finalString)
          const energyRegex = /([0-9.]+)\s*kWh/;
          const match = finalString.match(energyRegex);
          if (match) {
            const energyValue = match[1];
            console.log(`Energia trovata: ${energyValue} kWh`);
            this.execution.kWh = parseFloat(energyValue);
            console.log(this.execution)
          } else {
            console.log('Energia non trovata');
            alert('Il file caricato non è corretto o non contiene dati sull\'energia, prova con un altro file.')
          }
        });
      });
    });
  }


  
  

}
