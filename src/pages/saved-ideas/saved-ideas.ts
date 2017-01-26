import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import firebase from 'firebase';
import { ProfilePage } from '../profile/profile';

/*
  Generated class for the SavedIdeas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-saved-ideas',
  templateUrl: 'saved-ideas.html'
})
export class SavedIdeasPage {

  savedIdeas:any;
  ideasArray:any;
  user:any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.user = this.auth.user;
  }

  ionViewDidLoad() {
    this.fetchSavedIdeas();
  }

  createAndPresentLoading(show){
    this.loading = this.loadingCtrl.create({
      spinner:'ios',
      content:'Lade Daten'
    })
    if(show){
      this.loading.present();
    }
  }

  fetchSavedIdeas(){
    this.createAndPresentLoading(true);
    this.savedIdeas = [];
    firebase.database().ref('users/' + this.user.uid + "/saved_ideas").once('value', snapshot => {
      this.savedIdeas = snapshot.val();
    }).then(data=>{
      this.makeIdeaArray();
    }).catch(error => {
      console.log(error.message);
    })
  }

  makeIdeaArray(){
    this.ideasArray = [];
    firebase.database().ref('public_ideas').once('value', snapshot => {
      let public_ideas = snapshot.val();
      let idea;
      for(let i in public_ideas){
        idea = public_ideas[i];
        for(let j in this.savedIdeas){
          if(idea.ideaId==this.savedIdeas[j].ideaId){
            this.ideasArray.push(idea);
          }
        }
      }
    }).then(data=>{
      this.loading.dismiss().catch(error => console.log(error.message));
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
      this.fetchSavedIdeas();
      let toast = this.toastCtrl.create({
        message:'Idee entfernt!',
        duration: 2000
      });
      toast.present();
    })
  }

  viewUserProfile(userId) {
    let user = [];
    firebase.database().ref('users/' + userId).once('value', snapshot => {
      user = snapshot.val();
    }).then(data => {
      this.navCtrl.push(ProfilePage, {
        user: user,
        editable: false
      });
    }).catch(error => {
      //alert
      console.log(error.message);
    })
  }

}
