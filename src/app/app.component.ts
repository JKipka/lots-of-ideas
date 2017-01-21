import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import firebase from 'firebase';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Utils } from './utils';
import { Auth } from '../providers/auth';
import { StartupPage } from '../pages/startup/startup';


firebase.initializeApp({
      apiKey: "AIzaSyCMpbj2jf-2eHs0A01hsbPKoif4HjWcyZs",
      authDomain: "movieideas-c8ebd.firebaseapp.com",
      databaseURL: "https://movieideas-c8ebd.firebaseio.com",
      storageBucket: "movieideas-c8ebd.appspot.com",
      messagingSenderId: "1030635120633"
    });

@Component({
  templateUrl: 'app.html',
  providers: [Utils, Auth]
})
export class MyApp { 
  rootPage: any = HomePage;
  zone: NgZone;

  constructor(platform: Platform, public auth: Auth) {

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
}
