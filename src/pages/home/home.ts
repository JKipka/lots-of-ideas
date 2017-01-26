import { Component, NgZone } from '@angular/core';
import { Auth } from '../../providers/auth';
import { NavController, Platform, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { Utils } from '../../app/utils';
import firebase from 'firebase';
import { ProfilePage } from '../../pages/profile/profile';
import { AddIdeaPage } from '../../pages/add-idea/add-idea';
import { ShowIdeaPage } from '../../pages/show-idea/show-idea';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  filter: any = "";
  filterTags: boolean = false;
  filterCategory: boolean = false;
  filterTitel: boolean = false;

  category: any;

  tagArray: any = [];
  detailArray: any = [];
  genArray: any = [];

  user: any = [];
  userData: any = [];
  username:any;
  zone: NgZone;
  loading: any;
  firstname: any = "";
  ideas: any = [];
  ideasBackUp: any;
  firstLogin: boolean = true;

  hasEntries:boolean = true;
  ideaLength:any;

  constructor(public navCtrl: NavController, public auth: Auth, public utils: Utils, public platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController) {



    /* this.user = this.auth.user;
     console.log(this.user);*/
  }

  ionViewWillEnter() {
    this.genArray = [];
    this.detailArray = [];
    this.tagArray = [];
    this.user = [];
    //this.user = this.auth.user;
    this.checkIfLoggedIn();
  }

  hasArrayEntries(){

  }

  restoreIdeaArray() {
    this.ideas = this.ideasBackUp;
  }

  checkIfLoggedIn() {

    this.zone = new NgZone({});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user != undefined) {

        }
        //console.log(user);
        if (!user) {
          this.navCtrl.setRoot(LoginPage);
          unsubscribe();

        } else {
          this.loading = this.loadingCtrl.create({
            spinner: 'ios',
            content: 'Lade Daten...'
          });
          this.loading.present();
          this.user = user;
          this.auth.setUserData(this.user);
          console.log(user);
          this.getUserData();
          unsubscribe();
        }
      });
    }, (error) => {
      console.log("error occured");
    });
  }

  getUserData() {
    firebase.database().ref('users/' + this.user.uid).once('value', snapshot => {
      this.userData = this.user;
      this.user = [];
      this.user = snapshot.val();
      console.log(this.user);
      this.firstname = this.user.firstname;
      this.username = this.user.username;
      this.auth.setUsername(this.username);
      this.auth.userFirebase = this.user;
      this.getAllIdeas(null);
    }), (error) => {
      this.loading.dismiss().catch(() => console.log("ERROR CATCH"));
      let alert = this.alertCtrl.create({
        title: 'Fehler',
        message: 'Die Verbindung zur Datenbank ist fehlgeschlagen. Überprüfe deine Internetverbindung.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
          }
        }
        ]
      })
    };
  }

  getAllIdeas(event) {
    this.ideas = [];
    firebase.database().ref('users/' + this.userData.uid + '/ideas/').once('value', snapshot => {
      if (snapshot.val() != undefined) {
        let counter = 0;
        for( let i in snapshot.val()){
          this.ideas.push(snapshot.val()[i]);
          this.ideas[counter].id = i;
          counter++;
        }
        //this.ideas = snapshot.val();
        this.ideaLength = this.ideas.length;
        console.log(this.ideaLength);
        /*for (let i in this.ideas) {
          this.ideas[i].id = i;
        }*/
        console.log(this.ideas);
        this.ideasBackUp = this.ideas;
      }else{
        this.ideaLength = 0;
      }
    }).then(data => {
      this.loading.dismiss().catch(() => console.log("ERROR CATCH"));
      if(this.utils.firstLogin==true){
         this.showToast();
         this.utils.firstLogin = false;
      }
      if(event!=null){
        event.complete();
      }
      //this.buildSearchArrays();
    })
  }



  buildSearchArrays() {


    //TAG ARRAY
    for (let i in this.ideas) {
      let idea = this.ideas[i];
      let ideacat = idea.ideacategory;
      let tags;
      if (ideacat == "Film") {
        tags = idea.ideacontent.movietags;

      } else if (ideacat == "Geschichte") {
        tags = idea.ideacontent.storytags;
      } else if (ideacat = "Webseite") {
        tags = idea.ideacontent.websitetags;
      } else if (ideacat = "Blog") {
        tags = idea.ideacontent.blogtags;
      } else if (ideacat = "App") {
        tags = idea.ideacontent.apptags;
      } else if (ideacat = "Skizze") {
        tags = idea.ideacontent.sketchtags;
      } else if (ideacat = "Notiz") {
        tags = idea.ideacontent.notetags;
      }

      for (let tag in tags) {
        this.tagArray.push(tags[tag]);
      }
    }
    console.log(this.tagArray);

    //DETAIL ARRAY

    for (let i in this.ideas) {
      let idea = this.ideas[i];
      let ideacat = idea.ideacategory;
      if (ideacat == "Film") {
        this.detailArray.push(idea.ideacontent.moviecategory);
        this.detailArray.push(idea.ideacontent.moviegenre);
        this.detailArray.push(idea.ideacontent.movietitle);
      } else if (ideacat == "Geschichte") {
        this.detailArray.push(idea.ideacontent.storygenre);
        this.detailArray.push(idea.ideacontent.storytitle);
      } else if (ideacat = "Webseite") {
        this.detailArray.push(idea.ideacontent.websitetitle);
        this.detailArray.push(idea.ideacontent.websitedomain);
        this.detailArray.push(idea.ideacontent.websitecat);
      } else if (ideacat == "Blog") {
        this.detailArray.push(idea.ideacontent.blogcat);
        this.detailArray.push(idea.ideacontent.blogtitle);
      }
      //RESTLICHE KATEGORIEN HINZUFÜGEN
    }

    console.log(this.detailArray);

    //GEN ARRAY

    for (let i in this.ideas) {
      this.genArray.push(this.ideas[i].ideacategory);
      this.genArray.push(this.ideas[i].ideatitle);
    }

    console.log(this.genArray);


  }

  showToast() {
    if (this.firstLogin) {
      let toast = this.toastCtrl.create({
        message: 'Willkommen ' + this.user.firstname + '!',
        duration: 2000,
        position: 'bottom'
      })
      this.firstLogin = false;
      toast.present();
    }
  }

  logout() {
    this.auth.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }

  viewProfile() {
    this.navCtrl.push(ProfilePage, {
      user: this.user,
      editable: true
    })
  }

  pushToAddNewIdea() {
    this.navCtrl.push(AddIdeaPage, {
      userId: this.userData.uid,
      userData: this.userData,
      username: this.username,
      userAcc: this.user
    });
  }

  getSearchResults(ev) {

    this.restoreIdeaArray();
    let val = ev.target.value;
    let result = [];
    var isAdded = false
    if (this.filterTags) {
      if (val && val.trim() != '') {
        for (let i in this.ideas) {
          isAdded = false;
          let idea = this.ideas[i];
          let tags = idea.ideacontent.tags;
          for (let j in tags) {
            if (tags[j].toLowerCase().indexOf(val.toLowerCase()) > -1) {
              if (!isAdded) {
                result.push(idea);
                isAdded = true;
              }
            }
          }
        }
        
        this.ideas = [];
        this.ideas = result;
        /*this.ideas = this.ideas.filter((item) => {
          return (item.ideacategory.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })*/
      }
    }

    if (this.filterCategory) {
      if (val && val.trim() != '') {
        this.ideas = this.ideas.filter((item) => {
         
          return (item.ideacategory.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }

    if (this.filterTitel) {
      if (val && val.trim() != '') {
        this.ideas = this.ideas.filter((item) => {
         
          return (item.ideatitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }

  }

  resetFilter() {

    this.filter = "";
    this.category = "";
    this.restoreIdeaArray();
  }

  resetCategoryFilter() {
    this.category = "";
    this.restoreIdeaArray();
  }

  getSearchResultsBy(value) {

    this.restoreIdeaArray();
    let val = value;

    if (this.filterTags) {

    }

    if (this.filterCategory) {
      if (val && val.trim() != '') {
        this.ideas = this.ideas.filter((item) => {
          return (item.ideacategory.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }

    if (this.filterTitel) {
      if (val && val.trim() != '') {
        this.ideas = this.ideas.filter((item) => {
          return (item.ideatitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }

  }

  determineFilter(value) {
    this.filter = value;
    if (this.filter == "Schlagwörter") {
      this.filterTags = true;
      this.filterCategory = false;
      this.filterTitel = false;
    }
    if (this.filter == "Titel") {
      this.filterTitel = true;
      this.filterTags = false;
      this.filterCategory = false;
    }
    if (this.filter == "Kategorie") {
      this.filterCategory = true;
      this.filterTitel = false;
      this.filterTags = false;
    }
  }

  showAlert(idea) {
    let alert = this.alertCtrl.create({
      title: 'Idee löschen',
      message: 'Möchtest du deine Idee wirklich löschen?',
      buttons: [{
        text: 'Abbrechen',
        role: 'cancel',
        handler: () => {
          console.log("canceled");
        }
      }, {
        text: 'Löschen',
        handler: () => {
          this.removeIdea(idea);
        }
      }
      ]
    })
    alert.present();
  }

  viewIdea(idea) {
    this.navCtrl.push(ShowIdeaPage, {
      uid: this.userData.uid,
      idea: idea,
      ideaId: idea.id
    })
  }

  removeIdea(idea) {
    firebase.database().ref('users/' + this.userData.uid + '/ideas/' + idea.id).remove();
    this.getAllIdeas(null);
  }

}
