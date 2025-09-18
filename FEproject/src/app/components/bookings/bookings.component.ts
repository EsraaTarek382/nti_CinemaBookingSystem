import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../service/booking/booking.service';
import { MoviesService } from '../../service/movies/movies.service';
import { ShowtimeService } from '../../service/showtime/showtime.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit {

  bookings: any[] = [];
  movies: Map<string, any> = new Map(); 
  showtimes: Map<string, any> = new Map(); 
  loading = true;

  constructor(private bookingService: BookingService, private movieService: MoviesService,
    private showtimeService: ShowtimeService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data: any) => {
        this.bookings = data.bookings || data || [];
        this.loadMoviesAndShowtimesForBookings();
        console.log('Loaded bookings:', this.bookings);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading = false;
        // Set empty array if API fails
        this.bookings = [];
      }
    });
  }

  loadMoviesAndShowtimesForBookings(): void {
    if (this.bookings.length === 0) {
      this.loading = false;
      return;
    }

  
    const uniqueMovieIds = [...new Set(this.bookings.map(booking => booking.movieId))];
    const uniqueShowtimeIds = [...new Set(this.bookings.map(booking => booking.showtimeId).filter(id => id))];
    
    let loadedMovies = 0;
    let loadedShowtimes = 0;
    const totalMovies = uniqueMovieIds.length;
    const totalShowtimes = uniqueShowtimeIds.length;


    uniqueMovieIds.forEach(movieId => {
      this.movieService.getMovieById(movieId).subscribe({
        next: (movie) => {
          this.movies.set(movieId, movie);
          loadedMovies++;
          console.log(`Loaded movie ${movieId}:`, movie);
          
         
          if (loadedMovies === totalMovies && loadedShowtimes === totalShowtimes) {
            this.loading = false;
          }
        },
        error: (error) => {
          console.error(`Error loading movie ${movieId}:`, error);
          loadedMovies++;
          
         
          if (loadedMovies === totalMovies && loadedShowtimes === totalShowtimes) {
            this.loading = false;
          }
        }
      });
    });

   
    if (totalShowtimes > 0) {
      uniqueShowtimeIds.forEach(showtimeId => {
        // Find the booking with this showtimeId to get the corresponding movieId
        const booking = this.bookings.find(b => b.showtimeId === showtimeId);
        const movieId = booking ? booking.movieId : null;
        if (!movieId) {
          console.error(`No movieId found for showtimeId ${showtimeId}`);
          loadedShowtimes++;
          if (loadedMovies === totalMovies && loadedShowtimes === totalShowtimes) {
            this.loading = false;
          }
          return;
        }
        this.showtimeService.getMovieShowtimes(movieId).subscribe({
          next: (showtimes) => {
          
            const showtime = Array.isArray(showtimes)
  ? showtimes.find((s: any) => s._id === showtimeId)
  : showtimes;
            this.showtimes.set(showtimeId, showtime);
            loadedShowtimes++;
            console.log(`Loaded showtime ${showtimeId}:`, showtime);
            
        
            if (loadedMovies === totalMovies && loadedShowtimes === totalShowtimes) {
              this.loading = false;
            }
          },
          error: (error) => {
            console.error(`Error loading showtime ${showtimeId}:`, error);
            loadedShowtimes++;
            
        
            if (loadedMovies === totalMovies && loadedShowtimes === totalShowtimes) {
              this.loading = false;
            }
          }
        });
      });
    } else {
      loadedShowtimes = totalShowtimes; 
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadge(booking: any): string {
    const currentDate = new Date();
    const showtimeDate = new Date(booking.showtime);

    if (booking.status === 'cancelled') return 'danger';
    if (showtimeDate < currentDate) return 'secondary';
    if (booking.status === 'confirmed') return 'success';
    return 'primary';
  }

  getStatusText(booking: any): string {
    const currentDate = new Date();
    const showtimeDate = new Date(booking.showtime);

    if (booking.status === 'cancelled') return 'Cancelled';
    if (showtimeDate < currentDate) return 'Completed';
    if (booking.status === 'confirmed') return 'Confirmed';
    return 'Pending';
  }

  canCancelBooking(booking: any): boolean {
    const currentDate = new Date();
    const showtimeDate = new Date(booking.showtime);
    const hoursDiff = (showtimeDate.getTime() - currentDate.getTime()) / (1000 * 3600);
    
    return booking.status === 'confirmed' && hoursDiff > 2; // Can cancel up to 2 hours before showtime
  }

  getMovieForBooking(booking: any): any {
    return this.movies.get(booking.movieId) || {
      title: 'Loading...',
      genre: 'Unknown',
      rating: 0,
      posterUrl: '/assets/placeholder-movie.jpg'
    };
  }

  getShowtimeForBooking(booking: any): any {
    // If we have a showtimeId, try to get detailed showtime info
    if (booking.showtimeId) {
      const showtime = this.showtimes.get(booking.showtimeId);
      if (showtime) {
        return showtime;
      }
    }
    
   
    return {
      startTime: booking.showtime,
      date: booking.showtime,
      theater: 'Main Theater',
      screen: 'Screen 1'
    };
  }

  getShowDate(booking: any): string {
    const showtime = this.getShowtimeForBooking(booking);
   
    const date = showtime && (showtime.startTime || showtime.date || booking.showtime);
    if (!date || isNaN(Date.parse(date))) {
      return 'N/A';
    }
    return this.formatDate(date);
  }

  getShowTime(booking: any): string {
    const showtime = this.getShowtimeForBooking(booking);
 
    const time = showtime && (showtime.startTime || showtime.date || booking.showtime);
    if (!time || isNaN(Date.parse(time))) {
      return 'N/A';
    }
    return this.formatTime(time);
  }

  cancelBooking(booking: any): void {
    const movie = this.getMovieForBooking(booking);
    if (confirm(`Are you sure you want to cancel your booking for "${movie.title}"?`)) {
      this.bookingService.cancelBooking(booking._id).subscribe({
        next: () => {
          booking.status = 'cancelled';
          // No need to apply filters, just update the booking status
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          alert('Failed to cancel booking. Please try again.');
        }
      });
    }
  }

 

}
