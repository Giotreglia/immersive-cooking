import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  API_URL = 'https://dev.xredulab.com/xrplatform/web/index.php?r=smartcooking';
  LOGIN_URL = 'https://dev.xredulab.com/xrplatform/web/index.php?r=user/login';
  MAIN_API_BASE_URL = this.API_URL + 'main/';
  sessione_max_time = 7200; // 2 hours - in seconds
  sessione_interval = 60;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router, private token: TokenService) { }

  login(data: any) {
    return this.http.post(this.LOGIN_URL, data);
  }

  logout() {
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('login');
  }

  addIngredient(data: any) {
    return this.http.post<any>(`${this.API_URL}/addingredient`, data, {withCredentials: true})
  }

  saveIngredient(data: any, ingredientId: any) {
    return this.http.post<any>(`${this.API_URL}/saveingredient&ingredientId=${ingredientId}`, data, {withCredentials: true})
  }

  deleteIngredient(ingredientId: any) {
    return this.http.delete<any>(`${this.API_URL}/deleteingredient&ingredientId=${ingredientId}`, {withCredentials: true})
  }

  saveRecipe(data: any) {
    return this.http.post<any>(`${this.API_URL}/addrecipe`, data, {observe: 'response', withCredentials: true})
  }

  editRecipe(data: any, recipeId: any) {
    return this.http.post<any>(`${this.API_URL}/saverecipe&recipeId=${recipeId}`, data, {observe: 'response', withCredentials: true})
  }

  deleteRecipe(recipeId: any) {
    return this.http.delete<any>(`${this.API_URL}/deleterecipe&recipeId=${recipeId}`, {withCredentials: true})
  }

  getIngredients() {
    return this.http.get<any>(`${this.API_URL}/getingredients`, {withCredentials: true})
  }

  getRecipeIngredients(recipeId: any) {
    return this.http.get<any>(`${this.API_URL}/getrecipeingredients&recipeId=${recipeId}`, {withCredentials: true})
  }

  getRecipes() {
    return this.http.get<any>(`${this.API_URL}/getrecipes`, {withCredentials: true})
  }

  getRecipe(data: any) {
    return this.http.post<any>(`${this.API_URL}/getrecipe`, data, {withCredentials: true})
  }

  getCategories() {
    return this.http.get<any>(`${this.API_URL}/getcategories`, {withCredentials: true})
  }

  addRecipeIngredient(data: any) {
    return this.http.post<any>(`${this.API_URL}/addrecipeingredient`, data, {withCredentials: true})
  }

  editRecipeIngredient(data: any) {
    return this.http.post<any>(`${this.API_URL}/saverecipeingredient`, data, {withCredentials: true})
  }

  deleteRecipeIngredient(recipeId: any, ingredientId: any) {
    return this.http.delete<any>(`${this.API_URL}/deleterecipeingredient&recipeId=${recipeId}&ingredientId=${ingredientId}`)
  }

  getExecutions() {
    return this.http.post<any>(`${this.API_URL}/getexecutions`, {withCredentials: true})
  }

  addExecution(data: any) {
    return this.http.post<any>(`${this.API_URL}/addexecution`, data, {withCredentials: true})
  }

  deleteExecution(executionId: any) {
    return this.http.delete<any>(`${this.API_URL}/deleteexecution&executionId=${executionId}`, {withCredentials: true})
  }

  getpresigneduploadurl(filepath: any, type: any, toresize?: any){
    let url = this.API_URL + "/smartgetpresigneduploadurl&filepath="+filepath+"&contentType="+type;
    if (toresize){
      url += '&temp=true';
    }
    return this.http.get(url, { observe: 'response' });//, withCredentials: true
  }

  s3Upload(requestUrl: any, file: any, type: any){
    return this.http.put<any>(requestUrl, file, {headers:{'Content-type': type }, observe: 'response'}); //, withCredentials: true
  }

}
