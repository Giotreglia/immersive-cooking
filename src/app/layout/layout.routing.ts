import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "../home/home.component";
import { AuthGuardService } from "../services/auth-guard.service";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { NewRecipeComponent } from "../new-recipe/new-recipe.component";
import { IngredientsListComponent } from "../ingredients-list/ingredients-list.component";
import { NewIngredientComponent } from "../new-ingredient/new-ingredient.component";
import { EditIngredientComponent } from "../edit-ingredient/edit-ingredient.component";
import { ShowRecipeComponent } from "../show-recipe/show-recipe.component";
import { ExecutionsComponent } from "../executions/executions.component";
import { NewExecutionComponent } from "../new-execution/new-execution.component";
import { ShowExecutionComponent } from "../show-execution/show-execution.component";
import { ResultsComponent } from "../results/results.component";
import { RecipeDocumentsComponent } from "../recipe-documents/recipe-documents.component";

export const LayoutRoutes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      
      {
        path: 'home', component: DashboardComponent
      },
      {
        path: 'nuova-ricetta', component: NewRecipeComponent
      },
      {
        path: 'ingredienti', component: IngredientsListComponent
      },
      {
        path: 'nuovo-ingrediente', component: NewIngredientComponent
      },
      {
        path: 'modifica-ingrediente/:ingredientId', component: EditIngredientComponent
      },
      {
        path: 'ricetta/:recipeId', component: ShowRecipeComponent
      },
      {
        path: 'esecuzioni', component: ExecutionsComponent
      },
      {
        path: 'nuova-esecuzione', component: NewExecutionComponent
      },
      {
        path: 'esecuzione/:executionId', component: ShowExecutionComponent
      },
      {
        path: 'report/:executionId', component: ResultsComponent
      },
      {
        path: 'recipe-documents/:recipeId', component: RecipeDocumentsComponent
      }
    ]
  }
];
