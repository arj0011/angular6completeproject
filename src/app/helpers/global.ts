export class GlobalApp {

  constructor() {}

  public localStorageItem(): any {
    let anyData = localStorage.getItem('currentUser');
    let alldata = JSON.parse(anyData);
    let userData = alldata.data;
    return userData;
  }

}