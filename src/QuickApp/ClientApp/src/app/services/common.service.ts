
import { Injectable , Output,EventEmitter} from '@angular/core';
import {HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import {patrolcarscls} from '../models/patrolcarscls';
import {handheldcls} from '../models/handheldcls';
import {accessorycls} from '../models/accessorycls';
import {personcls} from '../models/personcls';
import {citygroups} from '../models/citygroups.model';
import { ahwalmapping } from '../models/ahwalmapping.model';
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

    public GetpatrolcarsInventoryList(ahwalid:number,userid:number){
      //console.log(ahwalid);
      return this.http.get(this.api_url + '/api/maintainence/patrolcarsinventory?ahwalid=' + ahwalid + '&userid=' + userid, { responseType: 'text' })
      }

      public GetHandHeldsInventoryList(ahwalid:number,userid:number){
        return this.http.get(this.api_url + '/api/maintainence/handheldinventory?ahwalid=' + ahwalid + '&userid=' + userid, { responseType: 'text' })
        }

        public GetAccessoryInventoryList(){
          return this.http.post(this.api_url + '/api/maintainence/accessoryinventory', null, { responseType: 'text' })
          }

      public GetDispatchList(){
        return this.http.post(this.api_url + '/api/maintainence/dispatchlist', null, { responseType: 'text' })
        }

        public GetPersonList(userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/personslist?userid=' + userid, { responseType: 'text' })

        }

        public GetShiftsList()
        {
          return this.http.get(this.api_url + '/api/maintainence/shiftslist', { responseType: 'text' })

        }



        public GetResponsibiltyList()
        {
          return this.http.get(this.api_url + '/api/maintainence/roleslist', { responseType: 'text' })

        }

        
        public GetSectorsList(userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/sectorslist?userid=' + userid , { responseType: 'text' })

        }

        public GetCityList(userid:number,sectorid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/citylist?userid=' + userid + '?sectorid=' + sectorid, { responseType: 'text' })

        }

        public GetAssociateList(userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/associatelist?userid=' + userid , { responseType: 'text' })

        }

        public GetPersonForUserForRole(mno:number,userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/PersonForUserForRole?mno=' + mno + '&userid=' + userid , { responseType: 'text' })

        }

        public GetCityGroupForAhwal(ahwalid:number,sectorid?:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/citygroupforahwal?ahwalid=' + ahwalid + '&sectorid=' + sectorid, { responseType: 'text' })

        }

        public AddAhwalMapping(ahwalmappingobj:ahwalmapping)
        {
          return this.http.post(this.api_url + '/api/maintainence/AddAhwalMapping' , ahwalmappingobj , { responseType: 'text' })

        }

        public UpDateAhwalMapping(ahwalmappingobj:ahwalmapping)
        {
          return this.http.post(this.api_url + '/api/maintainence/UpDateAhwalMapping' , ahwalmappingobj , { responseType: 'text' })
        }
        public GetAhwalMapForAssociate(AssociateMapId:number,userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/PersonForUserForRole?associatemapid=' + AssociateMapId + '&userid=' + userid , { responseType: 'text' })

        }

        public GetPatrolCarByPlateNumberForUserForRole(CheckInOutPatrol:number,userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/PatrolCarByPlateNumberForUserForRole?CheckInOutPatrol=' + CheckInOutPatrol + '&userid=' + userid , { responseType: 'text' })

        }

        public GetHandHeldBySerialForUserForRole(CheckInOutHandHeld:number,userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/HandHeldBySerialForUserForRole?CheckInOutHandHeld=' + CheckInOutHandHeld + '&userid=' + userid , { responseType: 'text' })

        }

        public GetMappingByPersonID(CheckInOutPerson:number,userid:number)
        {
          return this.http.get(this.api_url + '/api/maintainence/MappingByPersonID?CheckInOutPerson=' + CheckInOutPerson + '&userid=' + userid , { responseType: 'text' })

        }
}
