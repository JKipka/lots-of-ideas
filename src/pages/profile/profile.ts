import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  user: any;
  editMode: boolean = false;
  uid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get("user");
    this.uid = this.user.uid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  editProfile(){
    this.editMode=true;
  }

  saveProfile(){
    let profileInfo = {

    };
    //firebase.database().ref('users/'+this.uid);
  }

  toRoot(){
    this.navCtrl.pop();
  }

}
