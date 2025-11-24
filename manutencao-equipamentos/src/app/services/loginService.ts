// src/app/services/loginService.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, UsuarioLogado, JwtPayload } from '../models/authModel'; 
import { jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly STORAGE_KEY = 'auth_data';
  usuarioLogado = signal<UsuarioLogado | null>(this.getStoredUser());

  private readonly API_URL = 'http://localhost:8080/Auth'; 

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  logar(credenciais: { email: string; senha: string }): Observable<AuthResponse> {
    const url = `${this.API_URL}/login`;
    return this.http.post<AuthResponse>(url, credenciais).pipe(
      tap(response => {
        const usuario = this.processAuthResponse(response);
        if (usuario) {
          this.usuarioLogado.set(usuario);
          this.redirecionarAposLogin(usuario.role);
        }
      })
    );
  }

    
  private processAuthResponse(response: AuthResponse): UsuarioLogado | null {
    
    let payload: JwtPayload | null;
      try {
          payload = jwtDecode(response.accessToken) as JwtPayload; 
      } catch (e) {
          console.error('Falha na decodificação do Token:', e);
          return null;
      }
      
      if (!payload || !payload.scope || !payload.sub) {
          console.error('Token JWT decodificado é inválido ou incompleto.');
          return null;
      }
      
      const usuario: UsuarioLogado = {
          id: parseInt(payload.sub, 10), 
          role: payload.scope,          
          token: response.accessToken
      };

      console.log('Usuário Logado Criado:', usuario); 
      this.storeAuthData(usuario); 
      return usuario;
  }
  
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usuarioLogado.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getStoredToken();
  }

  getStoredToken(): string | null {
    const authData = localStorage.getItem(this.STORAGE_KEY);
    return authData ? JSON.parse(authData).token : null; 
  }
  
  private getStoredUser(): UsuarioLogado | null {
      const authData = localStorage.getItem(this.STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
  }

  private storeAuthData(usuario: UsuarioLogado): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  getFuncionarioId(): number | null {
    const user = this.getStoredUser();
    return user ? user.id : null;
  }
  
  private redirecionarAposLogin(role: string): void {
    if (role === 'FUNCIONARIO' || role === 'ADMIN') {
      this.router.navigate(['/painel']); 
    } else {
      this.router.navigate(['/dashboard']); 
    }
  }
}