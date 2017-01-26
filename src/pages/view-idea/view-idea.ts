import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase';

/*
  Generated class for the ViewIdea page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-idea',
  templateUrl: 'view-idea.html'
})
export class ViewIdeaPage {

  idea: any;
  uid: any;
  ideaId: any;

  editMode: boolean = false;

  category: any;

  movieType: string = "";
  websitetype: any = "";
  blogType: any = "";
  appType: any = "";

  movietags: any = [];
  booktags: any = [];
  websitetags: any = [];
  blogtags: any = [];
  apptags: any = [];
  notetags: any = [];

  public generalInfoForm;
  public movieForm;
  public storyForm;
  public websiteForm;
  public blogForm;
  public appForm;
  public sketchForm;
  public noteForm;

  loadingSpinner: any;

  constructor(public navCtrl: NavController, public loading: LoadingController, public fB: FormBuilder, public navParams: NavParams) {
    this.idea = this.navParams.get("idea");
    this.uid = this.navParams.get("uid");
    this.ideaId = this.navParams.get("ideaId");
    this.category = this.idea.ideacategory;
    if (this.idea.ideacategory == "Film") {
      this.movieType = this.idea.ideacontent.moviecategory;
      this.movietags = this.idea.ideacontent.tags;
    }
    if (this.idea.ideacategory == "Story") {
      this.booktags = this.idea.ideacontent.tags;
    }
    if (this.idea.ideacategory == "Webseite") {
      this.websitetype = this.idea.ideacontent.websitecategory;
      this.websitetags = this.idea.ideacontent.tags;
    }
    if (this.idea.ideacategory == "Blog") {
      this.blogType = this.idea.ideacontent.blogcategory;
      this.blogtags = this.idea.ideacontent.tags;
    }
    if (this.idea.ideacategory == "App") {
      this.appType = this.idea.ideacontent.appcategory;
      this.apptags = this.idea.ideacontent.tags;
    }
    if (this.idea.ideacategory == "Noitz") {
      this.notetags = this.idea.ideacontent.tags;
    }
    this.generalInfoForm = fB.group({
      ideatitle: ['', Validators.compose([Validators.required])]
    })

    this.movieForm = fB.group({
      movietitle: [''],
      moviegenre: [''],
      moviedesc: ['', Validators.compose([Validators.required])]
    })

    this.storyForm = fB.group({
      storytitle: [''],
      storygenre: [''],
      storydesc: ['', Validators.compose([Validators.required])]
    })

    this.websiteForm = fB.group({
      websitetitle: [''],
      websitedomain: [''],
      websitedesc: ['', Validators.compose([Validators.required])]
    })

    this.blogForm = fB.group({
      blogtitle: [''],
      blogdesc: ['']
    })

    this.appForm = fB.group({
      apptitle: [''],
      apptarget: [''],
      appdesc: ['', Validators.compose([Validators.required])]
    })

    this.noteForm = fB.group({
      notedesc: ['', Validators.compose([Validators.required])]
    })
  }

  ionViewDidLoad() {

  }

  editIdea() {
    this.editMode = true;
  }

  saveIdea() {

  }

  getSelectedCategory(value) {
    this.category = value;
  }

  getSelectedMovieType(value) {
    this.movieType = value;
  }

  getSelectedWebsiteType(value) {
    this.websitetype = value;
  }

  getSelectedBlogType(value) {
    this.blogType = value;
  }

  getSelectedAppType(appType) {
    this.appType = appType;
  }

  getGeneralInfo() {
    return this.generalInfoForm.value.ideatitle;
  }


  saveMovieIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    if (ideatitle == null) {
      ideatitle = this.idea.ideatitle;
    }
    let ideacategory = this.category;
    let movietitle = this.movieForm.value.movietitle;
    if (movietitle == null) {
      movietitle = this.idea.ideacontent.movietitle;
    }
    let moviegenre = this.movieForm.value.moviegenre;
    if (moviegenre == null) {
      moviegenre = this.idea.ideacontent.moviegenre;
    }
    let moviecat = this.movieType;
    let moviedesc = this.movieForm.value.moviedesc;
    if (moviedesc == null) {
      moviedesc = this.idea.ideacontent.moviedesc;
    }
    let movietags = this.movietags;

    let movieIdea = {
      movietitle: movietitle,
      moviecategory: moviecat,
      moviegenre: moviegenre,
      moviedesc: moviedesc,
      tags: movietags
    }

    let idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: movieIdea,
      icon: 'videocam'
    }

    this.updateIdea(idea);

  }

  saveStoryIdea() {

  }

  updateIdea(idea) {
    console.log(idea);
    firebase.database().ref('users/' + this.uid + '/ideas/').once('value', snapshot => {
      let ideaArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        if (i == this.ideaId) {
          ideaArray[i] = idea;
        } else {
          ideaArray[i] = snapshot.val()[i];
        }
      }
      firebase.database().ref('users/' + this.uid + '/').update({
        ideas: ideaArray
      }).then((data) => {
        this.loadingSpinner.dismiss().catch(() => console.log("error caught"));
        this.navCtrl.pop();
      })
    })

  }

  saveWebsiteIdea() {

  }

  saveBlogIdea() {

  }

  saveAppIdea() {

  }

  saveNote() {

  }

  toRoot() {
    this.navCtrl.pop();
  }

  createAndPresentLoading() {
    this.loadingSpinner = this.loading.create({
      spinner: 'ios',
      content: 'Speichere Idee...'
    })
    this.loadingSpinner.present();
  }

}
