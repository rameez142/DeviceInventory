import { Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DxDataGridComponent } from "devextreme-angular"
import notify from 'devextreme/ui/notify';
import { ModalService } from '../../../services/modalservice';
import { Handler_AhwalMapping } from '../../../../environments/AhwalMapping';
import {ahwalmapping} from '../../../models/ahwalmapping.model';
import {citygroups} from '../../../models/citygroups.model';
import {personcls} from '../../../models/personcls';
@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})



export class DispatchComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  loadingVisible = false;
  selahwalid:number = -1;

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
_gridBoxValue: number = 3;
_gridSelectedRowKeys: number[] = [3];

_gridBoxValue2: number = 3;
_gridSelectedRowKeys2: number[] = [3];
selectedRole:number = null;
selectedShift:number = null;
AhwalMapping_Add_status_label:string ='';
popup_selperson_mno:number =null;
AhwalMappingAddMethod:string ='';
selahwalmappingid:number=null;
  constructor(private svc:CommonService, private modalService: ModalService) {
     
      this.userid = parseInt(window.localStorage.getItem('UserID'));
      console.log(this.userid);
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
   this.LoadDataSources();
    this.LoadData();
  }

  roleSelection(e)
  {
console.log(e);
this.selectedRole = parseInt(e.value);
if(parseInt(e.value) === Handler_AhwalMapping.PatrolRole_CaptainAllSectors || parseInt(e.value) === Handler_AhwalMapping.PatrolRole_CaptainShift)
{
  this.shiftvisibile = true;
  this.sectorvisibile = false;
  this.cityvisibile = false;
  this.associatevisibile = false;
}
else if(parseInt(e.value) === Handler_AhwalMapping.PatrolRole_CaptainSector || parseInt(e.value) === Handler_AhwalMapping.PatrolRole_SubCaptainSector)
{
  this.shiftvisibile = true;
  this.sectorvisibile = true;
  this.cityvisibile = false;
  this.associatevisibile = false;
}
else if( parseInt(e.value) === Handler_AhwalMapping.PatrolRole_Associate)
{
  this.shiftvisibile = false;
  this.sectorvisibile = false;
  this.cityvisibile = false;
  this.associatevisibile = true;
}
else
{
    this.shiftvisibile = true;
    this.sectorvisibile = true;
    this.cityvisibile = true;
    this.associatevisibile = false; 
}

  }

  LoadDataSources()
  {

    this.svc.GetShiftsList().subscribe(resp => 
        {
           // console.log(resp);
           this.shiftssrc = JSON.parse(resp);
      },
        error => { 
        });

    this.svc.GetResponsibiltyList().subscribe(resp => 
        {
               
               this.responsibilitysrc = JSON.parse(resp);
        },
        error => { 
        });

    this.svc.GetSectorsList(this.userid).subscribe(resp => 
        {
           // console.log(resp);
                   this.sectorssrc = JSON.parse(resp);
         },
                error => { 
                });

                this.svc.GetCityList(this.userid,this.sectorid).subscribe(resp => 
                    {
                       
                       this.citysrc = JSON.parse(resp);
                  },
                    error => { 
                    });

                    this.svc.GetAssociateList(this.userid).subscribe(resp => 
                        {
                            console.log(resp);
                           this.associatesrc = JSON.parse(resp);
                      },
                        error => { 
                        });

                        this.svc.GetPersonList(this.userid).subscribe(resp => 
                            {
                                console.log(resp);
                               this.personsrc = JSON.parse(resp);
                          },
                            error => { 
                            });

  }

  get gridBoxValue(): number {
    return this._gridBoxValue;
}

set gridBoxValue(value: number) {
    this._gridSelectedRowKeys = value && [value] || [];
    this._gridBoxValue = value;
}

get gridSelectedRowKeys(): number[] {
    return this._gridSelectedRowKeys;
}

set gridSelectedRowKeys(value: number[]) {
    this._gridBoxValue = value.length && value[0] || null;
    this._gridSelectedRowKeys = value;
}

gridBox_displayExpr(item){
    return item && item.name ;
}


get gridBoxValue2(): number {
    return this._gridBoxValue2;
}

set gridBoxValue2(value: number) {
    this._gridSelectedRowKeys2 = value && [value] || [];
    this._gridBoxValue2 = value;
}

get gridSelectedRowKeys2(): number[] {
    return this._gridSelectedRowKeys2;
}

set gridSelectedRowKeys2(value: number[]) {
    this._gridBoxValue2 = value.length && value[0] || null;
    this._gridSelectedRowKeys2 = value;
}

gridBox_displayExpr2(item){
    return item && item.name ;
}


LoadData()
{
  this.svc.GetDispatchList().subscribe(resp => 
    {
       
       this.dataSource = JSON.parse(resp);
     // console.log('resp' + resp);
      this.dataGrid.dataSource = this.dataSource;
      this.dataGrid.instance.refresh();

  },
    error => {
       
    });
}

onToolbarPreparing(e) {
    let strt :any=[];
strt =JSON.parse(window.localStorage.getItem("Orgs"));
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
 this.LoadData();
  
}

groupChanged(e) {
    if (e.value === '3')
    {
       // console.log('refresh');
        this.LoadData();
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
        //let personState:Number = e.GetValue("PatrolPersonStateID");
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

ContextMenuprepare(e)
{
   if (e.row.rowType === "data") {
    e.items = [{
      text: "غياب",
      value:e.row.rowIndex
     
  },
  {
      text: "مرضيه",
      value:e.row.rowIndex
  }
  ,
  {
      text: "اجازه",
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
    this.AhwalMappingAddMethod ="ADD";
  this.popupVisible = true;
}
mappopupVisible:any = false;
showmapInfo() {
  
  //this.mappopupVisible = true;
  this.modalService.open('custom-modal-1');

}

shiftSelection(e)
{
this.selectedShift = e.value;
}

AhwalMapping_Add_SubmitButton_Click()
{
   
   if(this.selectedRole === null)
   {
    this.AhwalMapping_Add_status_label  = 'يرجى اختيار المسؤولية';
    return;
   }
   this.popup_selperson_mno = 1105;
if(this.popup_selperson_mno === null){
    this.AhwalMapping_Add_status_label  = 'يرجى اختيار الفرد';
    return;
}

let personobj:personcls = null;

  this.svc.GetPersonForUserForRole(this.popup_selperson_mno,this.userid).subscribe(resp => 
    {
      
        if (JSON.parse(resp) !== [])
        {
            personobj = JSON.parse(resp);
        }
        
  },
    error => { 
    });

    if (personobj === null)
    {
        this.AhwalMapping_Add_status_label = "لم يتم العثور على الفرد";
        return;
    }

console.log(personobj);
let ahwalmappingobj:ahwalmapping = new ahwalmapping();
if(this.selectedRole === Handler_AhwalMapping.PatrolRole_CaptainAllSectors ||  this.selectedRole === Handler_AhwalMapping.PatrolRole_CaptainShift)
{

    if(this.selectedShift === null)
    {
        this.AhwalMapping_Add_status_label  = 'يرجى اختيار الشفت';
        return;
    }
  
    ahwalmappingobj.ahwalid = personobj[0].ahwalid;
    ahwalmappingobj.personid = personobj[0].personid;
    ahwalmappingobj.sectorid = Handler_AhwalMapping.Sector_Public;
    let citygroupsobj:citygroups = new citygroups();
    this.svc.GetCityGroupForAhwal(personobj[0].ahwalid).subscribe(resp => 
        {
         
            if (JSON.parse(resp) !== [])
            {
                citygroupsobj = JSON.parse(resp);
            }
            
      },
        error => { 
        });
        ahwalmappingobj.citygroupid = citygroupsobj.citygroupid;
        ahwalmappingobj.shiftid = this.selectedShift;
        ahwalmappingobj.patrolroleid = this.selectedRole;
        if(this.AhwalMappingAddMethod =="UPDATE"){
            ahwalmappingobj.ahwalmappingid = this.selahwalmappingid;
           // this.svc.UpDateAhwalMapping(ahwalmappingobj);
        }
        else{
           // this.svc.AddAhwalMapping(ahwalmappingobj);
        }
}

this.clearpersonpopupvalues();

}

clearpersonpopupvalues()
{
    this.selectedRole = null;
    this.popup_selperson_mno = null;
}

}
