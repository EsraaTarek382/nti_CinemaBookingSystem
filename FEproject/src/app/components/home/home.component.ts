import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../../service/movies/movies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchQuery: string = '';

  movies: any[] = [];
   movieUrl!: string;

  constructor(private moviesService: MoviesService) {
  }

  ngOnInit(): void {
    this.moviesService.getMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      console.log('Loaded movies:', this.movies);
      
      
      if (this.movies.length > 0) {
        console.log('First movie structure:', this.movies[0]);
        console.log('Movie ID field:', this.movies[0]._id || this.movies[0].id);
      }
     
      this.movies.forEach(movie => {
        if (movie.posterUrl) {
          movie.posterUrl = this.moviesService.getMovieImage(movie.posterUrl);
        }
      });
    });
  }

//   movies = [
//     {
//       id: 1,
//       title: 'The Grinch',
//       posterUrl: 'https://via.placeholder.com/300x400/4CAF50/ffffff?text=The+Grinch',
//       genres: ['Animation', 'Comedy', 'Family'],
//       rating: '7.2',
//       duration: '85 min'
//     },
//     {
//       id: 2,
//       title: 'Home Alone 2',
//       posterUrl: 'https://via.placeholder.com/300x400/F44336/ffffff?text=Home+Alone+2',
//       genres: ['Comedy', 'Family'],
//       rating: '6.8',
//       duration: '120 min'
//     },
//     {
//       id: 3,
//       title: 'Deck the Halls',
//       posterUrl: 'https://via.placeholder.com/300x400/2196F3/ffffff?text=Deck+the+Halls',
//       genres: ['Comedy', 'Family'],
//       rating: '5.0',
//       duration: '93 min'
//     },
//     {
//       id: 4,
//       title: 'Last Christmas',
//       posterUrl: 'https://via.placeholder.com/300x400/FF9800/ffffff?text=Last+Christmas',
//       genres: ['Comedy', 'Romance'],
//       rating: '6.5',
//       duration: '103 min'
//     },
//     {
//       id: 5,
//       title: 'Holidate',
//       posterUrl: 'https://via.placeholder.com/300x400/9C27B0/ffffff?text=Holidate',
//       genres: ['Comedy', 'Romance'],
//       rating: '6.1',
//       duration: '104 min'
//     },
//     {
//       id: 6,
//       title: 'Elf',
//       posterUrl: 'https://via.placeholder.com/300x400/4CAF50/ffffff?text=Elf',
//       genres: ['Comedy', 'Family', 'Fantasy'],
//       rating: '7.0',
//       duration: '97 min'
//     }
//   ];

  featuredMovie = {
    id: 1,
    title: 'The Grinch',
    subtitle: '3D',
    description: 'A grumpy Grinch plots to ruin Christmas for the village of Whoville.',
    posterUrl: 'https://via.placeholder.com/600x300/4CAF50/ffffff?text=The+Grinch+3D',
    trailerAvailable: true
  };

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    // Placeholder for search functionality
  }

  viewMovieDetails(movieId: number): void {
    console.log('Viewing details for movie:', movieId);
    // Navigation logic would go here - for now it will use routerLink in template
  }

  watchTrailer(): void {
    console.log('Playing trailer for:', this.featuredMovie.title);
    // Trailer functionality would go here
  }
}