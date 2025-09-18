import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../service/movies/movies.service';
import { ShowtimeService } from '../../service/showtime/showtime.service';
import { AuthService } from '../../service/auth/auth.service';
import { BookingService } from '../../service/booking/booking.service';

@Component({
  selector: 'app-movies-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movies-details.component.html',
  styleUrls: ['./movies-details.component.css']
})
export class MoviesDetailsComponent implements OnInit {

   seatLayout = [
    { row: 'A', seats: 8, offset: 2 },
    { row: 'B', seats: 10, offset: 1 },
    { row: 'C', seats: 12, offset: 0 },
    { row: 'D', seats: 12, offset: 0 },
    { row: 'E', seats: 12, offset: 0 },
    { row: 'F', seats: 12, offset: 0 },
    { row: 'G', seats: 10, offset: 1 },
    { row: 'H', seats: 8, offset: 2 }
  ];

  movieId!: string;
  movie: any; 
  showtimes: any[] = []; 
  selectedShowtime: any = null; 
  
  constructor(private moviesService: MoviesService, private route: ActivatedRoute, private showtimeService: ShowtimeService
    ,private authService: AuthService,private bookingService: BookingService
  ) {}

 

  selectedSeats: string[] = [];
  totalPrice: number = 0;
  showSeatSelection: boolean = false;

  
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.movieId = params['id']; 
      
      console.log('Extracted showtimeId:', this.movieId);
      if (this.movieId && this.movieId !== 'undefined') {
      } else {
        console.error('Invalid showtime ID:', this.movieId);
      }

    });
    this.moviesService.getMovieById(this.movieId).subscribe((movieData: any) => {
      this.movie = movieData;
      console.log('Fetched movie data:', this.movie);
    });
    this.showtimeService.getMovieShowtimes(this.movieId).subscribe((showtimeData: any) => {
      this.showtimes = showtimeData;
      console.log('Fetched showtime data:', this.showtimes);
    });

  }



  generateAllSeats(): string[] {
    const seats: string[] = [];
    this.seatLayout.forEach(rowData => {
      for (let i = 1; i <= rowData.seats; i++) {
        seats.push(`${rowData.row}${i}`);
      }
    });
    return seats;
  }
 

 
  selectShowtime(showtime: any): void {
    this.selectedShowtime = showtime;
    this.selectedSeats = [];
    this.totalPrice = 0;
    this.showSeatSelection = false; 
    console.log('Selected showtime:', showtime);
  }

  startSeatSelection(): void {
    this.showSeatSelection = true;
  }

  
  getSeatClass(row: string, seatNumber: number): string {
    const seatId = `${row}${seatNumber}`;
    const seat = this.selectedShowtime?.seats?.find((s: any) => s.seatNumber === seatId);
    
    if (seat?.isBooked || seat?.isLocked) {
      return 'btn btn-danger btn-sm seat-btn disabled';
    } else if (this.selectedSeats.includes(seatId)) {
      return 'btn btn-success btn-sm seat-btn selected';
    } else {
      return 'btn btn-outline-primary btn-sm seat-btn available';
    }
  }

  toggleSeat(row: string, seatNumber: number): void {
    const seatId = `${row}${seatNumber}`;
    const seat = this.selectedShowtime?.seats?.find((s: any) => s.seatNumber === seatId);
    
    if (seat?.isBooked || seat?.isLocked) {
      return;
    }

    const index = this.selectedSeats.indexOf(seatId);
    if (index > -1) {
     
      this.selectedSeats.splice(index, 1);
    } else {
     
      if (this.selectedSeats.length < 8) {
        this.selectedSeats.push(seatId);
      }
    }

    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    this.totalPrice = this.selectedSeats.length * (this.selectedShowtime?.price || 0);
  }

  clearSeatSelection(): void {
    this.selectedSeats = [];
    this.totalPrice = 0;
  }

  confirmBooking(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const bookingData = {
      userId: this.authService.getCurrentUserId(),
      showtimeId: this.selectedShowtime._id,
      movieId: this.movieId,
      seats: this.selectedSeats,
      status: 'confirmed',
      totalPrice: this.totalPrice , 
      createdAt: new Date().toISOString()
    };
    this.bookingService.confirmBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking confirmed:', response);
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
      }
    });

    console.log('Booking confirmed:', bookingData);
    
    
    this.selectedSeats.forEach(seatId => {
      const seat = this.selectedShowtime.seats.find((s: any) => s.seatNumber === seatId);
      if (seat) {
        seat.isBooked = true;
      }
    });
    
    alert(`Booking confirmed!\nSeats: ${this.selectedSeats.join(', ')}\nTotal: $${(this.totalPrice + 2.50).toFixed(2)}`);
    
    
    this.selectedSeats = [];
    this.totalPrice = 0;
    this.showSeatSelection = false;
  }

 

  getAvailableSeatsCount(): number {
    return this.selectedShowtime?.seats?.filter((seat: any) => !seat.isBooked && !seat.isLocked).length || 0;
  }

  getBookedSeatsCount(): number {
    return this.selectedShowtime?.seats?.filter((seat: any) => seat.isBooked).length || 0;
  }

  getSeatStatus(seat: string): 'available' | 'booked' | 'selected' | 'locked' {
    const seatData = this.selectedShowtime?.seats?.find((s: any) => s.seatNumber === seat);
    if (seatData?.isBooked) {
      return 'booked';
    } else if (seatData?.isLocked) {
      return 'locked';
    } else if (this.selectedSeats.includes(seat)) {
      return 'selected';
    } else {
      return 'available';
    }
  }

  
  getShowtimeAvailableSeats(showtime: any): number {
    return showtime.seats?.filter((seat: any) => !seat.isBooked && !seat.isLocked).length || 0;
  }

  getShowtimeBookedSeats(showtime: any): number {
    return showtime.seats?.filter((seat: any) => seat.isBooked).length || 0;
  }





 
  getSeatNumbers(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // Helper method for aisle position
  isAislePosition(seatNumber: number, totalSeats: number): boolean {
    return seatNumber === Math.floor(totalSeats / 2);
  }

  // Format duration from minutes to hours and minutes
  formatDuration(minutes: number): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  

  

  
}

