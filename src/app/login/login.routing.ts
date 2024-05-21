import { Routes } from "@angular/router";
import { LoginLayoutComponent } from "./login-layout/login-layout.component";

export const LoginRoutes: Routes = [
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      /*
      {
        path: '', component: HomeComponent
      }
      */
    ]
  }
];
