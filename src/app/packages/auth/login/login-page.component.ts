import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../common/config';
import { Router } from '@angular/router';
import { AppService } from '../../../app-service';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPage {
  config = inject(Config);
  http = inject(HttpClient);
  router = inject(Router);
  appService = inject(AppService);

  model = signal<LoginForm>({ email: 'allanjwalter@gmail.com', password: 'Password123' });
  form = form(this.model, (f) => {}, {
    submission: {
      action: () => this.submit(),
    },
  });

  async submit() {
    this.http
      .post(`${this.config.baseEndpoint}/auth/login`, {
        email: this.model().email,
        password: this.model().password,
      })
      .subscribe(() => {
        this.appService.updateLoginState();
        this.router.navigate(['/']);
      });
  }
}

type LoginForm = {
  email: string;
  password: string;
};
