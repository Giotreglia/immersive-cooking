import { Component, numberAttribute, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Location } from '@angular/common';
import { Output, EventEmitter, Input } from '@angular/core';

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
    public ingredients: Food[]
  ) {}
}

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss'
})


export class IngredientsComponent implements OnInit {
  
  @Output() ingredients = new EventEmitter<any>();
  @Input() ingredientsList: any;
  @Input() selectedRecipeId: any;

  constructor(private http: HttpClient, private router: Router, private el: ElementRef, private location: Location, private backend: BackendService) {}

  foods: any[] = [
    new Food(1, "Avena in fiocchi", 367, 100, "avenainfiocchi.png", "Cereali", 1, 8, 66.8, 0.07, 6.05, false, 0.00443, 17.74264, 0.01023),
    new Food(1, "Farro", 353, 100, "farroseme.png", "Cereali", 1, 14.06, 69.3, 2.04, 2.04, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Quinoa cruda", 376, 100, "quinoaseme.png", "Cereali", 1, 15.04, 57.8, 8.01, 5.03, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Mais e simili", 357, 100, "miglioseme.png", "Cereali", 1, 9.02, 75.1, 3.08, 2.05, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Miglio comune e simili", 343, 100, "maisseme.png", "Cereali", 1, 11.08, 64.9, 3.09, 0, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Riso parboiled", 333, 100, "risoseme.png", "Cereali", 1, 6.07, 79.3, 1, 0, false, 0.02990, 14.76614, 0.00887),
    new Food(1, "Grano e simili", 329, 100, "granoseme.png", "Cereali", 1, 12.04, 61.2, 3.03, 0, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Amido di mais", 328, 100, "amidodimais.png", "Cereali", 1, 0.03, 87, 0, 1.05, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Farina di riso", 332, 100, "farinadiriso.png", "Cereali", 1, 7.03, 79.1, 0.05, 0, false, 0.02990, 14.76614, 0.00887),
    new Food(1, "Amido di riso", 332, 100, "amidodiriso.png", "Cereali", 1, 7.03, 79.1, 0.05, 0, false, 0.02990, 14.76614, 0.00887),
    new Food(1, "Farina di segale", 342, 100, "farinadisegale.png", "Cereali", 1, 11.07, 67.8, 2, 0.01, false, 0.00410, 20.59906, 0.00983),
    new Food(1, "Farina tipo 00", 323, 100, "farinaOO.png", "Cereali", 1, 11, 71.6, 0.07, 1.07, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Semola di grano duro", 342, 100, "farinasemoladigranoduro.png", "Cereali", 1, 11.07, 67.8, 0.05, 0.01, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Crusca di grano", 290, 100, "cruscadigrano.png", "Cereali", 1, 14.01, 26.6, 5.05, 3.08, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Pane comune", 356, 100, "pane14comune.png", "Pane e lievitati", 1, 10.08, 82.8, 0.03, 2.07, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pane integrale", 243, 100, "pane8integrale.png", "Pane e lievitati", 1, 7.05, 53.8, 1.03, 2.05, false, 0.00349, 12.23839, 0.00983),
    new Food(1, "Pane di segale", 220.2, 100, "pane12segale.png", "Pane e lievitati", 1, 8.03, 45.8, 1.07, 1.08, false, 0.00410, 20.59906, 0.00983),
    new Food(1, "Crackers salati", 386, 100, "crackerssalati.png", "Pane e lievitati", 1, 9.04, 67.5, 10, 0, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Crackers alla soia", 421, 100, "crackersdisoia.png", "Pane e lievitati", 1, 13.03, 66.7, 11.07, 6.03, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pane croccante di segale", 228, 100, "panecroccantedisegale.png", "Pane e lievitati", 1, 8.03, 45.5, 1.07, 1.08, false, 0.00410, 20.59906, 0.00983),
    new Food(1, "Pane croccante di grano", 357, 100, "pane1croccantegrano.png", "Pane e lievitati", 1, 10.01, 77.8, 2.01, 5, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Fette biscottate", 387, 100, "fettebiscottate.png", "Pane e lievitati", 1, 11.03, 75, 6, 2.02, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Fette biscottate integrali", 387, 100, "panefettebiscottateintegrali2.png", "Pane e lievitati", 1, 11.03, 75, 6, 2.02, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Fette biscottate integrali di frumento", 369, 100, "panefettebiscottateintegrali2.png", "Pane e lievitati", 1, 11.02, 74.1, 5.02, 10, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pane per pizza", 270, 100, "paneperpizza.png", "Pane e lievitati", 1, 7, 54, 2, 3, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pane azzimo", 365, 100, "paneazzimo.png", "Pane e lievitati", 1, 10.07, 81.8, 1, 1.09, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pane grattugiato", 356, 100, "panegrattuggiato.png", "Pane e lievitati", 1, 10.08, 82.8, 0.03, 2.07, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Crostini", 239, 100, "crostini.png", "Pane e lievitati", 1, 8.03, 52, 0.03, 2.02, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pasta fresca all'uovo", 346, 100, "fettuccine.png", "Pasta", 1, 13, 71, 2.04, 2, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Pasta di semola", 356, 100, "capellini.png", "Pasta", 1, 10.08, 82.8, 0.03, 2.07, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Biscotti integrali", 419, 100, "biscottobrownies.png", "Prodotti da forno", 1, 7.08, 70.8, 7.08, 28.8, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Biscotti secchi", 404, 100, "biscottisecchi.png", "Prodotti da forno", 1, 6.06, 80.4, 7.09, 18.05, false, 0.01595, 25.38559, 0.00983),
    new Food(1, "Biscotti tipo wafer", 425, 100, "waffle.png", "Prodotti da forno", 1, 7.01, 76.2, 15, 26.7, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Beignets", 318, 100, "paneolio.png", "Prodotti da forno", 1, 4.06, 43, 15.04, 30, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Torte semplici", 370, 100, "torta9.png", "Dolci", 1, 8.09, 63.4, 10.04, 34, false, 0.03550, 171.96000, 0.01596),
    new Food(1, "Torte al cioccolato", 315, 100, "tortaspeziata.png", "Dolci", 1, 4.09, 36.8, 17.05, 27.6, false, 0.03550, 171.96000, 0.01596),
    new Food(1, "Croissant", 403, 100, "panecroissant1.png", "Pane e lievitati", 1, 7.02, 54.7, 18.03, 10.06, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Ciambelle tipo doughnuts-berliner", 403, 100, "paneCiambella3vaniglia.png", "Pane e lievitati", 1, 7.02, 54.7, 18.03, 10.06, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Prodotti tipo brioche", 403, 100, "panebrioche1.png", "Pane e lievitati", 1, 7.02, 54.7, 18.03, 10.06, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Pasta brisée per torte e crostate", 290, 100, "pastabrise.png", "Pane e lievitati", 1, 6.03, 20, 20, 2.03, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Cioccolato al latte", 552, 100, "cioccolatotavolettacacao.png", "Dolciumi", 1, 7.03, 50.5, 36.3, 50.5, false, 0.03550, 171.96000, 0.01596),
    new Food(1, "Muesli", 374, 100, "avenainfiocchi.png", "Cereali", 1, 9.07, 71.7, 6, 26.2, false, 0.00430, 8.49582, 0.01204),
    new Food(1, "Cereali per la colazione misti", 367, 100, "ceralidacolazionemisto.png", "Cereali", 1, 6.06, 87.4, 0.08, 10.04, false, 0.00430, 8.49582, 0.01204),
    new Food(1, "Farina di mais", 341, 100, "porridge2tazza.png", "Cereali", 1, 8.07, 73.5, 2.07, 1.05, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Broccolo", 33, 100, "broccolo1.png", "Verdura", 1, 3, 3.01, 0.04, 3.01, false, 0.00700, 2.10940, 0.00150),
    new Food(1, "Cavolfiore", 30, 100, "cavolfiore1.png", "Verdura", 1, 3.02, 2.07, 0.02, 2.04, false, 0.00345, 2.10940, 0.00150),
    new Food(1, "Cavoletti ci Bruxelles", 47, 100, "cavolettidibruxelles.png", "Verdura", 1, 4.02, 4.02, 0.05, 3.03, false, 0.00345, 2.10940, 0.00150),
    new Food(1, "Cavolo cappuccio rosso", 22, 100, "cavolorosso.png", "Verdura", 1, 1.09, 2.07, 0.02, 2.07, false, 0.00345, 2.10940, 0.00150),
    new Food(1, "Cavoli cinesi e simili", 37, 100, "cavolocinesetipo.png", "Verdura", 1, 4.02, 4.03, 0.05, 3.03, false, 0.00345, 2.10940, 0.00150),
    new Food(1, "Aglio", 53, 100, "aglio4.png", "Verdura", 1, 8.04, 1, 0.08, 1, false, 0.00152, 2.73994, 0.00126),
    new Food(1, "Cipolline", 26, 100, "cipolladorata2.png", "Verdura", 1, 1, 5.07, 0.01, 5.07, false, 0.00152, 2.73994, 0.00126),
    new Food(1, "Cipolla", 26, 100, "cipolladorata1.png", "Verdura", 1, 1, 5.07, 0.01, 5.07, false, 0.00152, 2.73994, 0.00126),
    new Food(1, "Scalogno", 72, 100, "scalogno.png", "Verdura", 1, 2.05, 17, 0.01, 8, false, 0.00152, 2.73994, 0.00126),
    new Food(1, "Pomodori da insalata", 19, 100, "pomodoro2.png", "Verdura", 1, 1.02, 2.08, 0.02, 2.08, false, 0.00852, 1.08518, 0.00081),
    new Food(1, "Peperoni", 25, 100, "peperonerosso2.png", "Verdura", 1, 0.09, 5, 0.03, 4.09, false, 0.01175, 1.93648, 0.02984),
    new Food(1, "Peperoncino", 25, 100, "peperoncinorosso.png", "Condimenti", 1, 0.09, 5, 0.03, 4.09, false, 0.01175, 1.93648, 0.02984),
    new Food(1, "Melanzane", 15, 100, "melanzana2.png", "Verdura", 1, 1.01, 2.06, 0.01, 2.06, false, 0.01350, 1.74654, 0.00105),
    new Food(1, "Cetrioli", 16, 100, "cetriolo.png", "Verdura", 1, 0.07, 1.08, 0.05, 1.08, false, 0.00746, 2.79312, 0.00200),
    new Food(1, "Melone d'inverno", 24, 100, "melonedinverno2fetta.png", "Frutta", 1, 0.05, 4.09, 0.02, 4.09, false, 0.01382, 1.76027, 0.00111),
    new Food(1, "Melone d'estate", 34, 100, "melone.png", "Frutta", 1, 0.08, 7.04, 0.02, 7.04, false, 0.01382, 1.76027, 0.00111),
    new Food(1, "Zucca gialla", 29, 100, "zuccagialla1.png", "Verdura", 1, 1.01, 3.05, 0.01, 2.05, false, 0.00385, 2.79312, 0.00214),
    new Food(1, "Zucca bianca", 29, 100, "zuccabianca.png", "Verdura", 1, 1.01, 3.05, 0.01, 2.05, false, 0.00385, 2.79312, 0.00214),
    new Food(1, "Zucca verde", 29, 100, "zuccaapera.png", "Verdura", 1, 1.01, 3.05, 0.01, 2.05, false, 0.00385, 2.79312, 0.00214),
    new Food(1, "Zucchina", 29, 100, "zucchina2.png", "Verdura", 1, 1.01, 3.05, 0.01, 2.05, false, 0.00746, 2.79312, 0.00200),
    new Food(1, "Mais", 357, 100, "maispannocchia2.png", "Verdura", 1, 9.02, 75.1, 3.08, 2.05, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Lattuga", 22, 100, "lattuga.png", "Verdura", 1, 1.05, 3, 0, 3, false, 0.00917, 2.16054, 0.00132),
    new Food(1, "Rucola", 30, 100, "rucola.png", "Verdura", 1, 2.06, 3.09, 0.03, 3.09, false, 0.00917, 1.20476, 0.00132),
    new Food(1, "Spinaci", 35, 100, "spinacifreschi.png", "Verdura", 1, 3.04, 2.09, 0.07, 0.04, false, 0.00180, 1.82937, 0.00111),
    new Food(1, "Indivia", 20, 100, "indiviafoglia.png", "Verdura", 1, 0.09, 2.07, 0.03, 2.07, false, 0.00917, 1.20476, 0.00132),
    new Food(1, "Radicchio rosso", 19, 100, "radicchiorosso.png", "Verdura", 1, 1.04, 1.06, 0.01, 1.06, false, 0.00917, 1.20476, 0.00132),
    new Food(1, "Fagioli", 326, 100, "fagioli.png", "Legumi", 1, 23.06, 47.5, 2, 3.05, false, 0.00572, 3.64431, 0.00197),
    new Food(1, "Fagiolini", 143, 100, "fagiolini.png", "Legumi", 1, 10.02, 22.07, 0.08, 1.02, false, 0.00572, 3.64431, 0.00197),
    new Food(1, "Fave fresche", 51, 100, "favefresche.png", "Legumi", 1, 5.02, 4.05, 0.02, 2.02, false, 0.00419, 5.96187, 0.00384),
    new Food(1, "Piselli freschi", 64, 100, "pisellifreschi2.png", "Legumi", 1, 5.05, 6.05, 0.06, 6.03, false, 0.00419, 5.96187, 0.00384),
    new Food(1, "Ceci secchi", 343, 100, "ceceseme.png", "Legumi", 1, 20.09, 46.9, 6.03, 3.07, false, 0.00785, 18.12935, 0.02947),
    new Food(1, "Barbabietole", 25, 100, "barbabietola3.png", "Verdura", 1, 1.01, 4, 0, 4, false, 0.00746, 2.79312, 0.00200),
    new Food(1, "Carote", 33, 100, "carota3.png", "Verdura", 1, 1.01, 7.06, 0, 7.06, false, 0.00310, 1.18592, 0.00083),
    new Food(1, "Sedano rapa", 29, 100, "sedanorapa.png", "Verdura", 1, 1.09, 3.08, 0.01, 3.08, false, 0.00746, 1.18592, 0.00200),
    new Food(1, "Topinambur", 29, 100, "rapabianca2.png", "Verdura", 1, 1.09, 3.08, 0.01, 3.08, false, 0.00746, 1.18592, 0.00083),
    new Food(1, "Ravanelli", 13, 100, "ravanello1.png", "Verdura", 1, 0.08, 1.08, 0.01, 1.08, false, 0.00746, 1.18592, 0.00083),
    new Food(1, "Rape", 18, 100, "rapabianca1.png", "Verdura", 1, 1, 3.08, 0, 3.08, false, 0.00746, 1.18592, 0.00083),
    new Food(1, "Cime di rapa", 28, 100, "cimedirapa.png", "Verdura", 1, 2.09, 2, 0.03, 2, false, 0.00746, 1.18592, 0.00083),
    new Food(1, "Asparagi", 29, 100, "asparago2.png", "Verdura", 1, 3.06, 3.03, 0.02, 3.03, false, 0.00795, 13.31092, 0.00524),
    new Food(1, "Asparagi selvatici", 29, 100, "asparago1.png", "Verdura", 1, 3.06, 3.03, 0.02, 3.03, false, 0.00795, 13.31092, 0.00524),
    new Food(1, "Cardi", 13, 100, "asparagi4.png", "Verdura", 1, 0.06, 1.07, 0.01, 1.05, false, 0.00419, 5.96187, 0.00384),
    new Food(1, "Finocchi", 15, 100, "finocchi.png", "Verdura", 1, 1.02, 1.05, 0, 1.05, false, 0.00480, 31.05106, 0.03208),
    new Food(1, "Porri", 35, 100, "porro1.png", "Verdura", 1, 2.01, 5.02, 0.01, 5.02, false, 0.00419, 5.96187, 0.00384),
    new Food(1, "Funghi selvatici e simili", 37, 100, "funghi2.png", "Funghi", 1, 2.02, 5.06, 0.03, 5.06, false, 0.01856, 0.00000, 0.00004),
    new Food(1, "Funghi coltivati e simili", 37, 100, "funghipioppini.png", "Funghi", 1, 2.02, 5.06, 0.03, 5.06, false, 0.01856, 0.00000, 0.00004),
    new Food(1, "Funghi secchi", 262, 100, "funghifinferli.png", "Funghi", 1, 40.6, 15.06, 4.06, 13.06, false, 0.01856, 0.00000, 0.00004),
    new Food(1, "Funghi porcini", 31, 100, "fungoporcino2.png", "Funghi", 1, 3.09, 1, 0.07, 1, false, 0.01856, 0.00000, 0.00004),
    new Food(1, "Pomodori passata", 21, 100, "pomodoripassata.png", "Verdura", 1, 1.03, 3, 0.02, 3, false, 0.00852, 3.61727, 0.00081),
    new Food(1, "Pomodori concentrati conservati", 50, 100, "pomodoriconcentrati.png", "Verdura", 1, 0, 11.04, 0.04, 11.04, false, 0.00852, 3.61727, 0.00081),
    new Food(1, "Patate", 67, 100, "patata1.png", "Tuberi", 1, 2, 15.08, 0, 0.02, false, 0.00184, 2.17202, 0.00141),
    new Food(1, "Patata dolce o americana", 67, 100, "patatadolce.png", "Tuberi", 1, 2, 15.08, 0, 0.02, false, 0.00184, 2.17202, 0.00141),
    new Food(1, "Amido di patate", 346, 100, "amidodipatate.png", "Tuberi", 1, 1.04, 90.7, 0, 9.01, false, 0.00184, 2.17202, 0.00141),
    new Food(1, "Pinoli", 604, 100, "pinoli.png", "Semi", 1, 31.9, 4, 50.3, 3.09, false, 0.00470, 46.50250, 0.01858),
    new Food(1, "Baccca di goji", 321, 100, "baccadigoji2.png", "Frutta", 1, 14, 69, 1.08, 54.6, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Foglie di alloro essiccate", 313, 100, "alloro.png", "Spezie", 1, 1.01, 1.03, 0, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Aneto", 43, 100, "aneto.png", "Spezie", 1, 3.05, 7, 1.01, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Anice stellato", 385, 100, "anicestella2.png", "Spezie", 1, 4.25, 75, 7.06, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Menta piperita", 41, 100, "mentapiperita.png", "Spezie", 1, 3.08, 5.03, 0.07, 5.03, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Maggiorana essiccata", 271, 100, "prezzemolo.png", "Spezie", 1, 12.06, 60.6, 7, 4.01, false, 0.00000, 31.05106, 0.01123),
    new Food(1, "Rosmarino", 110, 100, "rosmarino.png", "Spezie", 1, 1.04, 13.05, 4.04, 13.05, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Salvia essiccata", 116, 100, "salviafoglie.png", "Spezie", 1, 3.09, 15.06, 4.06, 15.06, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Basilico Verde ", 22, 100, "basilicoverde2.png", "Spezie", 1, 3.02, 2.07, 0.06, 0.03, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Prezzemolo", 30, 100, "prezzemolo2.png", "Spezie", 1, 3.07, 0, 0.06, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Origano essiccato macinato", 63, 100, "aneto.png", "Spezie", 1, 2.02, 2.07, 2, 2.07, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Cannella", 247, 100, "cannella.png", "Spezie", 1, 4, 81, 1.02, 2.02, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Zafferano", 310, 100, "zafferanoconfiore.png", "Spezie", 1, 11, 65, 5.08, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Cumino", 375, 100, "cuminosemi.png", "Spezie", 1, 17.08, 44.2, 22.02, 2.02, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Carcamomo", 311, 100, "carcamomobaccheesemi.png", "Spezie", 1, 10.07, 68.4, 6.07, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Papavero", 518, 100, "papaverosemi.png", "Spezie", 1, 19.05, 12.02, 40.2, 2.09, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Paprika", 282, 100, "paprikapolvere.png", "Spezie", 1, 14, 54, 13, 10, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Curcuma", 312, 100, "curcumapolvere.png", "Spezie", 1, 9.07, 67, 3.02, 3.02, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Curry", 325, 100, "currypolvere.png", "Spezie", 1, 13, 58, 14, 2.08, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Mostarda", 273, 100, "mostardasemi.png", "Spezie", 1, 0, 68, 0, 68, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Noce moscata", 525, 100, "nocemoscataseme.png", "Spezie", 1, 5.08, 49, 36, 3, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Liquirizia", 317, 100, "liquirizialegnetti.png", "Spezie", 1, 11, 59, 0.08, 1.05, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Pepe nero", 296, 100, "pepenerograni2.png", "Spezie", 1, 10, 68, 2, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Chiodi di garofano", 274, 100, "chiodidigarofano2.png", "Spezie", 1, 6, 65, 13, 2.04, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Zira", 509, 100, "zirasemi.png", "Spezie", 1, 8.01, 53.7, 16, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Wasabi tubero e salsa", 109, 100, "wasabituberoesalsa.png", "Spezie", 1, 4.08, 23.05, 0.06, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Zenzero", 80, 100, "zenzeroradice2.png", "Spezie", 1, 1.08, 18, 0.08, 0, false, 0.00000, 0.00000, 0.03578),
    new Food(1, "Fagioli borlotti in scatola", 102, 100, "fagioli.png", "Legumi", 1, 6.07, 15.09, 0.05, 1, false, 0.00572, 3.64431, 0.00197),
    new Food(1, "Lenticchie in scatola", 91, 100, "lenticchieinscatola.png", "Legumi", 1, 5, 15.04, 0.05, 0.07, false, 0.01060, 46.76587, 0.02431),
    new Food(1, "Ceci in scatola. sgocciolati", 343, 100, "ceciinscatola.png", "Legumi", 1, 20.09, 46.9, 6.03, 3.07, false, 0.00785, 18.12935, 0.02947),
    new Food(1, "Mandorla", 542.5, 100, "mandorle.png", "Frutta secca", 1, 16, 4, 51.5, 4, false, 0.00470, 107.52047, 0.03733),
    new Food(1, "Noce", 582, 100, "noce2.png", "Frutta secca", 1, 10.05, 5.05, 57.7, 3.04, false, 0.02133, 61.44000, 0.01300),
    new Food(1, "Nocciola", 655, 100, "nocciola2.png", "Frutta secca", 1, 15, 17, 61, 4.03, false, 0.00470, 46.09708, 0.05081),
    new Food(1, "Arachidi", 620, 100, "arachidi1.png", "Frutta secca", 1, 29, 8.05, 50, 3.01, false, 0.00880, 46.50250, 0.00000),
    new Food(1, "Pistacchio", 629, 100, "pistacchio.png", "Frutta secca", 1, 18.01, 8.01, 56.1, 4.05, false, 0.00880, 79.48758, 0.01995),
    new Food(1, "Castagna", 629, 100, "castagna.png", "Frutta", 1, 18.01, 8.01, 56.1, 4.05, false, 0.00430, 30.75851, 0.00772),
    new Food(1, "Mandarini", 72, 100, "mandarino.png", "Frutta", 1, 0.09, 17.06, 0.03, 17.06, false, 0.00230, 3.74761, 0.00159),
    new Food(1, "Arance", 38, 100, "arancia2.png", "Frutta", 1, 0.05, 9.06, 0, 9.06, false, 0.00230, 3.74761, 0.00159),
    new Food(1, "Pompelmo", 86, 100, "pompelmo.png", "Frutta", 1, 0.04, 21.05, 0.01, 21.05, false, 0.00230, 3.74761, 0.00159),
    new Food(1, "Mele fresche", 38, 100, "melarossa2.png", "Frutta", 1, 0.05, 9.04, 0.01, 9.04, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Pere", 59, 100, "pera2.png", "Frutta", 1, 0.02, 12.07, 0.03, 12.07, false, 0.00417, 4.00913, 0.00172),
    new Food(1, "Mirtillo", 57, 100, "mirtilli2.png", "Frutta", 1, 0.07, 14, 0.03, 10, false, 0.05810, 3.56502, 0.00505),
    new Food(1, "Mora", 43, 100, "mora.png", "Frutta", 1, 1.04, 10, 0.05, 4.09, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Lamponi", 49, 100, "lampone.png", "Frutta", 1, 1, 6.05, 0.06, 6.05, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Ribes rosso", 28, 100, "ribesrossograppolo.png", "Frutta", 1, 3.06, 24.4, 0, 6.06, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Ribes nero", 28, 100, "ribesnerograppolo.png", "Frutta", 1, 3.06, 24.4, 0, 6.06, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Ribes bianco", 28, 100, "ribesbiancograppolo.png", "Frutta", 1, 3.06, 24.4, 0, 6.06, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Uva bianca", 67, 100, "uvabiancagrappolo.png", "Frutta", 1, 0.06, 17, 0.04, 16, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Uva nera", 67, 100, "uvaneragrappolo1.png", "Frutta", 1, 0.06, 17, 0.04, 16, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Uva spina", 67, 100, "uvaspinaacini.png", "Frutta", 1, 0.06, 17, 0.04, 16, false, 0.05810, 3.52484, 0.00000),
    new Food(1, "Fragole", 27, 100, "fragola2.png", "Frutta", 1, 0.09, 5.03, 0.04, 5.03, false, 0.00752, 2.05015, 0.00130),
    new Food(1, "Ciliegie", 48, 100, "ciliegie2.png", "Frutta", 1, 0.08, 11, 0.01, 11, false, 0.00290, 18.66101, 0.00538),
    new Food(1, "Pesche", 27, 100, "pesca3.png", "Frutta", 1, 0.08, 6.01, 0.01, 6.01, false, 0.00405, 18.65370, 0.00199),
    new Food(1, "Prugne", 189, 100, "prugna1susina.png", "Frutta", 1, 0.05, 10.05, 0.01, 10.05, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Olive", 277, 100, "oliveramo2.png", "Frutta", 1, 1.05, 5, 27, 5, false, 0.00564, 19.01438, 0.01784),
    new Food(1, "Papaya", 28, 100, "papayasezionata.png", "Frutta", 1, 0.04, 6.09, 0.01, 6.09, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Avocado", 231, 100, "avocado3sezionato.png", "Frutta", 1, 4.04, 1.08, 23, 1.08, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Ananas", 50, 100, "ananas1.png", "Frutta", 1, 0.05, 13, 0.01, 10, false, 0.01090, 18.65370, 0.00112),
    new Food(1, "Durian frutto", 147, 100, "durianfrutto.png", "Frutta", 1, 1.05, 27, 5, 23, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Litchi", 66, 100, "litchiaperto.png", "Frutta", 1, 0.06, 17, 0.04, 16, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Frutto della passione", 97, 100, "frutto1.png", "Frutta", 1, 2.02, 23, 0.07, 16, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Melograna", 83, 100, "melagrana3.png", "Frutta", 1, 1.07, 19, 1.02, 14, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Prugne secche", 236, 100, "prugna2.png", "Frutta", 1, 2.02, 55, 0.05, 55, false, 0.00750, 18.65370, 0.01849),
    new Food(1, "Datteri secchi", 270, 100, "", "Cereali", 1, 2.07, 63.1, 0.06, 63.1, false, 0.00750, 18.65370, 0.01849),
    new Food(1, "Noce di cocco", 354, 100, "", "Frutta", 1, 3.03, 15, 33, 6, false, 0.00750, 18.65370, 0.01849),
    new Food(1, "Fichi secchi", 282, 100, "fico1.png", "Frutta", 1, 3.05, 58, 2.07, 58, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Marmellata", 222, 100, "marmellatavasetto.png", "Dolci", 1, 0.05, 58.7, 0, 58.7, false, 0.00750, 18.65370, 0.00462),
    new Food(1, "Carne di bovino adulto - tagli posteriori", 117, 100, "bovinapezzo.png", "Carne", 1, 21.05, 0, 3.04, 0, false, 0.06206, 32.85714, 0.04033),
    new Food(1, "Carne di maiale leggero - bistecca", 157, 100, "bistecche2.png", "Carne", 1, 21.03, 0, 8, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Carne di agnello - coscia magra", 102, 100, "agnellocoatolette.png", "Carne", 1, 20, 0, 2.05, 0, false, 0.30411, 93.64000, 0.03117),
    new Food(1, "Agnello costine carre", 106, 100, "agnellocoatolette.png", "Carne", 1, 20.04, 0, 2.07, 0, false, 0.30411, 93.64000, 0.03117),
    new Food(1, "Carne fresca di capra", 121, 100, "sottofesamaiale.png", "Carne", 1, 21, 0, 4.01, 0, false, 0.06206, 32.85714, 0.04033),
    new Food(1, "Carne fresca di cavallo", 106, 100, "sottofesamaiale.png", "Carne", 1, 23.05, 0.07, 1, 0.07, false, 0.06206, 32.85714, 0.04033),
    new Food(1, "Coscia di coniglio", 137, 100, "coniglio.png", "Carne", 1, 21, 0, 5.09, 0, false, 0.03820, 111.74000, 0.05440),
    new Food(1, "Carne fresca di cervo", 91, 100, "cavallobistecca1.png", "Carne", 1, 21, 0, 0.08, 0, false, 0.06206, 32.85714, 0.04033),
    new Food(1, "Carne fresca di cinghiale", 122, 100, "cavallobistecca.png", "Carne", 1, 21.05, 0, 3.03, 0, false, 0.06206, 32.85714, 0.04033),
    new Food(1, "Pollo arrosto", 245, 100, "polloarrosto.png", "Carne", 1, 28.3, 0, 14.07, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Ali di pollo", 126, 100, "polloali1.png", "Carne", 1, 22, 0, 3.05, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Petto di pollo", 129, 100, "pollopetto2.png", "Carne", 1, 30.2, 0, 0.09, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Coscia di pollo", 100, 100, "pollocoscia.png", "Carne", 1, 23.03, 0, 0.08, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Fusi di pollo", 134, 100, "pollofusi1.png", "Carne", 1, 19, 0, 6.04, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Arrosto di pollo affettato", 93, 100, "polloarrostoaffettare.png", "Carne", 1, 18.07, 2.01, 1.01, 1.01, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Tacchino Arrosto Affettato", 125, 100, "tacchinoarrostoaffettare.png", "Carne", 1, 21.02, 2.02, 2.08, 1.01, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Tacchino ossobuco", 132, 100, "tacchinoossobuco.png", "Carne", 1, 19, 0, 6, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Lardo", 530, 100, "lardo2.png", "Carne", 1, 15.01, 0, 52.2, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Fegato di bovino", 142, 100, "", "Carne", 1, 20, 5.09, 4.04, 5.09, false, 0.06206, 32.85714, 0.04033),
    new Food(1, "Fegato di maiale", 140, 100, "", "Carne", 1, 22.08, 1.05, 4.08, 1.05, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Fegato di pollo", 154, 100, "", "Carne", 1, 22.08, 1.05, 6.03, 1.05, false, 0.02735, 26.44000, 0.01087),
    new Food(1, "Bresaola", 175, 100, "bresaola.png", "Carne", 1, 34, 0, 4.03, 0, false, 0.21720, 115.00000, 0.14115),
    new Food(1, "Carne di cavallo, essiccata", 133, 100, "bistecchemisto.png", "Carne", 1, 21.04, 0, 4.06, 0, false, 0.21720, 115.00000, 0.14115),
    new Food(1, "Prosciutto cotto magro", 138, 100, "prosciuttocrudo1.png", "Carne", 1, 15.07, 0, 7.06, 0, false, 0.06497, 63.47000, 0.03027),
    new Food(1, "Prosciutto crudo", 266, 100, "prosciutto.png", "Carne", 1, 26, 0, 18, 0, false, 0.06497, 63.47000, 0.03027),
    new Food(1, "Mortadella", 311, 100, "mortadella2.png", "Carne", 1, 16, 3.01, 25, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Salsiccia in stile italiano", 304, 100, "salsiccespeziatefrescheconinvolucro2.png", "Carne", 1, 15.04, 0.06, 26.7, 0.06, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Salsicce speziate fresche con involucro", 304, 100, "salsiccespeziatefrescheconinvolucro.png", "Carne", 1, 15.04, 0.06, 26.7, 0.06, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Salsicce crude stagionate", 304, 100, "salciccia1.png", "Carne", 1, 15.04, 0.06, 26.7, 0.06, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Wurstel", 304, 100, "wurstel2afette.png", "Carne", 1, 15.04, 0.06, 26.7, 0.06, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Salame", 336, 100, "salametagliato.png", "Carne", 1, 22, 2.04, 26, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Arrotolato", 169, 100, "arrotolato.png", "Carne", 1, 25.2, 2, 6.01, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Bistecca", 271, 100, "cavallobisteccca2.png", "Carne", 1, 25, 0, 19, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Braciola", 351, 100, "braciola.png", "Carne", 1, 23, 0, 28, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Bacon", 428, 100, "baconfette.png", "Carne", 1, 17, 0, 40, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Paillard", 450, 100, "paillard.png", "Carne", 1, 37, 12, 26, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Hamburger", 182, 100, "hamburgher1cotto.png", "Carne", 1, 96.6, 0, 85.1, 0, false, 0.06497, 60.92000, 0.02347),
    new Food(1, "Patatine fritte", 312, 100, "patatinefritte.png", "Contorni", 1, 3.04, 41, 15, 0.03, false, 0.00184, 2.17202, 0.00141),
    new Food(1, "Tacos", 115, 100, "tacos.png", "Contorni", 1, 4, 23, 1, 5, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Scorfano", 82, 100, "scorfanosfortuanato.png", "Pesce", 1, 19, 0.06, 0.04, 0.06, false, 0.03880, 15.00000, 0.49000),
    new Food(1, "Anguille di fiume", 261, 100, "", "Pesce", 1, 11.08, 0, 23.07, 0, false, 0.03880, 15.00000, 0.49000),
    new Food(1, "Sgombro o sgombro spagnolo", 170, 100, "sgombro.png", "Pesce", 1, 17, 0.05, 11.01, 0.05, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Ippoglosso", 114, 100, "halibut.png", "Pesce", 1, 20.06, 0, 3.05, 0, false, 0.03880, 15.00000, 0.49000),
    new Food(1, "Tonno", 130, 100, "tonnopinnagialla.png", "Pesce", 1, 29, 0, 0.06, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Branzino", 82, 100, "branzino.png", "Pesce", 1, 16.05, 0.06, 1.05, 0.06, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Pesce spada", 304, 100, "", "Pesce", 1, 15.04, 0.06, 26.7, 0.06, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Merluzzo o nasello", 71, 100, "merluzzoonasellotrancio2.png", "Pesce", 1, 17, 0, 0.03, 0, false, 0.03405, 6.50000, 0.34000),
    new Food(1, "Orata", 159, 100, "orata1.png", "Pesce", 1, 19.07, 1.02, 8.04, 0, false, 0.03725, 5.00000, 0.06306),
    new Food(1, "Uova di pesce", 264, 100, "uovasalmonecaviale.png", "Pesce", 1, 25, 4, 18, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Salmone fresco", 185, 100, "salmonefetta.png", "Pesce", 1, 18.04, 1, 12, 0, false, 0.03826, 19.50000, 0.05484),
    new Food(1, "Gamberi", 71, 100, "gamberi.png", "Pesce", 1, 13.06, 2.09, 0.06, 0, false, 0.08000, 22.50000, 0.02604),
    new Food(1, "Granchi, ragni di mare", 84, 100, "granchioreale.png", "Pesce", 1, 18.01, 0, 0.09, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Aragoste", 85, 100, "aragosta2.png", "Pesce", 1, 20.02, 1.03, 2.04, 1.03, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Cozza", 84, 100, "cozza1.png", "Pesce", 1, 11.07, 0, 2.07, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Vongole", 72, 100, "vongole.png", "Pesce", 1, 10.02, 2.02, 2.05, 2.02, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Ostriche", 69, 100, "ostrica.png", "Pesce", 1, 10.02, 5.04, 0.09, 4.05, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Cappesante", 69, 100, "cappasanta2.png", "Pesce", 1, 12, 0, 0.05, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Polpo", 57, 100, "polpo.png", "Pesce", 1, 10.06, 1.04, 1, 1.04, false, 0.06910, 0.00000, 0.13406),
    new Food(1, "Seppie", 72, 100, "seppia.png", "Pesce", 1, 14, 0.07, 1.05, 0.07, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Lumache di mare", 90, 100, "lumacadimare.png", "Pesce", 1, 16.01, 2, 1.04, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Calamari", 68, 100, "calamaro.png", "Pesce", 1, 12.06, 0.06, 1.07, 0.06, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Alghe", 306, 100, "alghedimare.png", "Pesce", 1, 6, 81, 0.03, 3, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Latte", 42, 100, "lattecartone.png", "Latte e derivati", 1, 3.05, 5, 1, 5, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Latte di vacca - scremato", 36, 100, "lattedimuccaschrematocartone.png", "Latte e derivati", 1, 3.06, 5.03, 0.02, 5.03, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Latte di capra", 76, 100, "", "Latte e derivati", 1, 3.09, 4.07, 4.08, 4.07, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Panna", 140, 100, "pannaciotola.png", "Latte e derivati", 1, 2.08, 4.04, 12.05, 4.04, false, 0.01411, 4.94000, 0.00306),
    new Food(1, "Yogurt intero", 36, 100, "yogurtifrutta.png", "Latte e derivati", 1, 3.03, 4, 0.09, 4, false, 0.01430, 9.06000, 0.00382),
    new Food(1, "Bevande a base di yogurt", 80, 100, "yogurtfruttabottiglia.png", "Latte e derivati", 1, 3.04, 10.05, 2.08, 10.05, false, 0.01430, 9.06000, 0.00382),
    new Food(1, "Kefir", 67, 100, "", "Latte e derivati", 1, 3.02, 4.04, 4.01, 4.04, false, 0.01411, 24.26000, 0.00294),
    new Food(1, "Latte condensato", 328, 100, "", "Latte e derivati", 1, 8.07, 56.5, 9, 56.5, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Latte in polvere", 484, 100, "", "Latte e derivati", 1, 25.7, 42, 24.9, 42, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Dolci latticini. da cucchiaio", 223, 100, "", "Latte e derivati", 1, 2, 23.03, 12.03, 22.03, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Budino", 120, 100, "", "Latte e derivati", 1, 3.02, 20, 3.02, 12, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Gelato a base di latte", 218, 100, "gelatocono2.png", "Latte e derivati", 1, 4.02, 20.07, 13.07, 20.07, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Gelato a base di sostituti del latte", 218, 100, "", "Latte e derivati", 1, 4.02, 20.07, 13.07, 20.07, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Robiola", 338, 100, "robiola.png", "Latte e derivati", 1, 20, 2.03, 27, 2.03, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Mascarpone", 455, 100, "mascarpone.png", "Latte e derivati", 1, 7.06, 0, 47, 0, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Mozzarella di vacca", 253, 100, "mozzarella.png", "Latte e derivati", 1, 18.07, 0.07, 19.05, 0.07, false, 0.08440, 24.26000, 0.02037),
    new Food(1, "Ricotta di vacca", 146, 100, "ricotta.png", "Latte e derivati", 1, 8.08, 3.05, 10.09, 3.05, false, 0.08944, 38.67000, 0.02176),
    new Food(1, "Feta", 250, 100, "formaggiofresco.png", "Latte e derivati", 1, 15.06, 1.05, 20.02, 1.05, false, 0.08944, 24.26000, 0.02176),
    new Food(1, "Pecorino", 404, 100, "pecorinoromano.png", "Latte e derivati", 1, 28.8, 0.02, 32, 0.02, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Brie" , 374, 100, "brie.png", "Latte e derivati", 1, 25.4, 0, 30.2, 0, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Emmental", 403, 100, "emental2.png", "Latte e derivati", 1, 28.5, 3.06, 30.6, 3.06, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Fontina", 365, 100, "fontina.png", "Latte e derivati", 1, 27, 0, 28, 0, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Grana", 406, 100, "grana.png", "Latte e derivati", 1, 33.9, 3.07, 28.5, 3.07, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Formaggi lavorati. spalmabili", 313, 100, "spalmabile.png", "Latte e derivati", 1, 8.06, 0, 31, 0, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Uova di gallina", 128, 100, "uovodigallina.png", "Uova", 1, 12.04, 0, 8.07, 0, false, 0.02700, 14.95000, 0.01613),
    new Food(1, "Zucchero (saccarosio),", 392, 100, "zuccherociotola.png", "Condimenti", 1, 0, 104.5, 0, 104.5, false, 0.01648, 0.00000, 0.00000),
    new Food(1, "Zucchero a velo", 392, 100, "vanigliabustina.png", "Condimenti", 1, 0, 104.5, 0, 104.5, false, 0.01648, 0.00000, 0.00000),
    new Food(1, "Miele", 304, 100, "miele.png", "Condimenti", 1, 0.06, 80.3, 0, 80.3, false, 0.01648, 0.00000, 0.00000),
    new Food(1, "Sciroppi", 297, 100, "sciroppo.png", "Condimenti", 1, 0.03, 79, 0, 79, false, 0.01648, 0.00000, 0.00000),
    new Food(1, "Crema di nocciole e cacao", 535, 100, "Cremadinoccioleecacao.png", "Condimenti", 1, 6.09, 58, 32.4, 58.1, false, 0.03550, 171.96000, 0.01596),
    new Food(1, "Caramelle dure", 344, 100, "caramella3.png", "Dolciumi", 1, 0, 91.6, 0, 91.6, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Caramelle lollipop", 394, 100, "caramella13lollipop.png", "Dolciumi", 1, 0, 98, 0.02, 98, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Caramelle toffee", 430, 100, "caramella2.png", "Dolciumi", 1, 2.01, 71.1, 17.02, 70, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Marshmallow", 318, 100, "marshmallow1tocilione.png", "Dolciumi", 1, 1.08, 81, 0.02, 58, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Torrone", 483, 100, "", "Dolciumi", 1, 10.08, 52, 26.8, 52, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Sorbetto", 132, 100, "", "Dolciumi", 1, 0, 34.2, 0, 34.2, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Olio extravergine di oliva", 899, 100, "olioevobottiglia.png", "Condimenti", 1, 0, 0, 99.9, 0, false, 0.03800, 216.35000, 0.08415),
    new Food(1, "Oli di semi", 899, 100, "oliosemibottiglia.png", "Condimenti", 1, 0, 0, 99.9, 0, false, 0.12119, 42.40000, 0.05555),
    new Food(1, "Altri oli vegetali", 899, 100, "olioaltriolivegetali.png", "Condimenti", 1, 0, 0, 99.9, 0, false, 0.12119, 42.40000, 0.05555),
    new Food(1, "Burro", 758, 100, "burropanetto.png", "Latte e derivati", 1, 0.08, 1.01, 83.4, 1.01, false, 0.12119, 42.40000, 0.05555),
    new Food(1, "Margarina", 760, 100, "margarina.png", "Condimenti", 1, 0.06, 0.04, 84, 0.04, false, 0.01360, 216.35000, 0.07492),
    new Food(1, "Succo di mela", 38, 100, "succomela.png", "Frutta", 1, 0.01, 9.09, 0.01, 9.09, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Succo di ananas", 50, 100, "succodiananas.png", "Frutta", 1, 0.04, 12.07, 0.01, 10, false, 0.01090, 18.65370, 0.00112),
    new Food(1, "Succo di pompelmo", 66, 100, "succodipompelmo.png", "Frutta", 1, 0.03, 17.03, 0, 17.03, false, 0.00230, 3.74761, 0.00159),
    new Food(1, "Succo d'arancia", 33, 100, "succoaranciabriko.png", "Frutta", 1, 0.05, 8.02, 0, 8.02, false, 0.00230, 3.74761, 0.00159),
    new Food(1, "Nettare di albicocca", 47, 100, "", "Frutta", 1, 0.03, 12, 0.01, 12, false, 0.00430, 6.75392, 0.00472),
    new Food(1, "Succo di pomodoro", 16, 100, "succodipomodoro.png", "Frutta", 1, 0.08, 3, 0, 3, false, 0.00852, 3.61727, 0.00081),
    new Food(1, "Succo di carota", 24, 100, "succodicarota.png", "Frutta", 1, 0.05, 5.07, 0.01, 5.07, false, 0.00852, 3.61727, 0.00081),
    new Food(1, "Succhi misti di frutta e verdura", 45, 100, "succhimistidifruttaeverdura.png", "Frutta", 1, 0.03, 11.04, 0.03, 11.04, false, 0.00852, 3.61727, 0.00081),
    new Food(1, "Succhi misti con ingredienti aggiunti", 43, 100, "succhimisticoningredientiaggiunti.png", "Frutta", 1, 0.03, 11.02, 0, 10.04, false, 0.00852, 3.61727, 0.00081),
    new Food(1, "Acqua", 0, 100, "acquanaturalebottiglia.png", "Bevande", 1, 0, 0, 0, 0, false, 0, 0, 0),
    new Food(1, "Bevande di tipo cola", 39, 100, "lattina4bibitasoft.png", "Bevande", 1, 0, 10.05, 0, 10.05, false, 0.04900, 37.85000, 0.03402),
    new Food(1, "Bevande energetiche", 61, 100, "lattina8energetica.png", "Bevande", 1, 0, 14.04, 0, 14.04, false, 0.04900, 37.85000, 0.03402),
    new Food(1, "Cacao amaro in polvere", 355, 100, "caffèpolveresacco.png", "Dolci", 1, 20.04, 11.05, 25.6, 0, false, 0.04900, 37.85000, 0.03402),
    new Food(1, "Caffè", 0, 100, "caffè.png", "Bevande", 1, 0, 0, 0, 0, false, 0.04900, 37.85000, 0.03402), 
    new Food(1, "Tè non fermentato infuso", 1, 100, "tèd'orzobibita.png", "Bevande", 1, 0, 0, 0, 0, false, 0.00488, 8.72128, 0.01023),
    new Food(1, "Infuso di tè con ingredienti aromatizzanti aggiunti", 1, 100, "tealgelsomino.png", "Bevande", 1, 0, 0, 0, 0, false, 0.04900, 37.85000, 0.03402),
    new Food(1, "Infusi di erbe e altre infusioni non a base di tè", 1, 100, "teverdebibita.png", "Bevande", 1, 0, 0, 0, 0, false, 0.04900, 37.85000, 0.03402),
    new Food(1, "Infuso di camomilla", 1, 100, "bollitore.png", "Bevande", 1, 0, 0, 0, 0, false, 0.04900, 37.85000, 0.03402),
    new Food(1, "Birra", 34, 100, "bottiglia11birra.png", "Bevande", 1, 0.02, 3.05, 0, 3.05, false, 0, 0, 0),
    new Food(1, "Birra lager", 34, 100, "bottiglia11birra.png", "Bevande", 1, 0.02, 3.05, 0, 3.05, false, 0, 0, 0),
    new Food(1, "Vino da pasto bianco", 70, 100, "bottiglia3.png", "Bevande", 1, 0, 0, 0, 0, false, 0.01290, 3.94000, 0.00372),
    new Food(1, "Vino da pasto rosso", 75, 100, "bottiglia17vinorosso.png", "Bevande", 1, 0, 0, 0, 0, false, 0.01290, 3.94000, 0.00372),
    new Food(1, "Vino frizzante", 87, 100, "vinofrizzante.png", "Bevande", 1, 0, 0.06, 0, 0.06, false, 0.01290, 3.94000, 0.00372),
    new Food(1, "Vini liquorosi e da dessert", 314, 100, "viniliquorosiedadessert.png", "Bevande", 1, 0, 31, 0, 31, false, 0.01290, 3.94000, 0.00372),
    new Food(1, "Liquori", 314, 100, "bottiglia9.png", "Bevande", 1, 0, 31.1, 0, 31.1, false, 0, 0, 0),
    new Food(1, "Cocktail", 186, 100, "", "Bevande", 1, 0, 17, 0, 17, false, 0, 0, 0),
    new Food(1, "Biscotti, gallette e biscotti per bambini", 417, 100, "biscottisecchi.png", "Prodotti da forno", 1, 13.08, 76.1, 8.05, 40.4, false, 0.01595, 25.38559, 0.00983),
    new Food(1, "Latte di soia", 32, 100, "lattedisoia.png", "Bevande", 1, 2.09, 0.08, 1.09, 0.08, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Latte di mandorle", 450, 100, "lattedimandorla.png", "Bevande", 1, 8.41, 50.2, 27, 50.2, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Altre imitazioni del latte oltre ai latti", 132, 100, "imitazionedellatte.png", "Bevande", 1, 2.09, 0.08, 1.09, 0.08, false, 0.01411, 14.31000, 0.00190),
    new Food(1, "Pizza con pomodoro e mozzarella", 255, 100, "pizzamozzarellapomodoro.png", "Prodotti da forno", 1, 12.01, 35.5, 7.06, 2.05, false, 0.03000, 17.59421, 0.01050),
    new Food(1, "Cubetti o granuli di dado (base per il brodo),", 250, 100, "zuccherodicannazollette.png", "Condimenti", 1, 15.07, 5, 18.07, 0, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Dragoncello e simili", 295, 100, "", "Condimenti", 1, 23, 50, 7, 0, false, 0.00000, 31.05106, 0.01123),
    new Food(1, "Grano saraceno e altri pseudo-cereali e simili", 329, 100, "granosaracenoseme.png", "Cereali", 1, 12.04, 61.2, 3.03, 9, false, 0.00430, 8.49582, 0.01204),
    new Food(1, "Cereali soffiati", 354, 100, "", "Cereali", 1, 6, 85, 1, 9, false, 0.02990, 14.76614, 0.00887),
    new Food(1, "Minestre (misto secco non cotto),", 51, 100, "", "Cereali", 1, 1.05, 7.09, 1.05, 1.08, false, 0.00700, 2.10940, 0.00150),
    new Food(1, "Minestra mista di verdure, secca", 51, 100, "", "Cereali", 1, 1.05, 7.09, 1.05, 1.08, false, 0.00700, 2.10940, 0.00150),
    new Food(1, "Minestra di funghi, secca", 51, 100, "", "Cereali", 1, 1.05, 7.09, 1.05, 1.08, false, 0.00700, 2.10940, 0.00150),
    new Food(1, "Pane conservato", 356, 100, "pancarretost.png", "Pane e lievitati", 1, 10.08, 82.8, 0.03, 2.07, false, 0.01595, 25.38559, 0.00983),
    new Food(1, "Pane tipo 0", 356, 100, "panebauletto.png", "Pane e lievitati", 1, 10.08, 82.8, 0.03, 2.07, false, 0.01595, 25.38559, 0.00983),
    new Food(1, "Frutti di mare in scatola/barattolo", 77, 100, "", "Pesce", 1, 18.01, 0, 0.05, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Tonno sott'olio. sgocciolato", 103, 100, "tonnoattina.png", "Pesce", 1, 25.1, 0, 0.03, 0, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Mais, macinato", 341, 100, "maispannocchia3.png", "Cereali", 1, 8.07, 73.5, 2.07, 1.05, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Minestre miste", 51, 100, "", "Cereali", 1, 1.05, 7.09, 1.05, 1.08, false, 0.00700, 2.10940, 0.00150),
    new Food(1, "Semi di zucca e simili", 447, 100, "semidigirasole.png", "Cereali", 1, 24.5, 0, 31, 0, false, 0.00470, 14.07414, 0.01130),
    new Food(1, "Capperi e simili", 33, 100, "capperi.png", "Condimenti", 1, 2.06, 2.01, 1, 0, false, 0.00419, 5.96187, 0.00384),
    new Food(1, "Distillati da frutta", 232, 100, "bottiglia12.png", "Bevande", 1, 0, 0.05, 0, 0.05, false, 0, 0, 0),
    new Food(1, "Distillati non da frutta", 232, 100, "bottiglia12.png", "Bevande", 1, 0, 0.05, 0, 0.05, false, 0, 0, 0),
    new Food(1, "Cicoria da campo", 17, 100, "cimedirapa2.png", "Verdura", 1, 1.04, 0.07, 0.02, 0.07, false, 0.00746, 1.20476, 0.00000),
    new Food(1, "Orzo perlato", 346, 100, "orzoperlato.png", "Cereali", 1, 9.04, 73.7, 1.05, 1.05, false, 0.00488, 8.72128, 0.01023),
    new Food(1, "Farro", 353, 100, "farroseme.png", "Cereali", 1, 14.06, 69.3, 2.04, 2.04, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Semi di girasole e simili", 447, 100, "semidigirasole.png", "Cereali", 1, 24.5, 0, 31, 0, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Piselli secchi e simili", 317, 100, "pisellifreschi2.png", "Verdura", 1, 21.07, 48.2, 2, 2.09, false, 0.00419, 5.96187, 0.00384),
    new Food(1, "Lenticchie secche", 319, 100, "lenticchie.png", "Legumi", 1, 22.07, 51.1, 1, 1.08, false, 0.01060, 46.76587, 0.02431),
    new Food(1, "Cicorie belghe e simili", 23, 100, "cimedirapa.png", "Verdura", 1, 1.05, 0.07, 0.02, 0, false, 0.00746, 1.20476, 0.00000),
    new Food(1, "Bietola", 19, 100, "cimedirapa2.png", "Verdura", 1, 1.08, 3.07, 0.02, 1.01, false, 0.00746, 2.79312, 0.00200),
    new Food(1, "Cavoli di Bruxelles", 43, 100, "cavolettidibruxelles.png", "Verdura", 1, 3.04, 9, 0.03, 2.02, false, 0.00345, 2.10940, 0.00150),
    new Food(1, "Fichi d'India e simili", 53, 100, "fico2.png", "Frutta", 1, 0.08, 13, 0.01, 13, false, 0.00750, 18.65370, 0.01849),
    new Food(1, "Datteri", 270, 100, "", "Frutta", 1, 2.07, 63.2, 0.06, 63.2, false, 0.00750, 18.65370, 0.01849),
    new Food(1, "Albicocche", 42, 100, "albicocca3.png", "Frutta", 1, 0.04, 9.08, 0.01, 9.08, false, 0.00430, 6.75392, 0.00472),
    new Food(1, "Nespoli e simili", 32, 100, "nespola.png", "Frutta", 1, 0.04, 6.01, 0.04, 6.01, false, 0.00430, 6.75392, 0.00472),
    new Food(1, "Mele cotogne e simili", 38, 100, "melacotogna.png", "Frutta", 1, 0.03, 6.03, 0.01, 6.03, false, 0.00277, 2.30455, 0.00171),
    new Food(1, "Noci di pecan", 723, 100, "nocidipecan.png", "Frutta secca", 1, 7.02, 7.09, 71.8, 4.03, false, 0.00470, 46.09708, 0.05081),
    new Food(1, "Noci di macadamia", 333, 100, "noci.png", "Frutta secca", 1, 6.07, 79.3, 1, 0, false, 0.00470, 46.09708, 0.05081),
    new Food(1, "Anacardi", 604, 100, "anacardi.png", "Frutta secca", 1, 15, 33, 46, 5.06, false, 0.01663, 142.18000, 0.12805),
    new Food(1, "Cioccolato fondente", 531, 100, "cioccolatofondente.png", "Dolciumi", 1, 6.06, 49.7, 33.6, 49.7, false, 0.03550, 171.96000, 0.01596),
    new Food(1, "Patatine/crisps", 512, 100, "", "Contorni", 1, 5.04, 58, 29.6, 1, false, 0.00184, 2.17202, 0.00141),
    new Food(1, "Semola", 346, 100, "", "Cereali", 1, 11.05, 76.9, 0.05, 1.09, false, 0.01425, 14.07414, 0.01100),
    new Food(1, "Noci secche", 702, 100, "nocesecca.png", "Frutta secca", 1, 14.03, 5.01, 68.1, 3.01, false, 0.02133, 61.44000, 0.01300),
    new Food(1, "Maionese, hollandaise e salse correlate", 655, 100, "senape.png", "Condimenti", 1, 4.03, 2.01, 70, 2.01, false, 0.00852, 2.71295, 0.00323),
    new Food(1, "Salmone fresco", 185, 100, "salmonetrancio.png", "Pesce", 1, 18.04, 1, 12, 1, false, 5.60, 4.80, 2.80),
    new Food(1, "Tuorlo d'uovo", 325, 100, "uovosodogallinasezionato.png", "Uova", 1, 15.08, 0, 29.1, 0, false, 0.01500, 8.30556, 0.00896),
    new Food(1, "Albume d'uovo", 43, 100, "uovosodogallinasezionato.png", "Uova", 1, 10.07, 0, 0, 0, false, 0.01500, 8.30556, 0.00896),
    new Food(1, "Dolcificanti da tavola liquidi", 370, 100, "cucchiainopieno.png", "Dolciumi", 1, 0, 98.6, 0, 98.6, false, 0, 0, 0),
    new Food(1, "Aringhe, sardine, acciughe", 216, 100, "acciughe.png", "Pesce", 1, 16.05, 0, 16.07, 0, false, 5.60, 4.80, 2.80),
    new Food(1, "Squali, razze, chimere", 68, 100, "squalobianco.png", "Pesce", 1, 14.02, 0.07, 0.09, 0.07, false, 5.60, 4.80, 2.80),
    new Food(1, "Cozze", 84, 100, "cozza1.png", "Pesce", 1, 11.07, 3.04, 2.07, 0.03, false, 0.03781, 0.00000, 0.30011),
    new Food(1, "Budino alla vaniglia", 127, 100, "torta2budino.png", "Dolci", 1, 2.07, 22, 3, 20, false, 0.00767, 0.00000, 0.01204),
    new Food(1, "Tempeh", 166, 100, "formaggiofrescoaromatizato.png", "Latte e derivati", 1, 20.07, 6.04, 6.04, 4.03, false, 0.00639, 12.86390, 0.01091),
    new Food(1, "Filetto di vitello", 324, 100, "filetto.png", "Carne", 1, 24, 0, 25, 0, false, 0.21720, 115.00000, 0.14115),
    new Food(1, "Mozzarella di bufala", 288, 100, "mozzarella.png", "Latte e derivati", 1, 16.07, 0.04, 24.4, 0.04, false, 0.08440, 24.26000, 0.02037),
    new Food(1, "Parmigiano", 387, 100, "grana1.png", "Latte e derivati", 1, 33.5, 0, 28.1, 0, false, 0.08944, 38.67000, 0.02037),
    new Food(1, "Fesa di tacchino", 189, 100, "tacchinosalume.png", "Carne", 1, 29, 0.01, 7, 0, false, 0.02735, 26.44000, 0.02053),
    new Food(1, "Pangrattato", 395, 100, "panegrattuggiato.png", "Pane e lievitati", 1, 13, 72, 5, 6, false, 0.01082, 12.23839, 0.00983),
    new Food(1, "Carciofi", 47, 100, "carciofo.png", "Verdura", 1, 3.03, 11, 0.02, 1, false, 0.00480, 8.11221, 0.00233),
    new Food(1, "Ketchup", 112, 100, "ketchup.png", "Condimenti", 1, 1.03, 26, 0.02, 22, false, 0.00852, 2.71295, 0.00323),
    new Food(1, "Grissini", 412, 100, "panetipobaguette.png", "Pane e lievitati", 1, 12, 68, 10, 1.03, false, 0.01082, 12.23839, 0.00983),
    new Food(1, 'Spaghetti', 356, 80, '../../assets/spaghetti.png', 'Pasta', 1, 10.8, 82, 2.7, 0.3, false, 0.01425, 14.07414, 0.011001),
    new Food(1, 'Guanciale', 117, 20, '../../assets/baconfette.png', 'Carne', 1, 21.5, 0, 0, 3.4, false, 0.06497, 60.92000, 0.02347) 
  ];

  recipes: Recipe[] = [
    new Recipe (1, 'Carbonara', '../../assets/carbonara.png', 'Primi', 1, 
          [
            new Food(1, 'Spaghetti', 356, 80, '../../assets/spaghetti.png', 'Pasta', 1, 10.8, 82, 2.7, 0.3, false, 0.01425, 14.07414, 0.011001),
            new Food(1, 'Guanciale', 117, 20, '../../assets/baconfette.png', 'Carne', 1, 21.5, 0, 0, 3.4, false, 0.06497, 60.92000, 0.02347),
            new Food(1, "Uova di gallina", 128, 100, "uovodigallina.png", "Uova", 1, 12.04, 0, 8.07, 0, false, 0.02700, 14.95000, 0.01613),
            new Food(1, "Pecorino", 404, 100, "pecorinoromano.png", "Latte e derivati", 1, 28.8, 0.02, 32, 0.02, false, 0.08944, 38.67000, 0.02037),
            new Food(1, "Pepe nero", 296, 100, "pepenerograni2.png", "Spezie", 1, 10, 68, 2, 0, false, 0.00000, 0.00000, 0.03578)
          ] 
    ),
    new Recipe (1, 'Cacio e pepe', '../../assets/cacioepepe.png', 'Primi', 1, 
          [
            new Food(1, 'Spaghetti', 356, 80, '../../assets/spaghetti.png', 'Pasta', 1, 10.8, 82, 2.7, 0.3, false, 0.01425, 14.07414, 0.011001),
            new Food(1, "Pecorino", 404, 100, "pecorinoromano.png", "Latte e derivati", 1, 28.8, 0.02, 32, 0.02, false, 0.08944, 38.67000, 0.02037),
            new Food(1, "Pepe nero", 296, 100, "pepenerograni2.png", "Spezie", 1, 10, 68, 2, 0, false, 0.00000, 0.00000, 0.03578)
          ] 
    ),

  ];

   user: any;

   // PATH immaggini
   PATH: any = '../../assets/icone_ingredienti/';

   // Array per la visualizzazione dei risultati filtrati
   filteredFoods: any = this.foods;
   filteredAndVisibleFoods: any[] = this.foods;
 
   // Array per le categorie di ingredienti/ricette
   foodCategories: any = [];
 
   // Flag per commutare tra ingredienti e ricette
   listSwitch: boolean = true;
 
   // Valore per il filtro di valore EV
   filterEvValue: number = 0;
 
   // Input per valori nuova ricetta
   newRecipeName: string = '';
   recipeImage: string = '';
   recipeNameResults: string = 'Mia ricetta';
   recipeImageResults: string[] = [];
 
   // Switch per apertura popup elementi
   overlay: boolean = false;
 
   // Valori EF per 100kcal
   CF: any = 'CF' // Kg co2
   WF: any = 'WF' // L
   EF: any = 'EF' // mq
 
   recipeImages: any = ['cacioepepe.png', 'caprese.png', 'carbonara.png'];
 
   overlaySwitch() {
     this.overlay = this.overlay? false : true;
     this.setResultsRecipeImage();
     this.setResultsFoodValues();
   }
 
   // Commuta la visualizzazione tra ingredienti e ricette
   switchTrue() {
     this.listSwitch = true;
     this.filteredFoods = this.foods;
     this.getCategories();
     this.resetFilters();
     console.log(this.done);
   }
 
   switchFalse() {
     this.listSwitch = false;
     this.filteredFoods = this.recipes;
     this.getCategories();
     this.resetFilters();
     console.log(this.done);
   }
 
   // Trasforma le categorie in lettere minuscole
   toLowercaseCategories() {
     this.filteredFoods.forEach((element: any) => {
       element.category.toLowerCase();
     });
   }
 
   // Ottiene le categorie univoche in base agli elementi filtrati
/*    getCategories() {
     this.foodCategories = [];
     this.foods.forEach(element => {
       if (!this.foodCategories.includes(element.category)) {
         this.foodCategories.push(element.category);
       }
     });
     console.log(this.foodCategories);
   } */
 
   // Eseguito all'inizio
   ngOnInit() {
     let userStorage: any = localStorage.getItem('user');
     this.user = JSON.parse(userStorage);
     if (this.ingredientsList) {
      console.log(this.ingredientsList)
      this.done = this.ingredientsList;
      this.emitData();
     }
     this.getCategories();
     this.getIngredients();
     this.toLowercaseCategories();
     this.setPopover();
   }

   getIngredients() {
    this.backend.getIngredients().subscribe((resp) => {
      console.log(resp);
      this.foods = resp;
      this.filteredFoods = this.foods;
      this.filteredAndVisibleFoods = this.foods;
    })
  }
 
   // Array per gli ingredienti o le ricette selezionati
   done: any[] = [];
   weight: any = 0;
 
   // Filtro per nome e categoria
   filterName: string = '';
   filterCategory: any = '0';
 
 
   totalCF: number = 0;
   totalEF: number = 0;
   totalWF: number = 0;
 
   // Calcola il peso totale in base agli ingredienti/ricette selezionati
   getFootprint(element: {
     CF: any;
     WF: any;
     EF: any;
     defaultWeight : number;
     }, naturalElement: any) {
     let footPrint;
     if (naturalElement == 'CF') {
       footPrint = element.CF * element.defaultWeight;
     } else if (naturalElement == 'WF') {
       footPrint = element.WF * element.defaultWeight;
     } else if (naturalElement == 'EF') {
       footPrint = element.EF * element.defaultWeight;
     }
    return footPrint;
   }
 
   setPopover() {
     this.foods.forEach(food => {
       food.popover = false;
     });
   }
 
   openPopover(i:any) {
     this.foods.forEach((element, index) => {
       if (index != i) {
         element.popover = false
       }
     });
     this.filteredAndVisibleFoods[i].popover = !this.filteredAndVisibleFoods[i].popover
   }

   getTotalWeight() {
    let totalWeight:number = 0;
    this.totalCF = 0;
    this.totalEF = 0;
    this.totalWF = 0;

    this.totalCF = this.getTotalFootprint(this.CF);
    this.totalEF = this.getTotalFootprint(this.EF);
    this.totalWF = this.getTotalFootprint(this.WF);

    totalWeight = this.totalCF + this.totalEF + this.totalWF;
    return totalWeight;

  }
  
  getTotalFootprint(naturalElement : string) {
    let totalFP: any = 0;
    this.done.forEach(element => {
      if (element instanceof Recipe) {
        element.ingredients.forEach((element) => {
          if (naturalElement == 'CF') {
            totalFP += this.getFootprint(element, this.CF);
          } else if (naturalElement == 'WF') {
            totalFP += this.getFootprint(element, this.WF);
          } else if (naturalElement == 'EF') {
            totalFP += this.getFootprint(element, this.EF);
          }
   
        });
      } else if (element instanceof Food) {
              
          if (naturalElement == 'CF') {
            totalFP += this.getFootprint(element, this.CF);
          } else if (naturalElement == 'WF') {
            totalFP += this.getFootprint(element, this.WF);
          } else if (naturalElement == 'EF') {
            totalFP += this.getFootprint(element, this.EF);
          }
        }
    })
    return totalFP;
  }

  getTotalKcal() {
    let totalKcal: number = 0;
    this.done.forEach(element => {
      if (element instanceof Recipe) {
        element.ingredients.forEach((food) => {
          totalKcal += (food.kcal / 100) * food.defaultWeight;
        });
      } else if (element instanceof Food) {
        totalKcal += (element.kcal / 100) * element.defaultWeight;
      }
    })
    return totalKcal;
  }

  getTotalValue(value: any) {
    let total: number = 0;
    this.done.forEach(element => {
      if (element instanceof Recipe) {
        element.ingredients.forEach((food) => {
          if (value == "proteins") {
            total += (food.proteins / 100) * food.defaultWeight;
          } else if (value == "carbohydrates") {
            total += (food.carbohydrates / 100) * food.defaultWeight;
          } else if (value == "fats") {
            total += (food.fats / 100) * food.defaultWeight;
          } else if (value == "sugars") {
            total += (food.sugars / 100) * food.defaultWeight;
          }
        });
      } else if (element instanceof Food) {
        if (value == "proteins") {
          total += (element.proteins / 100) * element.defaultWeight;
        } else if (value == "carbohydrates") {
          total += (element.carbohydrates / 100) * element.defaultWeight;
        } else if (value == "fats") {
          total += (element.fats / 100) * element.defaultWeight;
        } else if (value == "sugars") {
          total += (element.sugars / 100) * element.defaultWeight;
        }
      }
    })
    return total;
  }

  // Gestisce l'evento di trascinamento
  drop(event: any) {
    console.log('move')
    this.setPopover();
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.weight = this.getTotalWeight();
      this.setScale();
      this.setRecipeName();
      this.setHeight();
      this.emitData();
    }
    console.log(this.done);
  };

  emitData() {
    this.ingredients.emit(this.done);
  }

  // Variabile per la scala della rappresentazione umana
  translate: any = 'translateX(-50%)';
  scaleValue: any = 0;
  scaleString: any = `scale(${this.scaleValue})`;
  scale: any = `${this.translate} ${this.scaleString}`;
  scaleHeight: string = '0';

  // Imposta la scala in base al peso totale
  setScale() {
    console.log(this.scale)
    console.log(this.weight)
    if (this.weight > 0) {
      this.scaleValue = this.weight / 50;
      this.scaleString = `scale(${1 + this.scaleValue / 20})`;
    } else {
      this.scaleValue = 0;
      this.scaleString = 'scale(0)';
    }
    this.scale = `${this.translate} ${this.scaleString}`;
    return this.scale;
  }

  setRecipeName() {
    this.done.forEach(element => {
      if (element instanceof Recipe) {
        this.recipeNameResults = element.name;
      }
    });
  }

  setResultsRecipeImage() {
    this.recipeImageResults = [];
    this.done.forEach(element => {
      if (element instanceof Recipe) {
        this.recipeImageResults.push(element.image);
      } else if (element instanceof Food) {
        this.recipeImageResults.push(element.image);
      }
      console.log(this.recipeImageResults);
    });
  }

  setWeightAndScale() {
    this.weight = this.getTotalWeight();
    this.setScale();
  }

  height: any = 500;

  setHeight() {
    console.log(this.scaleValue);
    if (this.scaleValue < 10) {
      this.height = this.height - (this.scaleValue * 30);
      if (this.height < 350) {
        this.height = 350;
      }      
    } else if (this.scaleValue > 10 && this.scaleValue < 40) {
      this.height = this.height - (this.scaleValue * 9);
      if (this.height < 250) {
        this.height = 250;
      }          
    } else if (this.scaleValue > 40 && this.scaleValue < 90) {
      this.height = this.height - (this.scaleValue * 3.5);
      if (this.height < 200) {
        this.height = 200;
      }          
    } else {
      this.height = this.height - (this.scaleValue * 2);
      if (this.height <= 150) {
        this.height = 150;
      }
    }
    return this.height + 'px';
  }

  // verifica se nelle ricette c'è già una ricetta con lo stesso nome
  hasRecipeWithName(name: string) {
    return this.recipes.some(recipe => recipe.name === name);
  }

  // Rimuove un alimento dagli ingredienti/ricette selezionati
/*   removeFood(item: any, i: any) {

    let recipe: any;
    recipe = _.cloneDeep(item);

    if (item instanceof Food) {
      this.done.splice(i, 1);
      this.setWeightAndScale();
    } else if (item instanceof Recipe) {
      if (this.done[0].ingredients) {
        this.done[0].ingredients.splice(i, 1);
      } else if (this.done[1].ingredients) {
        this.done[1].ingredients.splice(i, 1);
      }
      this.setWeightAndScale();
    }
  } */

  // Funzione per capitalizzare la prima lettera di una stringa
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // FILTRI

  // Per categoria
  filterFoodsByCategory() {

    if (this.filterCategory != '') {

      this.filteredAndVisibleFoods = this.filteredFoods.filter((food: { category: string; }) => {

        return food.category === this.filterCategory;
      });

    } else if (this.filterCategory == '') {

      this.filteredAndVisibleFoods = this.filteredFoods;

    }

  }

  // Per nome
  filterFoodsByName() {

    if (this.filterName != '') {
      this.filteredAndVisibleFoods = this.filteredFoods.filter((food: { name: string; }) => {

        return food.name.toLowerCase().includes(this.filterName.toLowerCase());

      });
    } else if (this.filterName == '') {

      this.filteredAndVisibleFoods = this.filteredFoods;
    }

  }

  // Per valore EV
  filterFoodsByEvValue() {
    if (this.filterEvValue > 0) {
      this.filteredFoods = this.foods;
      this.filteredFoods = this.filteredFoods.filter((food: { kcal: number; }) => {
        return food.kcal >= this.filterEvValue;
      });
    } else if (this.filterEvValue == 0) {
      this.filteredFoods = this.foods;
    }

  }

  // Funzione di reset filtri
  resetFilters() {
    this.filterCategory = "";
    this.filterEvValue = 0;
    this.filterName = "";
    if (this.listSwitch) {
      this.filteredAndVisibleFoods = this.foods;
    } else if (!this.listSwitch) {
      this.filteredAndVisibleFoods = this.recipes;
    }
  }

  resetRecipe() {
    this.recipeImage = ''
    this.newRecipeName = ''
  }

  resetPlate() {
      this.done.forEach(element => {
        if (element instanceof Food && !this.foods.includes(element)) {
          this.foods.push(element);
        }
    });
    this.done =[]; 
    this.setWeightAndScale();
    this.recipeNameResults = 'La mia ricetta';
    this.recipeImageResults = [];
    this.height = 500;
  }

  softDeleteRecipe(name: any) {
    this.recipes.forEach((element, i) => {
      if (element.name == name) {
        this.recipes.splice(i, 1);
      }
    });
  }

  deleteRecipe(name: any) {
    this.recipes.forEach((element, i) => {
      if (element.name == name) {
        this.recipes.splice(i, 1);
        this.resetPlate();
      }
    });
    this.resetPlate();
    this.recipeNameResults = 'La mia ricetta';
    this.height = 500;
  }

  setNewRecipeImage(url:any) {
    console.log(url);
    this.recipeImage = `../../assets/`+url;
  }

  setRecipeImage() {
    if (this.recipeImage) {
      return this.recipeImage;
    } else {
      return '../../assets/plateholder.png';
    }
  }

  saveRecipe() {
    if (this.ingredientsList) {
      
    }
    let id: number = 1;
    let name: string = this.newRecipeName;
    let image: string = this.setRecipeImage();
    let list: number = 1;
    let category: string = 'Pasta';

    let ingredients: Food[] = [];
    
    this.done.forEach(element => {
      if (element instanceof Recipe) {
        element.ingredients.forEach(ingredient => {
          ingredients.push(ingredient);
        });
      } else if (element instanceof Food) {
        ingredients.push(element);
      }
    });

    let recipe = new Recipe(id, name, image, category, list, ingredients);
    this.recipes.push(recipe);

    this.setWeightAndScale();
    this.done = [];
    this.setWeightAndScale();
    this.recipeNameResults = this.newRecipeName;
    this.newRecipeName = '';
    this.recipeImage = '';
    this.height = 500;
  }

  // Funzione per chiamare tutti i filtri
  filterFoods() {
    console.log('ciao')
    if (this.filterName != '') {
      this.filterFoodsByName();
    }
    if (this.filterCategory != '') {
      this.filterFoodsByCategory();
    }
    console.log(this.filteredFoods);
  }

  filterIngredients() {
    console.log(this.foods)
    console.log(this.filterCategory)
    console.log(this.filterName);
    this.filteredAndVisibleFoods = this.foods.filter((ingredient) => {
      const matchesName = ingredient.name.toLowerCase().includes(this.filterName.toLowerCase());
      const matchesCategory = this.filterCategory == '0' || ingredient.id_category == this.filterCategory;
      console.log(matchesName)
      return matchesName && matchesCategory;
    });
  }

  getCategories() {
    this.backend.getCategories().subscribe((resp) => {
      console.log(resp);
      this.foodCategories = resp;
    })
  }

  // Salvataggio risultati in pdf
  
/*   public openPDF(): void {
    let DATA: any = document.getElementById('resultsPDF');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('nome-ricetta.pdf');
      this.recipeNameResults = 'La mia ricetta';
    });
  } */

  proteins: number = 0;
  carbohydrates: number = 0;
  fats: number = 0;
  sugars: number = 0;

  setResultsFoodValues() {
    this.proteins = 0;
    this.carbohydrates = 0;
    this.fats = 0;
    this.sugars = 0;

    this.done.forEach(element => {
      if (element instanceof Recipe) {
        element.ingredients.forEach((food) => {
          this.proteins += Math.round((food.proteins / 100) * food.defaultWeight);        
          this.carbohydrates += Math.round((food.carbohydrates / 100) * food.defaultWeight); 
          this.fats += Math.round((food.fats / 100) * food.defaultWeight);       
          this.sugars += Math.round((food.sugars / 100) * food.defaultWeight);
        });
      } else if (element instanceof Food) {
          this.proteins += Math.round((element.proteins / 100) * element.defaultWeight);       
          this.carbohydrates += Math.round((element.carbohydrates / 100) * element.defaultWeight);       
          this.fats += Math.round((element.fats / 100) * element.defaultWeight);       
          this.sugars += Math.round((element.sugars / 100) * element.defaultWeight);
      }
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

    // Rimuove un alimento dagli ingredienti/ricette selezionati
    removeFood(item: any, i: any) {
      
      this.done.splice(i, 1);
      
    }

    deleteIngredient(ingredientId: any, i: any) {
      this.done.splice(i, 1);
      this.backend.deleteRecipeIngredient(this.selectedRecipeId, ingredientId).subscribe((resp) => {
        console.log(resp);
        this.emitData();
      })
    }

}
