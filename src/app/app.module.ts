import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { StartupPage } from '../pages/startup/startup';
import { ProfilePage } from '../pages/profile/profile';
import { AddIdeaPage } from '../pages/add-idea/add-idea';
import {RlTagInputModule} from 'angular2-tag-input';
import {ViewIdeaPage } from '../pages/view-idea/view-idea';
import { ShowIdeaPage } from '../pages/show-idea/show-idea';
import {SavedIdeasPage} from '../pages/saved-ideas/saved-ideas';
import {FriendsPage} from '../pages/friends/friends';
import {FindIdeasPage} from '../pages/find-ideas/find-ideas';
import {ViewPublicIdeasPage} from '../pages/view-public-ideas/view-public-ideas';
import {ChooseUsernamePage} from '../pages/choose-username/choose-username';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SignupPage,
    StartupPage,
    ProfilePage,
    AddIdeaPage,
    ViewIdeaPage,
    ShowIdeaPage,
    SavedIdeasPage,
    FriendsPage,
    FindIdeasPage,
    ViewPublicIdeasPage,
    ChooseUsernamePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    RlTagInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SignupPage,
    StartupPage,
    ProfilePage,
    AddIdeaPage,
    ViewIdeaPage,
    ShowIdeaPage,
    SavedIdeasPage,
    FriendsPage,
    FindIdeasPage,
    ViewPublicIdeasPage,
    ChooseUsernamePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
