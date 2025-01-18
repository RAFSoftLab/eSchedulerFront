import { Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UsersService} from '../../services/users/users.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isApproved: boolean = false;
  user: any;

  constructor(private fb: FormBuilder,private router: Router,private userService: UsersService) {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      rememberPassword: [false]
    });
  }


  onSubmit() {
    const loginData = this.loginForm.value;

    this.userService.getUser(loginData.email,loginData.password).subscribe((response) => {
      if(response.success && this.loginForm.valid){
        this.user = response.data;
        if(this.user.isAdmin){
          this.router.navigate(['']);
        }else{
          this.router.navigate(['standardUser'],{
            state: {user: this.user}
          });
        }
      }else if(!response.success){
        this.user = null;
        alert(response.message);
      }else{
        alert('Invalid form!');
      }
    });
  }

}
