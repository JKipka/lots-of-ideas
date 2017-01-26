import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../providers/auth';
import {HomePage} from '../home/home';
import firebase from 'firebase';

/*
  Generated class for the ChooseUsername page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-choose-username',
  templateUrl: 'choose-username.html'
})
export class ChooseUsernamePage {
  usernameTaken = false;
  usernameChanged = false;
  usernameForm:any;
  users:any;
  usernames:any = [];
  currentUser:any;
  user:any;
  username:any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public zone: NgZone,public navParams: NavParams, formBuilder: FormBuilder,public auth:Auth) {
    this.usernameForm = formBuilder.group({
      username: ['', Validators.compose([Validators.minLength(2), Validators.required])]
    })
  }

  ionViewWillEnter(){
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn() {

    this.zone = new NgZone({});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
          this.currentUser = user;
          console.log(user);
          this.fetchUsernames();
          unsubscribe();
      });
    }, (error) => {
      console.log("error occured");
    });
  }

  saveUsername(){
    if(this.usernameTaken){
      let alert = this.alertCtrl.create({
        message:'Der gewählte Nutzername ist bereits vergeben. Bitte wähle einen anderen.',
        buttons:['OK'],
        title:'Nutzername nicht verfügbar'
      })
      alert.present();
    }else{
    firebase.database().ref('users/'+ this.currentUser.uid).update({
      username:this.username
    }).then(data => {
      this.auth.setUsername(this.username);
      this.navCtrl.setRoot(HomePage);
    }).catch(error=>{
      console.log(error.message);
    })
    }
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  checkUsername(){
    this.usernameTaken = false;
    //if (val && val.trim() != '') {
      //console.log(val);
      for(let i in this.usernames){
        if(this.usernames[i] == this.username){
          this.usernameTaken = true;
          break;
          //Nutzername vergeben
        }
      }
  }

  fetchUsernames(){
    firebase.database().ref('users').once('value', snapshot => {
      this.users = snapshot.val();
      let user;
      let username;
      for(let i in this.users){
        user = this.users[i];
        username = user.username;
        this.usernames.push(username);
      }
      console.log(this.usernames);
    }).catch(error => console.log(error.message));
  }

}
