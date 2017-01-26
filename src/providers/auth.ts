import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Utils } from '../app/utils';

@Injectable()
export class Auth {

  public fireAuth: any;
  public userProfile: any;
  public user: any;
  public userFirebase:any;
  public userData: any;
  usernameTaken = false;
  public username;

  constructor(public utils: Utils) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/users');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  checkUsername(firstname: string, lastname: string, email: string, username:string, password: string){
    firebase.database().ref('/users').once('value', snapshot => {
      let users = snapshot.val();
      let user;
      this.usernameTaken = false;
      for ( let i in users){
        user = users[i];
        if(username==user.username){
          return true;
        }
      }
      return false;
    })
  }

  setUsername(username){
    this.username = username;
  }

  signupUser(firstname: string, lastname: string, email: string, password: string): any {
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({
          firstname: firstname,
          lastname: lastname,
          email: email,
          score: 0,
          picUrl: ''
        });
        this.setUserData(newUser);
      });
    /*return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({
          firstname: firstname,
          lastname: lastname,
          email: email,
          score: 0
        });
        this.setUser(newUser);
      });*/

  }


  setUserData(user) {
    this.user = user;
    console.log(this.user);
  }

  logoutUser(): any {
    return this.fireAuth.signOut();
  }

  getUser(){
    return this.user;
  }

 

}
