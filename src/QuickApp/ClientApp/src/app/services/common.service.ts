
import { Injectable , Output,EventEmitter} from '@angular/core';
import {HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import {patrolcarscls} from '../components/maintainence/patrolcars/patrolcarscls';
import {handheldcls} from '../components/maintainence/handhelds/handheldcls';
import {accessorycls} from '../components/maintainence/accessories/accessorycls';
import {personcls} from '../components/dispatcher/employees/personcls';
@Injectable()


export class CommonService {
  private api_url: any = document.getElementsByTagName('base')[0].href;

  constructor(private http: HttpClient) {

    //console.log('sss' + document.getElementsByTagName('base')[0].href);
   }
  public GetPatrolCarList(ahwal:number,userid:number){
//let objstr: string = '{""ahwalid"":"""+  ahwal + """,""userid"":""" + userid + """}';

    //let objusr : any =  JSON.parse(objstr);
    //let objstr: string = ahwal + ';' + userid;

    return this.http.post(this.api_url + '/api/maintainence/patrolcarslist',ahwal, { responseType: 'text' })
    }

    public AddPatrolCar(frm:patrolcarscls){
      return this.http.post(this.api_url + '/api/maintainence/addpatrolcar', frm, { responseType: 'text' })
      }

      public UpdatePatrolCar(frm:patrolcarscls){
        return this.http.post(this.api_url + '/api/maintainence/updatepatrolcar', frm, { responseType: 'text' })
        }

        public DeletePatrolCar(frm:patrolcarscls){
          //console.log(frm);
          return this.http.post(this.api_url + '/api/maintainence/delpatrolcar', frm, { responseType: 'text' })
          }



          public GetPatrolCarTypes(){
            return this.http.post(this.api_url + '/api/maintainence/patrolcartypes', null, { responseType: 'text' })
            }

//#region Hand Held
public GethandheldsList(){
  return this.http.post(this.api_url + '/api/maintainence/handheldlist', null, { responseType: 'text' })
  }
public Addhandhelds(frm:handheldcls){
  return this.http.post(this.api_url + '/api/maintainence/addhandheld', frm, { responseType: 'text' })
  }

  public Updatehandhelds(frm:handheldcls){
    return this.http.post(this.api_url + '/api/maintainence/updatehandheld', frm, { responseType: 'text' })
    }

    public Deletehandhelds(frm:handheldcls){
      console.log(frm);
      return this.http.post(this.api_url + '/api/maintainence/delhandheld', frm, { responseType: 'text' })
      }

      //#region Accessory
public GetaccessoryList(){
  return this.http.post(this.api_url + '/api/maintainence/accessorylist', null, { responseType: 'text' })
  }
public Addaccessory(frm:accessorycls){
  return this.http.post(this.api_url + '/api/maintainence/addaccessory', frm, { responseType: 'text' })
  }

  public Updateaccessory(frm:accessorycls){
    return this.http.post(this.api_url + '/api/maintainence/updateaccessory', frm, { responseType: 'text' })
    }

    public Deleteaccessory(frm:accessorycls){
      console.log(frm);
      return this.http.post(this.api_url + '/api/maintainence/delaccessory', frm, { responseType: 'text' })
      }


         //#region Persons
public GetpersonList(){
  return this.http.post(this.api_url + '/api/maintainence/personslist', null, { responseType: 'text' })
  }
public Addpersons(frm:personcls){
  return this.http.post(this.api_url + '/api/maintainence/addpersons', frm, { responseType: 'text' })
  }

  public Updatepersons(frm:personcls){
    return this.http.post(this.api_url + '/api/maintainence/updatepersons', frm, { responseType: 'text' })
    }

    public Deletepersons(frm:personcls){
      console.log(frm);
      return this.http.post(this.api_url + '/api/maintainence/delpersons', frm, { responseType: 'text' })
      }


        public GetDeviceTypesList(){

          return this.http.post(this.api_url + '/api/maintainence/devicetypeslist', null, { responseType: 'text' })
          }

          public GetOrganizationList( userid:number){

            return this.http.post(this.api_url + '/api/maintainence/organizationlist', userid, { responseType: 'text' })
            }

    public GetDevicesInventoryList(){
      return this.http.post(this.api_url + '/api/maintainence/devicesinventory', null, { responseType: 'text' })
      }

      public GetHandHeldsInventoryList(){
        return this.http.post(this.api_url + '/api/maintainence/handheldsinventory', null, { responseType: 'text' })
        }

        public GetAccessoryInventoryList(){
          return this.http.post(this.api_url + '/api/maintainence/accessoryinventory', null, { responseType: 'text' })
          }

      public GetDispatchList(){
        return this.http.post(this.api_url + '/api/maintainence/dispatchlist', null, { responseType: 'text' })
        }


}
