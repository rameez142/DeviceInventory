import { ElementRef,Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular'
import notify from 'devextreme/ui/notify';
import { ModalService } from '../../../services/modalservice';
import { Handler_AhwalMapping } from '../../../../environments/AhwalMapping';
import {ahwalmapping} from '../../../models/ahwalmapping.model';
import {citygroups} from '../../../models/citygroups';
import {persons} from '../../../models/persons';
import { patrolcars } from '../../../models/patrolcars';
import { handhelds } from '../../../models/handhelds';
import { associates } from '../../../models/associates';
import { sectors } from '../../../models/sectors';
import { shifts } from '../../../models/shifts';
import { patrolroles } from '../../../models/patrolroles';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})



export class DispatchComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  


  loadingVisible = false;
  selahwalid:number = -1;

ahwalMapping_CheckInOut_StatusLabel:any;
responsibilitysrc:any;
shiftssrc:any;
sectorssrc:any;
citysrc:any;
associatesrc:any;
sectorid:any;
personsrc:any;
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

  constructor(private svc:CommonService, private modalService: ModalService) {
      this.userid = parseInt(window.localStorage.getItem('UserID')); 
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
  dataSource: any;

  ngOnInit() {
    this.loadDataSources();
    this.loadData();
  }

  roleSelection(e)
  {
    console.log(e);
this.selectedRole = (e.value);

if(e.value !== null)
{
if(parseInt(e.value) === Handler_AhwalMapping.PatrolRole_CaptainAllSectors || parseInt(e.value) === Handler_AhwalMapping.PatrolRole_CaptainShift)
{
  this.shiftvisibile = true;
  this.sectorvisibile = false;
  this.cityvisibile = false;
 // this.searchInput.nativeElement.visible = false;
  this.associatevisibile = false;
}
else if(parseInt(e.value) === Handler_AhwalMapping.PatrolRole_CaptainSector || parseInt(e.value) === Handler_AhwalMapping.PatrolRole_SubCaptainSector)
{
  this.shiftvisibile = true;
  this.sectorvisibile = true;
  this.cityvisibile = false;
  //this.searchInput.nativeElement.visible = false;
  this.associatevisibile = false;
}
else if( parseInt(e.value) === Handler_AhwalMapping.PatrolRole_Associate)
{
  this.shiftvisibile = false;
  this.sectorvisibile = false;
  this.cityvisibile = false;
 // this.searchInput.nativeElement.visible = false;
  this.associatevisibile = true;
}
else if (parseInt(e.value) != -1 && parseInt(e.value) != null)
{
    this.shiftvisibile = true;
    this.sectorvisibile = true;
    this.cityvisibile = true;
   // this.searchInput.nativeElement.visible = true;
    this.associatevisibile = false;
}
}

  }

   loadDataSources()
  {

     this.svc.GetShiftsList().toPromise().then(resp =>
        {
           // console.log(resp);
           this.shiftssrc = <shifts>resp;
      },
        error => {
        });

         this.svc.GetResponsibiltyList().toPromise().then(resp =>
        {
            console.log(resp);
               this.responsibilitysrc = <patrolroles>resp;
               console.log(this.responsibilitysrc);
        },
        error => {
        });

         this.svc.GetSectorsList(this.userid).toPromise().then(resp =>
        {
            console.log(resp);
                   this.sectorssrc = <sectors>resp;
                   console.log(this.sectorssrc);
         });

            

          this.svc.GetAssociateList(this.userid).toPromise().then(resp =>
         {
         this.associatesrc = <associates>resp;
          });

           this.svc.GetPersonList(this.userid).toPromise().then(resp =>
           {
              
            this.personsrc =<persons> resp;
            });

  }

 

sectorSelection(e)
{
  
   if(e.value !== null)
   {
    this.selectedSector = e.value; 
    this.svc.GetCityList(this.userid,parseInt(this.selectedSector)).subscribe(resp =>
        {
                   this.citysrc = <citygroups>resp;
         });
        }
    else
    {
        this.citysrc =null;
    }
}


person_displayExpr(item){
   // console.log(item);
   if(item != undefined) return  item.name ;
}


associateExpr(item){
    if(item != undefined) return  item.name ;
}


loadData()
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
    this.loadData();

}

groupChanged(e) {
    if (e.value === '3')
    {
       // console.log('refresh');
        this.loadData();
        this.refreshDataGrid();
    }
    else
    {

    }

}

onRowPrepared(e)
{
    //if(e.RowType)

    if(e.rowType ==='data')
    {
     //  console.log(e);
        //let personState:Number = e.GetValue('PatrolPersonStateID');
        if(e.key.patrolpersonstateid === 20 || e.key.patrolpersonstateid === 30 || e.key.patrolpersonstateid === 40 || e.key.patrolpersonstateid === 74)
        {
            e.rowElement.bgColor='#a0d89e';

        }
        if(e.key.patrolpersonstateid === 70 )
        {
            e.rowElement.bgColor='#bfbeaa';

        }
        if(e.key.patrolpersonstateid === 60 )
        {
            e.rowElement.bgColor='#edeb9e';

        }
        if(e.key.patrolpersonstateid === 100 || e.key.patrolpersonstateid === 80 || e.key.patrolpersonstateid === 90 )
        {
            e.rowElement.bgColor='#ea88c8';

        }
        if(e.key.patrolpersonstateid === 72  )
        {
            e.rowElement.bgColor='#ea88c8';

        }
        if(e.key.patrolpersonstateid === 70  )
        {
            e.rowElement.bgColor='sandybrown';

        }

    }
}

onContextMenuprepare(e)
{
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
}

refreshDataGrid() {
  this.dataGrid.instance.refresh();
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
  //let myAdd = async function() {
     await this.svc.GetPersonForUserForRole(parseInt(this.selectPerson_Mno),
   this.userid).toPromise().then(resp =>
    {
        if (resp !== [])
        {
            personobj = <persons>resp;
            console.log(personobj);  
        }
        console.log(personobj);
  });
//};

console.log(personobj);

  if (personobj === null)
  {
      console.log(personobj);
      this.ahwalMapping_Add_status_label = 'لم يتم العثور على الفرد';
      return;
  }


console.log(personobj);
let ahwalmappingobj:ahwalmapping = new ahwalmapping();
if(parseInt(this.selectedRole) === Handler_AhwalMapping.PatrolRole_CaptainAllSectors ||  parseInt(this.selectedRole) === Handler_AhwalMapping.PatrolRole_CaptainShift)
{

    if(this.selectedShift === null)
    {
        this.ahwalMapping_Add_status_label  = 'يرجى اختيار الشفت';
        return;
    }

    ahwalmappingobj.ahwalID = personobj[0].ahwalID;
    ahwalmappingobj.personID = personobj[0].personID;
    ahwalmappingobj.sectorID = Handler_AhwalMapping.Sector_Public;
    let citygroupsobj:citygroups = new citygroups();
    this.svc.GetCityGroupForAhwal(personobj[0].ahwalID).subscribe(resp =>
        {

            if (resp !== [])
            {
                citygroupsobj = <citygroups>(resp);
            }

      },
        error => {
        });
        ahwalmappingobj.cityGroupID = citygroupsobj.cityGroupID;
        ahwalmappingobj.shiftID = parseInt(this.selectedShift);
        ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole);
        if(this.ahwalMappingAddMethod =='UPDATE'){
            ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
            this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
                 this.loadData();
              });
        }
        else{
            this.svc.AddAhwalMapping(ahwalmappingobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
                 this.loadData();
              });
        }
}
else if (parseInt(this.selectedRole) === Handler_AhwalMapping.PatrolRole_CaptainSector ||  parseInt(this.selectedRole) === Handler_AhwalMapping.PatrolRole_SubCaptainSector)
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
    ahwalmappingobj.ahwalID = personobj[0].ahwalID;
    ahwalmappingobj.personID = personobj[0].personID;
    ahwalmappingobj.sectorID = parseInt(this.selectedSector);
    let citygroupsobj:citygroups = new citygroups();
    this.svc.GetCityGroupForAhwal(personobj[0].ahwalid,ahwalmappingobj.sectorID).subscribe(resp =>
        {

            if (resp !== [])
            {
                citygroupsobj = <citygroups>(resp);
            }

      });
        ahwalmappingobj.cityGroupID = citygroupsobj.cityGroupID;
        ahwalmappingobj.shiftID = parseInt(this.selectedShift);
        ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole);
        if(this.ahwalMappingAddMethod =='UPDATE'){
            ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
            this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
                 this.loadData();
              });
        }
        else{
            this.svc.AddAhwalMapping(ahwalmappingobj).subscribe(resp =>
                {
                    this.clearpersonpopupvalues();
                    this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
                 this.loadData();
              });
        }
}
else if(parseInt(this.selectedRole) === Handler_AhwalMapping.PatrolRole_Associate)
{

if(this.selectedAssociateMapId === null){
    this.ahwalMapping_Add_status_label  = 'يرجى اختيار الشفت';
    return;
}
let ahwalMappingForAssociateobj:persons=new persons();
this.svc.GetAhwalMapForAssociate(parseInt(this.selectedAssociateMapId),this.userid).subscribe(resp =>
    {

        if (resp !== [])
        {
            ahwalMappingForAssociateobj = <persons>resp;
        }

  });

if(ahwalMappingForAssociateobj !== null)
{
  if (personobj[0].PersonId === ahwalMappingForAssociateobj.personID){
    this.ahwalMapping_Add_status_label = 'المرافق نفس الفرد، ماهذا ؟؟؟؟';
    return;
}
ahwalmappingobj.ahwalID = ahwalMappingForAssociateobj[0].ahwalID;
ahwalmappingobj.personID = ahwalMappingForAssociateobj[0].personID;
ahwalmappingobj.sectorID = ahwalMappingForAssociateobj[0].sectorID;
ahwalmappingobj.cityGroupID = ahwalMappingForAssociateobj[0].cityGroupID;
ahwalmappingobj.shiftID = ahwalMappingForAssociateobj[0].shiftID;
ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole);
if(this.ahwalMappingAddMethod =='UPDATE'){
    ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
    this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
        {
            this.clearpersonpopupvalues();
            this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
         this.loadData();
      });
}
else{
    this.svc.AddAhwalMapping(ahwalmappingobj).subscribe(resp =>
        {
            this.clearpersonpopupvalues();
            this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
         this.loadData();
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
    ahwalmappingobj.ahwalID=personobj[0].ahwalID;
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
    ahwalmappingobj.sectorID= parseInt(this.selectedSector);
    ahwalmappingobj.shiftID = parseInt(this.selectedShift);
    ahwalmappingobj.cityGroupID = parseInt(this.selectedCity);
    ahwalmappingobj.patrolRoleID = parseInt(this.selectedRole);
    ahwalmappingobj.personID =  personobj[0].personid;
    console.log(this.ahwalMappingAddMethod );
    if(this.ahwalMappingAddMethod =='UPDATE'){
        ahwalmappingobj.ahwalMappingID = this.selahwalmappingid;
        this.svc.UpDateAhwalMapping(ahwalmappingobj).subscribe(resp =>
            {
                this.clearpersonpopupvalues();
                this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
             this.loadData();
          });
    }
    else{
        console.log('insert');
        console.log(ahwalmappingobj );
        this.svc.AddAhwalMapping(ahwalmappingobj).subscribe(resp =>
            {
                this.clearpersonpopupvalues();
                this.ahwalMapping_Add_status_label = 'Saved SuccessFully';
             this.loadData();
          });
    }
}
//this.searchInput.nativeElement.visible = false;

//this.showInfo();

//this.clearpersonpopupvalues();
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
    //this.searchInput.nativeElement.visible = false;
    //console.log('searchinput ' + this.searchInput);
}

AhwalMapping_CheckInOut_ID:any;
AhwalMapping_CheckInOut_Method:any;
selectedCheckInOutPerson: number =null;
selectedCheckInOutPatrol:number = null;
selectedCheckInOutHandHeld:number = null;

RwPopupClick(e)
{
    var component = e.component,
    prevClickTime = component.lastClickTime;
component.lastClickTime = new Date();
if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
    //Double click code
  
}
else {
   this.selectPerson_Mno = e.values[0];
}

}



Rwclick(e)
{
    var component = e.component,
    prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
            //Double click code
             this.CallDblClick();
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


CallDblClick()
{
    this.checkInOutPopupVisible=true;
    this.AhwalMapping_CheckInOut_ID = 1165;
    
    this.ShowCheckInOutPopdtls();
    }
    
    ShowCheckInOutPopdtls()
    {
    
    if(this.selectedCheckInOutPerson === null)
    {
    this.ahwalMapping_CheckInOut_StatusLabel = 'يرجى اختيار الفرد';
    }
    let personobj:persons = new persons();
    
    
      this.svc.GetPersonForUserForRole(this.selectedCheckInOutPerson,this.userid).subscribe(resp =>
        {
    
            if (resp !== [])
            {
                personobj = <persons>resp;
            }
    
      });
    
        if (personobj === null)
        {
            this.ahwalMapping_Add_status_label = 'لم يتم العثور على الفرد';
            return;
    
          }
    
    if(this.selectedCheckInOutPatrol === null)
    {
    this.ahwalMapping_CheckInOut_StatusLabel = 'يرجى اختيار الدورية';
    }
    
    let patrolobj:patrolcars = new patrolcars();
    this.svc.GetPatrolCarByPlateNumberForUserForRole(this.selectedCheckInOutPatrol,this.userid).subscribe(resp =>
      {
    
          if (resp !== [])
          {
            patrolobj = <patrolcars>resp;
          }
    });
    
    if (patrolobj === null)
    {
        this.ahwalMapping_Add_status_label = 'لم يتم العثور على الدورية';
        return;
    
      }
    if(this.selectedCheckInOutHandHeld == null)
    {
      this.ahwalMapping_Add_status_label = 'يرجى اختيار الجهاز';
      return;
    }
      let handheldobj:handhelds = new handhelds();
      this.svc.GetHandHeldBySerialForUserForRole(this.selectedCheckInOutHandHeld,this.userid).subscribe(resp =>
        {
    
            if (resp !== [])
            {
              handheldobj = <handhelds>(resp);
            }
      });
      let personMapping ;
      this.svc.GetMappingByPersonID(this.selectedCheckInOutPerson,this.userid).subscribe(resp =>
        {
    
            if (resp !== [])
            {
              handheldobj = <handhelds>(resp);
            }
      });
                if (personMapping == null)
                {
                    this.ahwalMapping_CheckInOut_StatusLabel = 'لم يتم العثور على الفرد في الكشف';
                    return;
                }
            }

CloseCheckInoutPopup(){
  this.checkInOutPopupVisible = false;

}
}
