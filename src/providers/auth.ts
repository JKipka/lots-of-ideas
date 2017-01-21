import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Utils } from '../app/utils';

@Injectable()
export class Auth {

  public fireAuth: any;
  public userProfile: any;
  public user: any;
  public userData: any;

  constructor(public utils: Utils) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/users');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(firstname: string, lastname: string, email: string, password: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({
          firstname: firstname,
          lastname: lastname,
          email: email
        });
        this.setUser(newUser);
      });

  }

  setUser(user) {
    this.user = user;
    console.log(this.user);
  }

  logoutUser(): any {
    return this.fireAuth.signOut();
  }

  setUserData(){
    firebase.database().ref('users/' + this.user.uid).once('value', snapshot => {
      this.userData = snapshot.val();
    });
  }

}
