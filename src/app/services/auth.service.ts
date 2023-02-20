import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {GoogleAuthProvider,GithubAuthProvider,FacebookAuthProvider} from '@angular/fire/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth : AngularFireAuth, private router: Router) { }

  public login(email: string, password: string){
    this.fireAuth.signInWithEmailAndPassword(email,password).then((res)=>{
      localStorage.setItem('token','true')
      this.router.navigate(['dashboard']);

      if(res?.user?.emailVerified==true){
        this.router.navigate(['dashboard']);
      }else{
        this.router.navigate(['/verify-email'])
      }
    },err=>{
      alert('Something went wrong');
      this.router.navigate(['/login']);
    })
  }


  public register(email: string, password: string){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then((res)=>{
      alert('Registration Successfull');
      this.router.navigate(['/login']);
      this.sendEmailForVarification(res.user);
    },err=>{
      alert('Something went wrong');
      this.router.navigate(['/register']);
    })
  }
  public sendEmailForVarification(user: import("firebase/compat").default.User | null) {
    user?.sendEmailVerification().then((res : any)=>{
      this.router.navigate(['/verify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  public logout(){
    this.fireAuth.signOut().then(()=>{
      localStorage.removeItem('token')
      this.router.navigate(['/login']);
    },err=>{
      alert(err.message);
    })
  }

  public forgotPassword(email: string){
    this.fireAuth.sendPasswordResetEmail(email).then(()=>{
      this.router.navigate(['/verify-email']);
    },err=>{
      alert('Something went wrong');
    })
  }

  public signInWithGoogle(): any {
    return this.fireAuth.signInWithPopup(new GoogleAuthProvider).then(res => {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));
    }, err => {
      alert(err.message)
    })
  }

}
