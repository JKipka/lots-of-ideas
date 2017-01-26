import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { Auth } from '../../providers/auth';
import {ProfilePage} from '../profile/profile';
/*
  Generated class for the ViewPublicIdeas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-public-ideas',
  templateUrl: 'view-public-ideas.html'
})
export class ViewPublicIdeasPage {

  ideasPerCategory: any;
  savedIdeas: any;
  category: string;
  loading: any;
  username: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public auth: Auth, public toastCtrl: ToastController) {
    this.category = navParams.get("category");
    this.username = this.auth.username;
    this.user = this.auth.user;
    console.log(this.username);
  }

  ionViewWillEnter() {
    this.ideasPerCategory = [];
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten...'
    });
    this.loading.present();
    this.fetchSavedIdeas();
    this.fetchIdeas();
    console.log('ionViewDidLoad ViewPublicIdeasPage');
  }

  ionViewDidLoad() {
    
  }

  fetchSavedIdeas() {
    this.savedIdeas = [];
    firebase.database().ref('users/' + this.user.uid + "/saved_ideas").once('value', snapshot => {
      this.savedIdeas = snapshot.val();
    }).catch(error => {
      console.log(error.message);
    })
  }

  fetchIdeas() {
    this.ideasPerCategory = [];
    firebase.database().ref('public_ideas/').once('value', snapshot => {
      let ideas = snapshot.val();
      let idea;
      let counter = 0;
      for (let i in ideas) {
        idea = ideas[i];
        if (idea.ideacategory == this.category) {
          this.ideasPerCategory.push(idea);
          this.ideasPerCategory[counter].isAdded = false;
          counter++;
        }
      }
      for (let i in this.ideasPerCategory) {
        idea = this.ideasPerCategory[i];
        for(let j in this.savedIdeas){
          if(idea.ideaId==this.savedIdeas[j].ideaId){
            idea.isAdded = true;
          }
        }
      }
    }).then(data => {
      this.loading.dismiss().catch(console.log("error caught"));
    }).catch(error => {
      console.log("error caught");
    })
  }

  testAlert(username) {
    alert(username);
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  viewUserProfile(userId){
    let user = [];
    firebase.database().ref('users/' + userId).once('value', snapshot => {
      user = snapshot.val();
    }).then(data=>{
      this.navCtrl.push(ProfilePage, {
        user: user,
        editable: false
      });
    }).catch(error => {
      //alert
      console.log(error.message);
    })
  }

  savePublicIdea(ideaId) {
    let id = this.makeid();
    firebase.database().ref('users/' + this.user.uid + '/saved_ideas').child(id).set({
      ideaId: ideaId
    }).then(data => {
      for(let i in this.ideasPerCategory){
        let idea = this.ideasPerCategory[i];
        if(idea.ideaId==ideaId){
          idea.isAdded = true;
        }
      }
      //refresh saved ideas
      this.fetchSavedIdeas();
      let toast = this.toastCtrl.create({
        message:'Idee gespeichert!',
        duration: 2000
      });
      toast.present();
      //show toast
      //add points to OP
    })
  }

  deletePublicIdea(ideaId){
    let idea;
    let deleteId;
    for(let i in this.savedIdeas){
      idea = this.savedIdeas[i];
      if(idea.ideaId==ideaId){
        deleteId = i;
      }
    }
    firebase.database().ref('users/' + this.user.uid + '/saved_ideas/' + deleteId).remove().then(data => {
      for(let i in this.ideasPerCategory){
        let idea = this.ideasPerCategory[i];
        if(idea.ideaId==ideaId){
          idea.isAdded = false;
        }
      }
      this.fetchSavedIdeas();
      let toast = this.toastCtrl.create({
        message:'Idee entfernt!',
        duration: 2000
      });
      toast.present();
    })
  }

}
