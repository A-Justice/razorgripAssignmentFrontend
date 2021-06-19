import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { count } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from 'src/services/notification.service';
import { settings } from 'src/data/helpers/settings';
import { LoaderService } from 'src/services/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  settings = settings;
  error: string;
  registerForm: FormGroup;
  isUserNameUnique: any = false;
  constructor(private authService: AuthService,
    private loaderService:LoaderService,
     private router: Router,private notificationService:NotificationService) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl("", [Validators.required,Validators.email]),
      password: new FormControl("", [Validators.required])
    })
  }

  register(registerObject: { userName, password }) {
    this.loaderService.setHttpProgressStatus(true);
    this.authService.register(registerObject)
      .subscribe(response => {
        this.loaderService.setHttpProgressStatus(false);
        this.login({usernameOrEmail:registerObject.userName,password:registerObject.password,rememberMe:false});
      }, error => {
        this.loaderService.setHttpProgressStatus(false);
        console.log(Error,error);
        if(error.error){
          if(error.error[0]){
            this.error = error.error[0]?.description;
          }
          return
        }
        this.error = error;
      })
  }

  login(obj: { usernameOrEmail: string, password: string, rememberMe }) {
    this.loaderService.setHttpProgressStatus(true);
    this.authService.login(obj)
      .subscribe(response => {
        this.loaderService.setHttpProgressStatus(false);
        if(response.token){
          this.router.navigate(['']);
          alert("Registration Successful");
        }
      }, error => {
        this.loaderService.setHttpProgressStatus(false);
        this.router.navigate(['']);
      });
  }


  submitRegisterForm() {
    if (!this.registerForm.valid) {
      this.error = "Form contains invalid fields";
      return;
    }
    this.register(this.registerForm.value);
  }

  userNameChanged(evt) {
    var userName = this.registerForm.get('userName').value;
    if (userName.length >= 4) {
      this.isUserNameUnique = undefined;
      this.authService.isUserNameUnique(userName)
        .subscribe(response => {
          this.isUserNameUnique = response;
        }, error => {
          this.isUserNameUnique = false;
        });
    }
    else {
      this.isUserNameUnique = false;
    }
  }

}
