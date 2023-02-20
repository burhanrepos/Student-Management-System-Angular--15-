import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public email : string = '';
  public password : string = '';

  constructor(private authService: AuthService){}

  public login(): boolean | any {
    if(this.email == '')
    {
      alert('Please enter email');
      return;
    }
    if(this.password == '')
    {
      alert('Please enter password');
      return;
    }

    try {
      this.authService.login(this.email , this.password);
      this.email='';
      this.password='';
    } catch (error) {

    }
  }

  public signInWithGoogle(){
    try {
      this.authService.signInWithGoogle();
    } catch (error) {

    }
  }
}
