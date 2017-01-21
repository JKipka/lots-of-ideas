import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase';

/*
  TODO: IMPLEMENT ADDBLOG UND ADDAPP
*/
@Component({
  selector: 'page-add-idea',
  templateUrl: 'add-idea.html'
})
export class AddIdeaPage {

  userId: any;

  loadingSpinner: any;

  category: string = "Auswählen...";
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public fB: FormBuilder, public loading: LoadingController) {

    this.userId = navParams.get("userId");
    console.log(this.userId);

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

  createAndPresentLoading() {
    this.loadingSpinner = this.loading.create({
      spinner: 'ios',
      content: 'Speichere Idee...'
    })
    this.loadingSpinner.present();
  }

  addMovieIdea() {

    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let movietitle = this.movieForm.value.movietitle;
    let moviegenre = this.movieForm.value.moviegenre;
    let moviecat = this.movieType;
    let moviedesc = this.movieForm.value.moviedesc;
    let movietags = this.movietags;

    let idea;
    let movieIdea;

    movieIdea = {
      movietitle: movietitle,
      moviecategory: moviecat,
      moviegenre: moviegenre,
      moviedesc: moviedesc,
      movietags: movietags
    }

    idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: movieIdea,
      icon: 'videocam'
    }

    if (!this.movieForm.valid) {
      console.log(this.movieForm.value);
    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  addStoryIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let storytitle = this.storyForm.value.storytitle;
    let storygenre = this.storyForm.value.storygenre;
    let storydesc = this.storyForm.value.storydesc;
    let storytags = this.booktags;

    let idea;
    let storyIdea;

    storyIdea = {
      storytitle: storytitle,
      storygenre: storygenre,
      storydesc: storydesc,
      storytags: storytags
    }

    idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: storyIdea,
      icon: 'create'
    }

    if (!this.storyForm.valid) {
      console.log("Fehler")
    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  updateIdeaDatabase(idea) {
    firebase.database().ref('users/' + this.userId + '/ideas/').once('value', snapshot => {
      let ideaArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        ideaArray[i] = snapshot.val()[i];
      }
      ideaArray.push(idea);
      firebase.database().ref('users/' + this.userId + '/').update({
        ideas: ideaArray
      }).then((data) => {
        this.loadingSpinner.dismiss().catch(() => console.log("error caught"));
        this.navCtrl.pop();
      })
    })
  }

  addWebsiteIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let websitetitle = this.websiteForm.value.websitetitle;
    let websitedomain = this.websiteForm.value.websitedomain;
    let websitecategory = this.websitetype;
    let websitedesc = this.websiteForm.value.websitedesc;
    let websitetags = this.websitetags;

    let websiteIdea = {
      websitetitle: websitetitle,
      websitedomain: websitedomain,
      websitecategory: websitecategory,
      websitedesc: websitedesc,
      tags: websitetags
    }

    let idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: websiteIdea,
      icon: 'globe'
    }

    if (!this.websiteForm.valid) {

    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  addBlogIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
  }

  addAppIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
  }

  addNote() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let notedesc = this.noteForm.value.notedesc;
    let notetags = this.notetags;
    let note = {
      notedesc: notedesc,
      tags: notetags
    }
    let idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: note,
      icon: 'document'
    }
    if (!this.noteForm.valid) {

    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  getGeneralInfo() {
    return this.generalInfoForm.value.ideatitle;
  }

  getSelectedCategory(value) {
    console.log(value);
    this.category = value;
    console.log(this.category);
  }

  getSelectedMovieType(value) {
    this.movieType = value;
  }

  getSelectedWebsiteType(value) {
    this.websitetype = value;
    console.log(this.websitetype);
  }

  getSelectedBlogType(value) {
    this.blogType = value;
  }

  getSelectedAppType(appType) {
    this.appType = appType;
  }

  toRoot() {
    this.navCtrl.popToRoot();
  }

}
