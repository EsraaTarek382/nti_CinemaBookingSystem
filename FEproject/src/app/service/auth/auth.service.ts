import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';

interface JWTPayload {
  id: string; 
  exp: number;
  iat: number;
}
const API_URL = 'http://localhost:3001/api/users/login';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login({email, password}: {email: string; password: string}): any {
    return this.http.post<{token: string}>(API_URL, {email, password})
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
      }));
  }

  register({firstName, lastName, email, password, role}: {firstName: string; lastName: string; email: string; password: string; role: string}): any {
    return this.http.post<{token: string}>(API_URL.replace('login', 'register'), {firstName, lastName, email, password})
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
  }


  getCurrentUserId(): string | null {
    const token = localStorage.getItem('token'); 
    if (!token) return null;

    try {
      const decoded = jwtDecode<JWTPayload>(token); 
      return decoded.id; 
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }
}