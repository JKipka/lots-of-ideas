import {
  NavController,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../providers/auth';
import { ChooseUsernamePage } from '../choose-username/choose-username';
import firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [Auth]
})
export class SignupPage {
  public signupForm;
  usernameTaken:boolean = false;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  loading: any;
  users:any;
  usernames:any = [];


  constructor(public nav: NavController, public authData: Auth, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.signupForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      lastname: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  signupUser() {
    this.submitAttempt = true;

    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.loading = this.loadingCtrl.create({
          spinner:'ios',
          content:'Account anlegen'
        });
        this.loading.present();
        this.authData.signupUser(this.signupForm.value.firstname, this.signupForm.value.lastname, this.signupForm.value.email, this.signupForm.value.password).then(() => {
          this.loading.dismiss().catch(error=>console.log("error caught"));
          this.nav.setRoot(ChooseUsernamePage);
        }, (error) => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
        
    }
  }

  elementChanged(input, ev) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  checkUsername(ev){
    let val = ev.target.value;
    this.usernameTaken = false;
    if (val && val.trim() != '') {
      console.log(val);
      for(let i in this.usernames){
        if(this.usernames[i] == val){
          this.usernameTaken = true;
          break;
          //Nutzername vergeben
        }
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