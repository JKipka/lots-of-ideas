import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import {ViewPublicIdeasPage} from '../view-public-ideas/view-public-ideas';

/*
  Generated class for the FindIdeas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-find-ideas',
  templateUrl: 'find-ideas.html'
})
export class FindIdeasPage {

  publicIdeas: any;
  filmCounter = 0;
  storyCounter = 0;
  websiteCounter = 0;
  blogCounter = 0;
  appCounter = 0;
  noteCounter = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    this.countCategories(null);
  }

  ionViewWillEnter() {

  }

  countCategories(event) {
    firebase.database().ref('public_ideas/').once('value', snapshot => {
      this.filmCounter = 0;
      this.storyCounter = 0;
      this.websiteCounter = 0;
      this.blogCounter = 0;
      this.appCounter = 0;
      this.noteCounter = 0;
      this.publicIdeas = snapshot.val();
      let idea;
      for (let i in this.publicIdeas) {
        idea = this.publicIdeas[i];
        if (idea.ideacategory == 'Film') {
          this.filmCounter++;
        }
        if (idea.ideacategory == 'Geschichte') {
          this.storyCounter++;
        }
        if (idea.ideacategory == 'Webseite') {
          this.websiteCounter++;
        }
        if (idea.ideacategory == 'Blog') {
          this.blogCounter++;
        }
        if (idea.ideacategory == 'App') {
          this.appCounter++;
        }
        if (idea.ideacategory == 'Notiz') {
          this.noteCounter++;
        }
      }
    }).then(data => {
      if (event != null) {
        event.complete();
      }
    })
  }

  doRefresh(event) {
    this.countCategories(event);
  }

  viewEntries(category){
    this.navCtrl.push(ViewPublicIdeasPage,{
      category: category
    })
  }

}
