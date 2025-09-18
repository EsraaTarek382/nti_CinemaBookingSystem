import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  user = {
    name: 'Niklan Tegar',
    balance: 56.00
  };

  menuItems = [
    { label: 'Home', route: '/home', icon: '🏠' },
    { label: 'Bookings', route: '/bookings', icon: '🎟️' },
    { label: 'Logout', route: '', icon: '🚪' }
  ];
}