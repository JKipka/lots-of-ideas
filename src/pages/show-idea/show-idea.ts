import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewIdeaPage } from '../../pages/view-idea/view-idea';

/*
  Generated class for the ShowIdea page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-show-idea',
  templateUrl: 'show-idea.html'
})
export class ShowIdeaPage {

  idea:any;
  uid:any;
  ideaId:any;
  tags:any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.idea = this.navParams.get("idea");
    this.uid = this.navParams.get("uid");
    this.ideaId = this.navParams.get("ideaId");
    this.tags = this.idea.ideacontent.tags;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowIdeaPage');
  }

  editIdea(){
    this.navCtrl.push(ViewIdeaPage, {
      idea: this.idea,
      uid: this.uid,
      ideaId: this.ideaId
    })
  }

  toRoot(){
    this.navCtrl.pop();
  }

}
