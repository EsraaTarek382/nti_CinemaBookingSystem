import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:3001/api/movies';
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http:HttpClient) { }

  getMovies() {
    return this.http.get<any[]>(API_URL);
  } 

  getMovieImage(image: string): string {
  return image.startsWith('http')
    ? image
    : `${API_URL}/uploads/${image}`;
}
getMovieById(movieId: string) {
  return this.http.get<any>(`${API_URL}/${movieId}`);
}
}
