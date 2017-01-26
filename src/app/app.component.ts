import { Component, NgZone, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import firebase from 'firebase';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Utils } from './utils';
import { Auth } from '../providers/auth';
import { StartupPage } from '../pages/startup/startup';
import {SavedIdeasPage} from '../pages/saved-ideas/saved-ideas';
import {FriendsPage} from '../pages/friends/friends';
import {FindIdeasPage} from '../pages/find-ideas/find-ideas';
import {firebaseConfig} from './firebaseData';


firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [Utils, Auth]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  zone: NgZone;
  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(platform: Platform, public auth: Auth, public utils: Utils) {
    /*
        TODO: Idee public oder private,
              public Ideen können von anderen Benutzern gesucht und bewertet werden,
              Kreativitätsscore für jeden Benutzer
              Benutzersuche möglich und Profileinsicht der User,
              Freunde hinzufügen
    
    */
    this.pages = [
      { title: 'Eigene Ideen', component: HomePage, icon: "home" },
      { title: 'Gespeicherte Ideen', component: SavedIdeasPage, icon: "bookmark" },
      { title: 'Ideen finden', component: FindIdeasPage, icon: "search" },
      { title: 'Meine Freunde', component: FriendsPage, icon: "contacts" }
    ]
    /* this.zone = new NgZone({});
     const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
       this.zone.run(() => {
         auth.user = user;
         if(user!=undefined){
           auth.setUserData();
         }
         //console.log(user);
         if (!user) {
           this.rootPage = LoginPage;
           unsubscribe();
         } else {
           this.rootPage = HomePage;
           unsubscribe();
         }
       });
     });*/

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.auth.logoutUser();
    this.nav.setRoot(LoginPage);
  }
}
