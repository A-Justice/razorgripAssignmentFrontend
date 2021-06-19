import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { DecodedToken } from 'src/data/dtos/decodedtoken';
import { settings } from 'src/data/helpers/settings';
import { NotificationService } from './notification.service';
import { UserForReturn } from 'src/data/DTOs/user';

@Injectable()
export class AuthService {
    decodedToken:DecodedToken;
    helper = new JwtHelperService();
    currentUser:UserForReturn;
    constructor(private httpClient: HttpClient,private notificationService:NotificationService) {
        let token = this.getToken();
        if (token)
            this.decodedToken = this.helper.decodeToken(token);
    }

    login(obj:{usernameOrEmail, password,rememberMe}) {
        return this.httpClient.post(`${settings.baseUri}/api/auth/login`, obj)
            .pipe(
                map((response: any) => {
                    // debugger;
                    if (response.token) {
                        let token = response.token;
                        this.decodedToken = this.helper.decodeToken(token);
                        localStorage.setItem('token', token);
                    }
                    this.currentUser = response?.user;
                    return response;
                })
            );
    }

    register(obj:{userName, password}) {
        return this.httpClient.post(`${settings.baseUri}/api/auth/register`, obj);
    }

    logout(){
        localStorage.removeItem('token');
        this.decodedToken = undefined;
        this.notificationService.showNotification("You logged out");
    }

    isUserNameUnique(username){
        return this.httpClient.get(`${settings.baseUri}/api/auth/isusernameunique/${username}`);
    }

    getToken():string{
        return localStorage.getItem('token');
    }

    ping(){
        return this.httpClient.get(`${settings.baseUri}/api/users/ping`)
    }
}