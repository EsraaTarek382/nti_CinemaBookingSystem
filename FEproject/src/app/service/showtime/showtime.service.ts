import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:3001/api/showtimes';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {

  constructor(private http:HttpClient) { }

  getMovieShowtimes(movieId: string) {
    return this.http.get<any[]>(`${API_URL}/${movieId}`);
  }
}
