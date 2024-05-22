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
import { PDFDocument, rgb } from 'pdf-lib';
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
  totalKw: any = 0
  executionDetail: any = []

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

  onTotalKwEventEmitted(eventData: any) {
    this.totalKw = eventData
  }

  onExecutionDetailEventEmitted(eventData: any) {
    this.executionDetail = eventData
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

  async openPDF() {
    this.showResults = true;
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]);
    let pageHeight = page.getHeight()
    let font = await pdfDoc.embedFont('Helvetica-Bold');
    const noCoverImageUrl = "../../assets/no-cover.png"

    const portionUnit = this.selectedRecipe.portion_unit == "person" ? this.selectedRecipe.portion_number > 1 ? "Persone" : "Persona" : this.selectedRecipe.portion_unit == "gram" ? this.selectedRecipe.portion_number > 1 ? "grammi" : "grammo" : this.selectedRecipe.portion_number > 1 ? "teglie" : "teglia"

    pageHeight = pageHeight - 50
    pageHeight = this.drawWrappedText(this.selectedRecipe.name.toLowerCase(), 50, pageHeight, 460.28, 24, 24 * 1.2, page, font, pdfDoc);

    pageHeight = pageHeight - 55

    page.drawText("Data cottura", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    pageHeight = pageHeight - 20

    page.drawText(this.selectedExecution.creation_date, {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
    });

    pageHeight = pageHeight + 10

    page.drawText(`x ${this.selectedRecipe.portion_number} ${portionUnit}`, {
      x: 595.28 - 120,
      y: pageHeight,
      size: 18,
      color: rgb(0, 0, 0),
    });

    pageHeight = pageHeight - 10

    let imageToFetch = this.selectedRecipe.cover ? this.selectedRecipe.cover : noCoverImageUrl
    const imageBytes = await fetch(imageToFetch).then(res => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);
    const imageWidth = 230;
    const imageHeight = (image.height / image.width) * imageWidth;

    pageHeight = pageHeight - 220

    page.drawImage(image, {
      x: 175,
      y: pageHeight,
      width: imageWidth,
      height: imageHeight,
    });

    pageHeight = pageHeight - 15

    page.drawText("Descrizione ricetta", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    pageHeight = pageHeight - 25

    this.selectedRecipe.description = this.convertToSingleLine(this.selectedRecipe.description)

    let lines = this.splitTextToLines(this.selectedRecipe.description, 545.28, font, 12);
    font = await pdfDoc.embedFont('Helvetica')
    lines.forEach(line => {
      page.drawText(line, {
        x: 50,
        y: pageHeight,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      pageHeight -= 12 + 2;
      if(pageHeight < 50)
      {
        page = pdfDoc.addPage([595.28, 841.89]);
        pageHeight = page.getHeight() - 50
      }
    });

    pageHeight = pageHeight - 25

    if(pageHeight < 50)
    {
      page = pdfDoc.addPage([595.28, 841.89]);
      pageHeight = page.getHeight() - 50
      pageHeight = pageHeight - 50
    }

    page.drawText("Note", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    pageHeight = pageHeight - 25

    this.selectedExecution.note = this.convertToSingleLine(this.selectedExecution.note)

    lines = this.splitTextToLines(this.selectedExecution.note, 545.28, font, 12);
    font = await pdfDoc.embedFont('Helvetica')
    lines.forEach(line => {
      page.drawText(line, {
        x: 50,
        y: pageHeight,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      pageHeight -= 12 + 2;
      if(pageHeight < 50)
      {
        page = pdfDoc.addPage([595.28, 841.89]);
        pageHeight = page.getHeight() - 50
      }
    });

    page = pdfDoc.addPage([595.28, 841.89]);
    pageHeight = page.getHeight()
    pageHeight = pageHeight - 50

    page.drawText("Ingredienti", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    for(let ingredient of this.selectedRecipe.recipeIngredients)
    {
      const ingredientData = this.selectedRecipe.ingredients.filter((data: any) => data.id == ingredient.id_ingrediente)[0]
      pageHeight = this.selectedRecipe.recipeIngredients.indexOf(ingredient) == 0 ? pageHeight - 35 : pageHeight - 30
      imageToFetch = ingredientData.cover_image_name ? ingredientData.cover_image_name : noCoverImageUrl
      const imageBytes = await fetch(imageToFetch).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedPng(imageBytes);
      const imageWidth = ingredientData.cover_image_name ? 20 : 40;
      const imageHeight = (image.height / image.width) * imageWidth;
      page.drawImage(image, {
        x: ingredientData.cover_image_name ? 50 : 40,
        y: ingredientData.cover_image_name ? pageHeight : pageHeight - 10,
        width: imageWidth,
        height: imageHeight,
      });

      page.drawText(`${ingredientData.name} ${ingredient.weight} g.`, {
        x: ingredientData.cover_image_name ? 80 : 82,
        y: ingredientData.cover_image_name ? pageHeight + 6 : pageHeight + 7.5,
        size: 12,
        color: rgb(0, 0, 0),
      });

      if(pageHeight < 55.5)
      {
        page = pdfDoc.addPage([595.28, 841.89]);
        pageHeight = page.getHeight()
        pageHeight = pageHeight - 50
      }
    }

    page = pdfDoc.addPage([595.28, 841.89]);
    pageHeight = page.getHeight()
    pageHeight = pageHeight - 50

    page.drawText("Dati consumo di suolo", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    pageHeight = pageHeight - 40

    page.drawRectangle({
      x: 50,
      y: pageHeight,
      width: 160,
      height: 20,
      color: rgb(241 / 255, 242 / 255, 243 / 255),
    });
    page.drawText(`Consumo di acqua`, {
      x: 60,
      y: pageHeight + 5.5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 215,
      y: pageHeight,
      width: 160,
      height: 20,
      color: rgb(241 / 255, 242 / 255, 243 / 255),
    });
    page.drawText(`Consumo di suolo`, {
      x: 225,
      y: pageHeight + 5.5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 380,
      y: pageHeight,
      width: 160,
      height: 20,
      color: rgb(241 / 255, 242 / 255, 243 / 255),
    });
    page.drawText(`Emissioni di CO2`, {
      x: 390,
      y: pageHeight + 5.5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    pageHeight = pageHeight - 50
    page.drawRectangle({
      x: 50,
      y: pageHeight,
      width: 160,
      height: 50,
      color: rgb(248 / 255, 249 / 255, 250 / 255),
    });
    page.drawText(`${parseFloat((this.totalWF / 1000).toFixed(3))} litri`, {
      x: 80,
      y: pageHeight + 18,
      size: 25,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 215,
      y: pageHeight,
      width: 160,
      height: 50,
      color: rgb(248 / 255, 249 / 255, 250 / 255),
    });
    page.drawText(`${parseFloat((this.totalEF).toFixed(3))} mq`, {
      x: 242.5,
      y: pageHeight + 18,
      size: 25,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 380,
      y: pageHeight,
      width: 160,
      height: 50,
      color: rgb(248 / 255, 249 / 255, 250 / 255),
    });
    page.drawText(`${parseFloat((this.totalCF).toFixed(3))} Kg`, {
      x: 415,
      y: pageHeight + 18,
      size: 25,
      color: rgb(0, 0, 0),
    });

    pageHeight = pageHeight -50

    page.drawText("Dati consumo energia cottura", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    pageHeight = pageHeight - 25

    const text = `Per produrre un kWh elettrico vengono bruciati mediamente l'equivalente di 2,56 kWh sotto forma di combustibili fossili e di conseguenza emessi nell'aria circa 0,65 kg di anidride carbonica`
    pageHeight = this.drawWrappedText(text, 50, pageHeight, 460.28, 12, 12 * 1.2, page, font,pdfDoc);

    pageHeight = pageHeight - 50

    page.drawRectangle({
      x: 50,
      y: pageHeight,
      width: 160,
      height: 20,
      color: rgb(241 / 255, 242 / 255, 243 / 255),
    });
    page.drawText(`Consumo totale in Kw`, {
      x: 60,
      y: pageHeight + 5.5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 215,
      y: pageHeight,
      width: 160,
      height: 20,
      color: rgb(241 / 255, 242 / 255, 243 / 255),
    });
    page.drawText(`CO2 x Kw (media italiana)`, {
      x: 225,
      y: pageHeight + 5.5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 380,
      y: pageHeight,
      width: 160,
      height: 20,
      color: rgb(241 / 255, 242 / 255, 243 / 255),
    });
    page.drawText(`Emissioni CO2 cottura`, {
      x: 390,
      y: pageHeight + 5.5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    pageHeight = pageHeight - 50

    page.drawRectangle({
      x: 50,
      y: pageHeight,
      width: 160,
      height: 50,
      color: rgb(248 / 255, 249 / 255, 250 / 255),
    });
    page.drawText(`${parseFloat((this.totalKw).toFixed(3))} Kw`, {
      x: 90,
      y: pageHeight + 18,
      size: 25,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 215,
      y: pageHeight,
      width: 160,
      height: 50,
      color: rgb(248 / 255, 249 / 255, 250 / 255),
    });
    page.drawText(`0.65 kg/kw`, {
      x: 234,
      y: pageHeight + 18,
      size: 25,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x: 380,
      y: pageHeight,
      width: 160,
      height: 50,
      color: rgb(248 / 255, 249 / 255, 250 / 255),
    });
    page.drawText(`${parseFloat((this.totalKw * 0.65).toFixed(3))} Kg co2`, {
      x: 392.7,
      y: pageHeight + 18,
      size: 25,
      color: rgb(0, 0, 0),
    });

    pageHeight = pageHeight - 50

    page = pdfDoc.addPage([841.89, 595.28]);
    pageHeight = page.getHeight()
    pageHeight = pageHeight - 50
    let xPosition = 50;

    page.drawText("Tabella cottura", {
      x: 50,
      y: pageHeight,
      size: 12,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });

    pageHeight = pageHeight - 40

    this.executionDetail.forEach((row: any) => {
      const strucuredData = row.split(";")
      strucuredData.forEach((data: any) => {
        const text = data.split(" ")
        text.forEach((word: any)=>{
          page.drawText(word, {
            x: xPosition,
            y: pageHeight + (10 * (text.length / 2)),
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });
          if(text.length > 1)
          {
            pageHeight -= 10
          }
        })
        if(text.length > 1)
        {
          pageHeight += (10 * (text.length))
        }
        xPosition += 100;
      });
      xPosition = 50
      pageHeight -= 40;

      if(pageHeight < 20)
      {
        page = pdfDoc.addPage([841.89, 595.28]);
        pageHeight = page.getHeight()
        pageHeight = pageHeight - 50

        this.executionDetail[0].split(";").forEach((header: any) => {
          console.log({header})
          const headerWords = header.split(" ")

          headerWords.forEach((word: any)=>{
            page.drawText(word, {
              x: xPosition,
              y: pageHeight + (10 * (headerWords.length / 2)),
              size: 12,
              font: font,
              color: rgb(0, 0, 0),
            });
            if(text.length > 1)
            {
              pageHeight -= 10
            }
          })
          if(text.length > 1)
          {
            pageHeight += (10 * (headerWords.length))
          }
          xPosition += 100;
        })
      }
    });

    // Salva il documento PDF
    const pdfBytes = await pdfDoc.save();

    // Scarica il PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${this.selectedRecipe.name.toLowerCase()}-${this.selectedExecution.creation_date}.pdf`;
    link.click();
  }

  drawWrappedText(text: any, x: any, y: any, maxWidth: any, fontSize: any, lineHeight: any, page: any, font: any, pdfDoc: any) {
    const words = text.split(' ');
    let currentLine = '';
    let currentWidth = 0;
    let currentHeight = y;

    for (const word of words)
    {
      const wordWidth = font.widthOfTextAtSize(word, fontSize);
      if (currentWidth + wordWidth < maxWidth)
      {
        currentLine += (currentLine ? ' ' : '') + word;
        currentWidth += wordWidth;
      }
      else
      {
        page.drawText(currentLine, { x, y: currentHeight, size: fontSize });
        currentHeight -= lineHeight;
        currentLine = word;
        currentWidth = wordWidth;
      }
    }
    page.drawText(currentLine, { x, y: currentHeight, size: fontSize });

    /*
    if(currentHeight < 50)
    {
      page = pdfDoc.addPage([595.28, 841.89]);
      currentHeight = page.getHeight()
      currentHeight = currentHeight - 50
    } */

    return currentHeight;
  }

  convertToSingleLine(text: string) {
    return text.replace(/\r?\n/g, '\\n');
  }

  splitTextToLines(text: any, maxWidth: any, font: any, fontSize: any) {
    const lines: any[] = [];
    const paragraphs = text.split('\\n');
    paragraphs.forEach((paragraph: any) => {
      let line = '';
      const words = paragraph.split(' ');
      words.forEach((word: any) => {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      lines.push(line.trim());
    });
    return lines;
  }
}
