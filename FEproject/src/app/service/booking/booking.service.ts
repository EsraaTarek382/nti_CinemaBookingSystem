import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'http://localhost:3001/api/bookings';
@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  confirmBooking(bookingData: any) {
   const token = localStorage.getItem('token');
   return this.http.post(API_URL, bookingData, {
     headers: new HttpHeaders({
       Authorization: `Bearer ${token}`
     })
   });
  }

 
  getAllBookings() {
    const token = localStorage.getItem('token');
    return this.http.get(`${API_URL}/history`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  
  getBookingById(bookingId: string) {
    const token = localStorage.getItem('token');
    return this.http.get(`${API_URL}/${bookingId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }


  cancelBooking(bookingId: string) {
    const token = localStorage.getItem('token');
    return this.http.delete(`${API_URL}/${bookingId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

}

