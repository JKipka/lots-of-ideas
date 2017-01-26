import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

    user: any = null;
    firstLogin: boolean = true;

    constructor() {

    }

    getUser(){
        return this.user;
    }


}