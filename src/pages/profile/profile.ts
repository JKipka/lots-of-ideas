import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { Auth } from '../../providers/auth';
import {Camera} from 'ionic-native';

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
  uid: any;
  editable: any = false;
  currentUser: any;
  public base64Image: string;
  public base64String:string;
  actionSheet:any;
  currentUserData:any;
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public asheetCtrl:ActionSheetController, public loadingCtrl:LoadingController) {
      this.currentUser = this.auth.user;
      this.currentUserData = this.auth.userFirebase;
      //console.log(this.currentUserData);
      this.user = navParams.get("user");
      this.findOutUserId();
  }

  ionViewDidLoad() {

  }

  findOutUserId() {
    let users;
    firebase.database().ref('/users').once('value', snapshot => {
      users = snapshot.val();
    }).then(data => {
      let user;
      for (let i in users) {
        user = users[i];
        if (user.username == this.user.username) {
          this.uid = i;
        }
      }
      //console.log(this.uid);
      if(this.uid==this.currentUser.uid){
        //same user, editable
        this.editable = true;
      }else{
        //different user, view mode
        this.currentUserData = this.user;
      }
    })
  }

  editProfile() {
    this.editMode = true;
  }

  saveProfile() {
    let profileInfo = {

    };
    this.editMode = false;
    //firebase.database().ref('users/'+this.uid);
  }

  toRoot() {
    this.navCtrl.pop();
  }

  setActionSheetOptions(){
    if(this.currentUserData.picUrl === "" || this.currentUserData.picUrl == undefined){
    this.actionSheet = this.asheetCtrl.create({
      buttons:[
        {
            text: "Kamera",
            icon: "camera",
            handler: () => this.takePicture()
          },
          {
            text: 'Fotos',
            icon: "images",
            handler: () => this.getPicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
      ]
    })
    }else {
      this.actionSheet = this.asheetCtrl.create({
        title: 'Profilbild ändern',
        buttons: [
          {
            text: "Kamera",
            icon: "camera",
            handler: () => this.takePicture()
          },
          {
            text: 'Fotos',
            icon: "images",
            handler: () => this.getPicture()
          },
          {
            text: 'Profilbild löschen',
            role: 'destructive',
            icon: "trash",
            handler: () => this.deleteProfilePicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      });
    }
  }

  changeProfilePicture(){
    this.setActionSheetOptions();
    this.actionSheet.present();
  }

  takePicture(){
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };
    this.callCamera(options);
    
  }

  callCamera(options){
    Camera.getPicture(options)
    .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64String = imageData;
        this.uploadImage();
    }, (err) => {
        console.log(err);
    });
  }

  getPicture(){
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };
    this.callCamera(options);
  }

  deleteProfilePicture(){
    var that = this;
    firebase.storage().ref().child('profilePictures/' + this.uid + "/" + this.uid + '.jpg').delete().then(function () {
      // Change remote and local picUrl
      that.auth.userFirebase.picUrl = "";
      that.currentUserData.picUrl = "";
      firebase.database().ref('users/' + that.uid).update({
        picUrl: ""
      });

      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.setActionSheetOptions()
    }).catch(function (error) {
      alert(error.message);
    });
  }

  uploadImage(){
    var that = this;
    var uploadTask = firebase.storage().ref().child('profilePictures/' + this.uid + "/" + this.uid + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'});
    uploadTask.on('state_changed', function (snapshot) {

    }, function (error) {
      alert(error.message);
    }, function () {
      that.auth.userFirebase.picUrl = uploadTask.snapshot.downloadURL;
      that.currentUserData.picUrl = uploadTask.snapshot.downloadURL;
      firebase.database().ref('users/'+that.uid).update({
        picUrl: that.auth.userFirebase.picUrl
      }).then(data=>{
        that.setActionSheetOptions();
      });

      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      //that.setActionSheetOptions()
    });

  }

}
