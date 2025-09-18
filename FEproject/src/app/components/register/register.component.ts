import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showError = false;
  registerbody:any;

 

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
       this.registerbody={
    firstName: this.registerForm.value.firstName,
    lastName: this.registerForm.value.lastName,
    email: this.registerForm.value.email,
    password: this.registerForm.value.password,
    role: 'user'
  }
      this.authService.register(this.registerbody).subscribe({
        next: () => {
          this.isLoading = false; 
          this.router.navigate(['/home']);
        },
        error: (err: { error: { message: any; }; }) => {
          this.isLoading = false;
          this.showErrorNotification( 'Registration failed. Please try again.');
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
