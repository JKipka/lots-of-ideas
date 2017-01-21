import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

    user: any = null;


    constructor() {

    }

    getUser(){
        return this.user;
    }


}