import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessagingComponent } from './messaging/messaging.component';
import { ChatTextBoxComponent } from './chat-text-box/chat-text-box.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MessagingService } from 'src/services/messaging.service';
import { AuthService } from 'src/services/auth.service';
import { NotificationService } from 'src/services/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/guards/auth.guard';
import { NotificationComponent } from './notification/notification.component';
import { JwtInterceptorProvider } from 'src/interceptors/jwt.interceptor';
import { MessageItemComponent } from './message-item/message-item.component';
import { IsblockedPipe } from 'src/pipes/isblocked.pipe';
import { HasBeenBlockedPipe } from 'src/pipes/hasBeenblocked.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MessagingComponent,
    ChatTextBoxComponent,
    MessagingComponent,
    RegisterComponent,
    LoginComponent,
    NotificationComponent,
    MessageItemComponent,
    IsblockedPipe,
    HasBeenBlockedPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    MessagingService,
    AuthService,
    NotificationService,
    AuthGuard,
    JwtInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
