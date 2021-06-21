import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/services/notification.service';
import { LoaderService } from 'src/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error;
  constructor(private router:Router,
    private authService: AuthService,private notificationService:NotificationService,private loaderService:LoaderService) {

    this.loginForm = new FormGroup({
      'userNameOrEmail': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
      'rememberMe': new FormControl(false)
    })

  }


  login() {
    this.loaderService.setHttpProgressStatus(true);
    this.authService.login(this.loginForm.value)
      .subscribe(response => {
        this.loaderService.setHttpProgressStatus(false);

        if(this.authService.decodedToken){
          this.router.navigate(['']);
          this.notificationService.showNotification("Login Successful!")
        }
      }, error => {
        this.loaderService.setHttpProgressStatus(false);

        console.log("Error",error);
        debugger;
        if(error.error){
          if(typeof error.error[0] != "string"){
            this.error = error.error[0]?.description;
            return;
          }
          this.error = error.error;
          return;
        }
        this.error = error;
      });
  }

  submitLoginForm(){
    if(!this.loginForm.valid){
      this.error = "Form contains invalid fields";
      return;
    }
    this.login();
  }

  ngOnInit() {
  }

  //return opacity of 1 if that property of the form group element is null
  //else return opacity of 0
  showIfEmpty(form: FormGroup, property: string) {
    return this.validateOnEmpty(form, property);
  }

  public validateOnEmpty(form:FormGroup,property:string):{}{
      try {
        let value:string;
 
     if(!form.get(property).valid && form.get(property).touched)
         value = "block"
     else
         value = "none";
         
     return {'display':value};
     } catch (error) {
     }
  }

}
