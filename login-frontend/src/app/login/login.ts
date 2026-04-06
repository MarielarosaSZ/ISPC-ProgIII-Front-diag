import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginError: string | null = null; 

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required, Validators.minLength(8)],
  });

  onSubmit() {
    this.loginError = null; 
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.http.post('http://localhost:8000/api/login/', { username, password }).subscribe({
        next: (response: any) => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('user_data', JSON.stringify(response.user));
          this.router.navigate(['/home']);

        },
        error: (error) => {
          console.error('Login failed', error);
          if (error.status === 401) { // 401: Unauthorized (credenciales inválidas)
                  this.loginError = 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.';
               } else {
                  this.loginError = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.';
               }

          // Handle error
        }
      });
    }
  }
}
