import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from '../header/header.component';
import { HomeComponent } from '../home/home.component';
import { LayoutRoutes } from './layout.routing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewRecipeComponent } from '../new-recipe/new-recipe.component';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IngredientsComponent } from '../ingredients/ingredients.component';
import { IngredientsListComponent } from '../ingredients-list/ingredients-list.component';
import { NewIngredientComponent } from '../new-ingredient/new-ingredient.component';
import { EditIngredientComponent } from '../edit-ingredient/edit-ingredient.component';
import { ShowRecipeComponent } from '../show-recipe/show-recipe.component';
import { ExecutionsComponent } from '../executions/executions.component';
import { NewExecutionComponent } from '../new-execution/new-execution.component';
import { ShowExecutionComponent } from '../show-execution/show-execution.component';
import { ResultsComponent } from '../results/results.component';
import { RecipeDocumentsComponent } from '../recipe-documents/recipe-documents.component';




import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    NewRecipeComponent,
    AsideMenuComponent,
    IngredientsComponent,
    IngredientsListComponent,
    NewIngredientComponent,
    EditIngredientComponent,
    ShowRecipeComponent,
    ExecutionsComponent,
    NewExecutionComponent,
    ShowExecutionComponent,
    ResultsComponent,
    RecipeDocumentsComponent
  ],
  imports: [
    RouterModule.forChild(LayoutRoutes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    DragDropModule,
    MatTabsModule
  ],
  providers: [Location],
})
export class LayoutModule { }
