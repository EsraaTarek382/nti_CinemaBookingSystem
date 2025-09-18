import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showError = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.hideError();
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.router.navigate(['/home']);
          this.isLoading = false;
        },
        error: (error:any) => {
          this.showErrorNotification( 'Login failed. Please try again.');
          this.isLoading = false;
        }
      });
    }   
  }

  showErrorNotification(message: string, type: 'error' | 'success' = 'error') {
    this.errorMessage = message;
    this.showError = true;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError() {
    this.showError = false;
    this.errorMessage = '';
  }
}

 
  

