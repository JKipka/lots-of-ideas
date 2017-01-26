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
  userData:any;
  username:any;

  loadingSpinner: any;

  category: string = "Auswählen";
  privacy: string = "privat";
  movieType: string = "";
  websitetype: any = "";
  blogType: any = "";
  appType: any = "";
  logline:any="";

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
    this.userData = navParams.get("userData");
    this.username = navParams.get("username");
    console.log(this.username);
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
    let privacy = this.privacy;
    let logline = this.logline;
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
      tags: movietags
    }

    idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: movieIdea,
      icon: 'videocam',
      privacy: privacy,
      logline: logline
    }

    if (!this.movieForm.valid && !this.generalInfoForm.valid) {
      console.log(this.movieForm.value);
    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  addStoryIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let privacy = this.privacy;
    let logline = this.logline;
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
      tags: storytags
    }

    idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: storyIdea,
      icon: 'create',
      privacy: privacy,
      logline: logline
    }

    if (!this.storyForm.valid && !this.generalInfoForm.valid) {
      console.log("Fehler")
    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  updateIdeaDatabase(idea) {
    let ideaId = this.makeid();
    firebase.database().ref('users/' + this.userId + '/ideas/').child(ideaId).set({
      ideatitle: idea.ideatitle,
      ideacategory: idea.ideacategory,
      ideacontent: idea.ideacontent,
      icon: idea.icon,
      privacy: idea.privacy,
      logline: idea.logline
    }).then(data => {
      if (idea.privacy == 'public') {
        firebase.database().ref('public_ideas/').child(ideaId).set({
          ideatitle: idea.ideatitle,
          ideacategory: idea.ideacategory,
          ideacontent: idea.ideacontent,
          icon: idea.icon,
          email: this.userData.email,
          uid: this.userId,
          username: this.username,
          logline: idea.logline,
          ideaId: ideaId
        }).then(data => {
          this.loadingSpinner.dismiss().catch(() => console.log("error caught"));
          this.navCtrl.pop();
        })
      } else {
        this.loadingSpinner.dismiss().catch(() => console.log("error caught"));
        this.navCtrl.pop();
      }
    })
    /*firebase.database().ref('users/' + this.userId + '/ideas/').once('value', snapshot => {
      let ideaArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        ideaArray[i] = snapshot.val()[i];
      }
      ideaArray.push(idea);
      firebase.database().ref('users/' + this.userId + '/').update({
        ideas: ideaArray
      }).then((data) => {
        if (idea.privacy == 'public') {
          firebase.database().ref('ideas/')
        } else {

        }

      })
    })*/
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 26; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  addWebsiteIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let privacy = this.privacy;
    let logline = this.logline;
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
      icon: 'globe',
      privacy: privacy,
      logline: logline
    }

    if (!this.websiteForm.valid && !this.generalInfoForm.valid) {

    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  addBlogIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let privacy = this.privacy;
    let logline = this.logline;
    let blogtitle = this.blogForm.value.blogtitle;
    let blogcategory = this.blogType;
    let blogdesc = this.blogForm.value.blogdesc;
    let blogtags = this.blogtags;
    let blogIdea = {
      blogtitle: blogtitle,
      blogcategory: blogcategory,
      blogdesc: blogdesc,
      tags: blogtags
    }
    let idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: blogIdea,
      icon: 'tumblr',
      privacy: privacy,
      logline: logline
    }
    if (!this.blogForm.valid && !this.generalInfoForm.valid) {

    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  addAppIdea() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let privacy = this.privacy;
    let logline = this.logline;
    let apptitle = this.appForm.value.apptitle;
    let appcategory = this.appType;
    let apptarget = this.appForm.value.apptarget;
    let appdesc = this.appForm.value.appdesc;
    let apptags = this.apptags;
    let appIdea = {
      apptitle: apptitle,
      appcategory: appcategory,
      apptarget: apptarget,
      appdesc: appdesc,
      tags: apptags
    }
    let idea = {
      ideatitle: ideatitle,
      ideacategory: ideacategory,
      ideacontent: appIdea,
      icon: 'appstore',
      privacy: privacy,
      logline: logline
    }
    if (!this.appForm.valid && !this.generalInfoForm.valid) {

    } else {
      this.updateIdeaDatabase(idea);
    }
  }

  addNote() {
    this.createAndPresentLoading();
    let ideatitle = this.getGeneralInfo();
    let ideacategory = this.category;
    let privacy = this.privacy;
    let logline = this.logline;
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
      icon: 'document',
      privacy: privacy,
      logline: logline
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
