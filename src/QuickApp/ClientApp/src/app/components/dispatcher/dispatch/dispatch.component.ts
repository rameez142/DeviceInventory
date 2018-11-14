import { ElementRef,Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular'
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { ModalService } from '../../../services/modalservice';
import { handler_ahwalMapping } from '../../../../environments/handler_ahwalMapping';
import {ahwalmapping} from '../../../models/ahwalmapping';
import {citygroups} from '../../../models/citygroups';
import {persons} from '../../../models/persons';
import { patrolcars } from '../../../models/patrolcars';
import { handhelds } from '../../../models/handhelds';
import { associates } from '../../../models/associates';
import { sectors } from '../../../models/sectors';
import { shifts } from '../../../models/shifts';
import { patrolroles } from '../../../models/patrolroles';
import { user } from '../../../models/user';
import { operationLog } from '../../../models/operationLog';

import { handler_operations } from '../../../../environments/handler_operations';
import { HandheldinventoryComponent } from '../../maintainence/inventory/handheldinventory/handheldinventory.component';
import { Timestamp } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})



export class DispatchComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;



  loadingVisible:boolean = false;
  selahwalid:number = -1;

ahwalMapping_CheckInOut_StatusLabel:string;
responsibilitysrc:patrolroles[];
shiftssrc:shifts[];
sectorssrc:sectors[];
citysrc:citygroups[];
associatesrc:associates[];
sectorid:number;
personsrc:persons[];
shiftvisibile:boolean=false;
sectorvisibile:boolean=false;
cityvisibile:boolean=false;
associatevisibile:boolean=false;
userid:number = null;
selectedRole:string = null;
selectedShift:string = null;
ahwalMapping_Add_status_label:string ='';
selectPerson_Mno:string =null;
ahwalMappingAddMethod:string ='';
selahwalmappingid:number=null;
selectedSector:string=null;
selectedAssociateMapId:string=null;
selectedCity:string=null;
checkInOutPopupVisible:any=false;
personname:string='';
associatePersonMno:number = null;
menuOpen:boolean=false;
userobj:user = new user();
dataSource: any;
styleExp:string='none';
AhwalMapping_CheckInOut_ID:any;
AhwalMapping_CheckInOut_Method:any;
selCheckInOutPersonMno: number =null;
selCheckInOutPatrolPltNo:number = null;
selCheckInOutHHeldSerialNo:number = null;

patrolCarsrc:patrolcars[];
selRowIndex:number;
  public options = {
    spinable: true,
    buttonWidth: 40,
    defaultOpen:true
};
handHeldsrc:handhelds[];
public wings = [ {
  'title': 'غياب',
  'color': '#f16729',
  'icon': {'name': ''}
}, {
  'title': 'مرضيه',
  'color': '#f89322',
  'icon': {'name': ''}
}, {
  'title': 'اجازه',
  'color': '#ffcf14',
  'icon': {'name': ''}
},
 {
  'title': 'حذف',
  'color': '#ffcf20',
  'icon': {'name': ''}
},
{
 'title': 'آخر كمن حاله',
 'color': '#ffcf16',
 'icon': {'name': ''}
}
, {
  'title': 'CheckIn/Out',
  'color': '#ffcf16',
  'icon': {'name': ''}
}
];

public gutter = {
top: 400,
left:600
};

public startAngles = {
topLeft: -20
};


  constructor(private svc:CommonService, private modalService: ModalService,private alertService: AlertService) {
      this.userid = parseInt(window.localStorage.getItem('UserID'),10);
      this.userobj.userID = this.userid;
    this.showLoadPanel();
   }

  onShown() {
    setTimeout(() => {
        this.loadingVisible = false;
    }, 3000);
  }


  showLoadPanel() {
    this.loadingVisible = true;
  }





  ngOnInit() {

    this.bindAhwalMappingGridSources();
    this.bindAhwalMappingGrid();
  }

  roleSelection(e)
  {
    console.log(e);
this.selectedRole = (e.value);

if(e.value !== null)
{
if(parseInt(e.value, 10) === handler_ahwalMapping.PatrolRole_CaptainAllSectors ||
 parseInt(e.value,10) === handler_ahwalMapping.PatrolRole_CaptainShift)
{
  this.shiftvisibile = true;
  this.sectorvisibile = false;
  this.cityvisibile = false;
 // this.searchInput.nativeElement.visible = false;
  this.associatevisibile = false;
}
else if(parseInt(e.value,10) === handler_ahwalMapping.PatrolRole_CaptainSector ||
parseInt(e.value,10) === handler_ahwalMapping.PatrolRole_SubCaptainSector)
{
  this.shiftvisibile = true;
  this.sectorvisibile = true;
  this.cityvisibile = false;
  //this.searchInput.nativeElement.visible = false;
  this.associatevisibile = false;
}
else if( parseInt(e.value , 10) === handler_ahwalMapping.PatrolRole_Associate)
{
  this.shiftvisibile = false;
  this.sectorvisibile = false;
  this.cityvisibile = false;
 // this.searchInput.nativeElement.visible = false;
  this.associatevisibile = true;
}
else if (parseInt(e.value , 10) != -1 && parseInt(e.value ,10) != null)
{
    this.shiftvisibile = true;
    this.sectorvisibile = true;
    this.cityvisibile = true;
   // this.searchInput.nativeElement.visible = true;
    this.associatevisibile = false;
}
}

  }

   bindAhwalMappingGridSources()
  {

     this.svc.GetShiftsList().toPromise().then(resp =>
        {
           // console.log(resp);
           this.shiftssrc = <shifts[]>resp;
      },
        error => {
        });

         this.svc.GetResponsibiltyList().toPromise().then(resp =>
        {
            console.log(resp);
               this.responsibilitysrc = <patrolroles[]>resp;
               console.log(this.responsibilitysrc);
        },
        error => {
        });

         this.svc.GetSectorsList(this.userid).toPromise().then(resp =>
        {
            console.log(resp);
                   this.sectorssrc = <sectors[]>resp;
                   console.log(this.sectorssrc);
         });



          this.svc.GetAssociateList(this.userid).toPromise().then(resp =>
         {
         this.associatesrc = <associates[]>resp;
          });

           this.svc.GetPersonList(this.userid).toPromise().then(resp =>
           {

            this.personsrc = <persons[]> resp;
            });

            this.svc.GetCheckinPatrolCarList(this.selahwalid,this.userid).toPromise().then(resp =>
                {

                 this.patrolCarsrc = <patrolcars[]> resp;
                 });

                 this.svc.GetCheckinHandHeldList(this.selahwalid,this.userid).toPromise().then(resp =>
                    {

                     this.handHeldsrc = <handhelds[]> resp;
                     });

  }



sectorSelection(e)
{

   if(e.value !== null)
   {
    this.selectedSector = e.value;
    this.svc.GetCityList(this.userid,parseInt(this.selectedSector , 10)).subscribe(resp =>
        {
                   this.citysrc = <citygroups[]>resp;
         });
   }
    else
    {
        this.citysrc = [];
    }
}


person_displayExpr(item){
   // console.log(item);
   if(item !== undefined)
   { return  item.name ;
   }
}


associateExpr(item){
    if ( item !== undefined )
    { return  item.name ;
    }

}

checkPatrolExp(item)
{
    if ( item !== undefined )
    { return  item.platenumber ;
    }
}

bindAhwalMappingGrid()
{
  this.svc.GetDispatchList().subscribe(resp =>
    {

       this.dataSource = resp;
     // console.log('resp' + resp);
      this.dataGrid.dataSource = this.dataSource;
      this.dataGrid.instance.refresh();

  },
    error => {

    });
}

onToolbarPreparing(e) {
    let strt :any=[];
strt =JSON.parse(window.localStorage.getItem('Orgs'));
  e.toolbarOptions.items.unshift({
      location: 'before',
      template: 'الأحوال'
  }, {
          location: 'before',
          widget: 'dxSelectBox',
          options: {
              width: 200,
              items: strt,
              displayExpr: 'text',
              valueExpr: 'value',
              value: '1',
              onValueChanged: this.ahwalChanged.bind(this)
          }
      },{
        location: 'before',
        template: 'الشفت'
    },{
        location: 'before',
        widget: 'dxSelectBox',
        options: {
            width: 200,
            items: [{
                value: '1',
                text: 'صباح'
            }, {
                value: '2',
                text: 'عصر'
            },
            {
                value: '3',
                text: ''
            }
        ],
            displayExpr: 'text',
            valueExpr: 'value',
            value: '1'
        }
    }, {
        location: 'before',
        widget: 'dxButton',
        options: {
            icon: 'glyphicon glyphicon-user',
            onClick: this.showInfo.bind(this)
        }
    }
    , {
          location: 'after',
          widget: 'dxButton',
          options: {
              icon: 'refresh',
              onClick: this.refreshDataGrid.bind(this)
          }
      });
}

ahwalChanged(e) {
    this.selahwalid = e.value;
    this.bindAhwalMappingGrid();

}


onRowPrepared(e)
{
    //if(e.RowType)

    if(e.rowType ==='data')
    {
      console.log(e);
    //set default to white first
     e.rowElement.bgColor = "White";
    // e.rowElement.font = "Italic";
     //e.rowElement.css('background', 'green');
    // e.cells[0].cellElement.css("color", "red");
    // e.rowElement.color="red";
     //e.rowElement.Font.Bold = false;

        if(e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_SunRise ||
             e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Sea ||
          e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Back || 
          e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_BackFromWalking)
        {
            e.rowElement.bgColor='LightGreen';

        }
        if(e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Land )
        {
            e.rowElement.bgColor='LightGray';

        }
        if(e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Away )
        {
            e.rowElement.bgColor='Yellow';

        }
        if(e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Sick || e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Absent || e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_Off )
        {
            e.rowElement.bgColor='PaleVioletRed';

        }
        if(e.key.patrolpersonstateid === handler_ahwalMapping.PatrolPersonState_WalkingPatrol  )
        {
            e.rowElement.bgColor='CadetBlue';

        }
        if(e.key.patrolroleid === handler_ahwalMapping.PatrolRole_Associate  )
        {
            e.rowElement.bgColor='SandyBrown';

        }
    

        if(e.key.incidentid !== null &&  e.key.incidentid !== '' )
        {
            e.rowElement.bgColor='Red';

        }

        if (e.key.laststatechangetimestamp != null )
        {
            var lastTimeStamp = <Date>(e.key.laststatechangetimestamp);
            if (e.key.personState === handler_ahwalMapping.PatrolPersonState_Land) //max 1 hour
            {
            

               /*  var hours = (DateTime.Now - lastTimeStamp).TotalHours;
                if (hours >= 1)
                {
                    e.Row.ForeColor = System.Drawing.Color.PaleVioletRed;
                    e.Row.Font.Bold = true;
                } */
            }
            else if (e.key.personState  == handler_ahwalMapping.PatrolPersonState_Away) //max 10 minues
            {
                /* var minutes = (DateTime.Now - lastTimeStamp).TotalMinutes;
                if (minutes >= 11)
                {
                    e.Row.ForeColor = System.Drawing.Color.PaleVioletRed;
                    e.Row.Font.Bold = true;
                } */
            }


        }

    }
}

WingSelected(e)
{
  console.log(e);
if(e === false)
{
  this.styleExp = 'none';
}

}
WingSelected2(e)
{

    if(e.title ==='حذف')
  {
    this.alertService.showDialog('متأكد تبي تمسح؟ أكيد؟', DialogType.confirm, () => this.deleteMapping());
    
    
  }
  else if(e.title ==='غياب')
  {
    this.alertService.showDialog("متأكد تبي تغير الحالة لغياب؟ أكيد؟", DialogType.confirm, () => this.updatePersonState(e.title));
   /*  var result = confirm("متأكد تبي تغير الحالة لغياب؟ أكيد؟", "");
    result.done(function (dialogResult) {
        if(dialogResult) this.updatePersonState(e.title);
    }); */
  }
  else if(e.title ==='مرضيه')
  {
    this.alertService.showDialog("متأكد تبي تغير الحالة مرضيه؟ أكيد؟", DialogType.confirm, () => this.updatePersonState(e.title));

 /*    var result = confirm("متأكد تبي تغير الحالة مرضيه؟ أكيد؟", "");
    result.done(function (dialogResult) {
        if(dialogResult) this.updatePersonState(e.title);
    });  */
  }
  else if(e.title ==='اجازه')
  {
    this.alertService.showDialog("متأكد تبي تغير الحالة لاجازه؟ أكيد؟", DialogType.confirm, () => this.updatePersonState(e.title));

 /*    var result = confirm("متأكد تبي تغير الحالة لاجازه؟ أكيد؟", "");
    result.done(function (dialogResult) {
        if(dialogResult) this.updatePersonState(e.title);
    });  */
  }
  else if(e.title ==='آخر كمن حاله')
  {
    this.show_States_PopUp();
  }
  else if(e.title ==='CheckIn/Out'  )
  {

    this.ShowCheckInoutPopup();
  }
}

show_States_PopUp(){

}
updatePersonState(selmenu:string)
{
    if(this.selahwalmappingid !== null)
    {
        let rqhdr:object = {
            Selmenu :selmenu,
            AhwalMappingId:this.selahwalmappingid,
            userid:this.userid
          };
          this.svc.updatePersonState(rqhdr).subscribe(resp =>
            {
              
              notify( resp, 'success', 600);
              this.bindAhwalMappingGrid();
      
          });
     /*  this.svc.updatePersonState(selmenu,this.selahwalmappingid,this.userid).toPromise().then(resp =>
      {
        let olog:operationLog = new operationLog();
        olog= <operationLog>resp;
        notify( olog.text, 'success', 600);
        this.bindAhwalMappingGrid();

    }); */

    }
}
 deleteMapping() {
console.log(this.selahwalmappingid);
  if(this.selahwalmappingid !== null)
  {
    let rqhdr:object = {
        
        AhwalMappingId:this.selahwalmappingid,
        userid:this.userid
      };

      this.svc.DeleteAhwalMapping(rqhdr).toPromise().then(resp =>
        {
         
          notify( resp, 'success', 600);
          this.bindAhwalMappingGrid();
      });
   /*  this.svc.DeleteAhwalMapping(this.selahwalmappingid,this.userid).toPromise().then(resp =>
    {
      let olog:operationLog = new operationLog();
      olog= <operationLog>resp;
      notify( olog.text, 'success', 600);
      this.bindAhwalMappingGrid();

  }); */

  }
}
/* onContextMenuprepare(e) {
  //this.menuOpen = true;
  console.log(e);
  this.clearCheckInPopupValues();
  this.selahwalmappingid = e.row.key.ahwalmappingid;
  this.selCheckInOutPersonMno = e.row.key.milnumber;
  //console.log(this.selahwalmappingid);
  this.options.defaultOpen = true;
  this.styleExp = 'inline';
  if (e.row.rowType === 'data') {
    e.items = [{text:''}];
  }

  e.cancel = true;

    if (e.row.rowType === 'data') {
    e.items = [{
      text: 'غياب',
      value:e.row.rowIndex

  },
  {
      text: 'مرضيه',
      value:e.row.rowIndex
  }
  ,
  {
      text: 'اجازه',
      value:e.row.rowIndex
  }
];

  } 
} */

refreshDataGrid() {
 // this.dataGrid.instance.refresh();
 this.bindAhwalMappingGrid();
}

popupVisible:any = false;
showInfo() {
    this.clearpersonpopupvalues();
    this.ahwalMappingAddMethod ='ADD';
    this.popupVisible = true;
   //this.modalService.open('custom-modal-2');
}

mappopupVisible:any = false;

showmapInfo() {
  this.modalService.open('custom-modal-1');
}

citySelection(e)
{
this.selectedCity = e.value;
}

 async AhwalMapping_Add_SubmitButton_Click(e)
{
 /*    let rqhdr:object = {
        PatrolRoleId :this.selectedRole,
        Milnumber:this.selectPerson_Mno,
        ShiftId:this.selectedShift,
        SectorId:this.selectedSector,
        CityGroupId:this.selectedCity,
        AssociateAhwalMappingID:this.selectedAssociateMapId,
        userid:this.userid
      };

    this.svc.AddAhwalMapping(rqhdr).subscribe(resp =>
        {

            
                this.ahwalMapping_Add_status_label = resp;
           this.bindAhwalMappingGrid();

      });
    } */

   if(this.selectedRole === null)
   {
    this.ahwalMapping_Add_status_label  = 'يرجى اختيار المسؤولية';
    return;
   }

  if(this.selectPerson_Mno === null){
    this.ahwalMapping_Add_status_label  = 'يرجى اختيار الفرد';
    return;
}

let personobj:persons = null;
     await this.svc.GetPersonForUserForRole(parseInt(this.selectPerson_Mno , 10),
   this.userid).toPromise().then(resp =>
    {
        if (resp !== [])
        {
            personobj = <persons>resp;
            console.log(personobj);
        }
        console.log(personobj);
  });


console.log(personobj);

  if (personobj === null)
  {
      console.log(personobj);
      this.ahwalMapping_Add_status_label = 'لم يتم العثور على الفرد';
      return;
  }


console.log(personobj);
let ahwalmappingobj:ahwalmapping = new ahwalmapping();
if(parseInt(this.selectedRole , 10) === handler_ahwalMapping.PatrolRole_CaptainAllSectors ||
 parseInt(this.selectedRole, 10 ) === handler_ahwalMapping.PatrolRole_CaptainShift)
{

    if(this.selectedShift === null)
    {
        this.ahwalMapping_Add_status_label  = 'يرجى اختيار الشفت';
        return;
    }

    ahwalmappingobj.ahwalID = personobj.ahwalID;
    ahwalmappingobj.personID = personobj.personID;
    ahwalmappingobj.sectorID = handler_ahwalMapping.Sector_Public;
    let citygroupsobj:citygroups[];
    await this.svc.GetCityGroupForAhwal(personobj.ahwalID).toPromise().then (resp =>
        {

            if (resp !== [])
            {
                citygroupsobj = <citygroups[]>(resp);
            }

      },
        error => {
        });
        ahwalmappingobj.cityGroupID = citygroupsobj[0].cityGroupID;
        ahwalmappingobj.shiftID = parseInt(this.selectedShift , 10);
        ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole , 10);
        if(this.ahwalMappingAddMethod === 'UPDATE') {
            ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
            this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    this.ahwalMapping_Add_status_label = resp;
                 this.bindAhwalMappingGrid();
              });
        }
        else {
            this.svc.AddAhwalMapping(ahwalmappingobj,this.userobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                  let olog:operationLog = new operationLog();
                 olog= <operationLog>resp;
                    this.ahwalMapping_Add_status_label = olog.text;
                 this.bindAhwalMappingGrid();
              });
        }
}
else if (parseInt(this.selectedRole,10) === handler_ahwalMapping.PatrolRole_CaptainSector ||
parseInt(this.selectedRole,10) === handler_ahwalMapping.PatrolRole_SubCaptainSector)
{
    if(this.selectedShift === null)
    {
        this.ahwalMapping_Add_status_label  = 'يرجى اختيار الشفت';
        return;
    }

    if(this.selectedSector === null)
    {
        this.ahwalMapping_Add_status_label  = 'يرجى اختيار القطاع';
        return;
    }
    ahwalmappingobj.ahwalID = personobj.ahwalID;
    ahwalmappingobj.personID = personobj.personID;
    ahwalmappingobj.sectorID = parseInt(this.selectedSector,10);
    let citygroupsobj:citygroups[];
    await this.svc.GetCityGroupForAhwal(personobj.ahwalID,ahwalmappingobj.sectorID).toPromise().then(resp =>
        {

            if (resp !== [])
            {
                citygroupsobj = <citygroups[]>(resp);
            }

      });
        ahwalmappingobj.cityGroupID = citygroupsobj[0].cityGroupID;
        ahwalmappingobj.shiftID = parseInt(this.selectedShift,10);
        ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole,10);
        if(this.ahwalMappingAddMethod === 'UPDATE'){
            ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
            this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    this.ahwalMapping_Add_status_label = resp;
                 this.bindAhwalMappingGrid();
              });
        }
        else {
            this.svc.AddAhwalMapping(ahwalmappingobj,this.userobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    let ol:operationLog = new operationLog();
                    ol= <operationLog>resp;
                    this.ahwalMapping_Add_status_label = ol.text;
                 this.bindAhwalMappingGrid();
              });
        }
}
else if(parseInt(this.selectedRole, 10 ) === handler_ahwalMapping.PatrolRole_Associate)
{

if(this.selectedAssociateMapId === null){
    this.ahwalMapping_Add_status_label  = 'يرجى اختيار الشفت';
    return;
}
let ahwalMappingForAssociateobj:ahwalmapping;
this.svc.GetMappingByID(parseInt(this.selectedAssociateMapId , 10 ),this.userid).subscribe(resp =>
    {

        if (resp !== null)
        {
            ahwalMappingForAssociateobj = <ahwalmapping>resp;
        }

  });

if(ahwalMappingForAssociateobj !== null)
{
  if (personobj.personID === ahwalMappingForAssociateobj.personID){
    this.ahwalMapping_Add_status_label = 'المرافق نفس الفرد، ماهذا ؟؟؟؟';
    return;
}
ahwalmappingobj.ahwalID = ahwalMappingForAssociateobj.ahwalID;
ahwalmappingobj.personID = ahwalMappingForAssociateobj.personID;
ahwalmappingobj.sectorID = ahwalMappingForAssociateobj.sectorID;
ahwalmappingobj.cityGroupID = ahwalMappingForAssociateobj.cityGroupID;
ahwalmappingobj.shiftID = ahwalMappingForAssociateobj.shiftID;
ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole , 10);
if(this.ahwalMappingAddMethod === 'UPDATE'){
    ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
    this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
        {
            this.clearpersonpopupvalues();
            this.ahwalMapping_Add_status_label = resp;
         this.bindAhwalMappingGrid();
      });
}
else{
    this.svc.AddAhwalMapping(ahwalmappingobj,this.userobj).subscribe(resp =>
        {
            this.clearpersonpopupvalues();
            let ol:operationLog = new operationLog();
            ol= <operationLog>resp;
            this.ahwalMapping_Add_status_label = ol.text;
         this.bindAhwalMappingGrid();
      });
}

}
}
else
{
    console.log('else');
    if(this.selectedShift === null)
    {
        this.ahwalMapping_Add_status_label = 'يرجى اختيار الشفت';
        return;
    }
    ahwalmappingobj.ahwalID=personobj.ahwalID;
    if(this.selectedSector === null)
    {
        this.ahwalMapping_Add_status_label = 'يرجى اختيار القطاع';
        return;
    }

    if(this.selectedCity === null)
    {
        this.ahwalMapping_Add_status_label ='يرجى اختيار المنطقة';
        return;
    }
    ahwalmappingobj.sectorID= parseInt(this.selectedSector , 10);
    ahwalmappingobj.shiftID = parseInt(this.selectedShift , 10);
    ahwalmappingobj.cityGroupID = parseInt(this.selectedCity,10) ;
    ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole,10);
    ahwalmappingobj.personID =  personobj.personID;
    console.log(this.ahwalMappingAddMethod );
    if(this.ahwalMappingAddMethod === 'UPDATE'){
        ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
        this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
            {
                this.clearpersonpopupvalues();
                this.ahwalMapping_Add_status_label = resp;
             this.bindAhwalMappingGrid();
          });
    }
    else{
        console.log('insert');
        console.log(ahwalmappingobj );
        this.svc.AddAhwalMapping(ahwalmappingobj,this.userobj).subscribe(resp =>
            {
                this.clearpersonpopupvalues();
                let ol:operationLog = new operationLog();
                ol= <operationLog>resp;
                this.ahwalMapping_Add_status_label = ol.text;
             this.bindAhwalMappingGrid();
          });
    }
}

} 

clearpersonpopupvalues()
{

    this.selectPerson_Mno = null;
    this.selectedShift = null;

   this.associatePersonMno = null;
    this.selectedCity = null;
    this.selectedAssociateMapId = null;
   /*  */
    this.ahwalMapping_Add_status_label = '';

    this.shiftvisibile = false;
    this.sectorvisibile = false;
   this.cityvisibile = false;
    this.associatevisibile = false;

    this.selectedSector = null;
   this.selectedRole = null;
   
}



RwPopupClick(e)
{
    var component = e.component,
    prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
    

}
else {
   this.selectPerson_Mno = e.values[0];
}

}



Rwclick(e)
{
   // console.log(e);
     var component = e.component,
    prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
        this.clearCheckInPopupValues();
        this.selahwalmappingid = e.key.ahwalmappingid;
        this.selCheckInOutPersonMno = e.key.milnumber;
        this.options.defaultOpen = true;
        this.styleExp = 'inline';
    } 
   
}

RwAssociatePopupClick(e)
{
    var component = e.component,
    prevClickTime = component.lastClickTime;
component.lastClickTime = new Date();
if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
    //Double click code

}
else {
 //  this.associatePersonMno = e.values[0];
 console.log(e.values[0]);
 this.associatePersonMno = e.values[0];
}

}

RwPatrolCheckPopupClick(e)
{
    console.log(e);
    //console.log(e.data.patrolid);
    this.selCheckInOutPatrolPltNo = e.data.platenumber;
}

RwHandHeldCheckPopupClick(e)
{
this.selCheckInOutHHeldSerialNo =  e.data.serial;
}

ShowCheckInoutPopup()
{
    
    this.checkInOutPopupVisible=true;
    this.AhwalMapping_CheckInOut_ID = this.selahwalmappingid;
   // this.ShowCheckInOutPopdtls();
 }

 clearCheckInPopupValues()
 {
     this.ahwalMapping_CheckInOut_StatusLabel = null;
     this.selCheckInOutPersonMno = null;
     this.selCheckInOutPatrolPltNo = null;
     this.selCheckInOutHHeldSerialNo = null;
 }

CloseCheckInoutPopup(){
  this.checkInOutPopupVisible = false;

}
AhwalMapping_CheckInButton_Click(e)
{
   
    let rqhdr:object = {
        personMno :this.selCheckInOutPersonMno,
        plateNumber:this.selCheckInOutPatrolPltNo,
        serial:this.selCheckInOutHHeldSerialNo,
        userid:this.userid
      };

    this.svc.CheckInAhwalMapping(rqhdr).subscribe(resp =>
        {


                this.ahwalMapping_CheckInOut_StatusLabel = resp;
   this.bindAhwalMappingGrid();

      });

    
}

checkhandheldexpr(item)
{
    if ( item !== undefined )
    { return  item.serial ;
    }
}

checkInassociateExpr(item)
{
    if ( item !== undefined )
    { return  item.milnumber ;
    }
}

RwPersonCheckPopupClick(e)
{
this.selCheckInOutPersonMno = e.data.milnumber;

}
}
