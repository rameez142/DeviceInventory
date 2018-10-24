import { Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DxDataGridComponent } from 'devextreme-angular'
import notify from 'devextreme/ui/notify';
import {patrolcarscls} from './patrolcarscls';
import ArrayStore from 'devextreme/data/array_store';
import SelectBox from 'devextreme/ui/select_box';

export class Product {
  ID: number;
  Name: string;
  Price: number;
  Current_Inventory: number;
  Backorder: number;
  Manufacturing: number;
  Category: string;
  ImageSrc: string;
}

@Component({
  selector: 'app-patrolcars',
  templateUrl: './patrolcars.component.html',
  styleUrls: ['./patrolcars.component.css']
})



export class PatrolcarsComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  data: any;

  loadingVisible = false;
  selahwalid:number = 1;
  rentalchk:number = 0;
  defectchk:number = 0;
  typesrc:any;
  dataSource: any;
  devicetypesrc:any;
  typelist:any;
  seltypelist:any;
  selectBox2:any;
  items: any;
  public patrolcarobj:patrolcarscls = new patrolcarscls();


  constructor(private svc:CommonService) {

this.populatetypelist();
    this.showLoadPanel();

  }


  populatetypelist()
  {
    this.svc.GetPatrolCarTypes().subscribe(resp =>
      {

         this.typelist = JSON.parse(resp);
      },
        error => {

          });
  }

  ContentReady2(e) {
    if (!e.component.__isInitialized) {
        e.component.__isInitialized = true;

    }
  }
  ContextMenuprepare(e)
  {
     if (e.row.rowType === "data") {
      e.items = [{
        text: "جديد",
        value:e.row.rowIndex,
        onItemClick: this.ContextMenuClick.bind(this)
    },
    {
        text: "تعديل",
        value:e.row.rowIndex,
        onItemClick:this.ContextMenuClick.bind(this)
    },
    {
        text: "حذف",
        value:e.row.rowIndex,
        onItemClick: this.ContextMenuClick.bind(this)
    },
    {
      text: "تقرير",
      items:[{ text: "Excel",
    value:e.row.rowIndex,
    onItemClick: this.ContextMenuClick.bind(this)
  }]

  }];

    }
  }

  ContextMenuClick(e)
  {
    console.log(e);
    if (e.itemIndex === 0)
    {
      this.dataGrid.instance.insertRow();
    }
    if (e.itemIndex === 1)
    {
      this.dataGrid.instance.editRow(e.itemData.value);
    }

    if (e.itemIndex === 2)
    {
      this.dataGrid.instance.deleteRow(e.itemData.value);
    }

    if (e.itemIndex === 4)
    {
      this.dataGrid.instance.exportToExcel(false);
    }
  }

  Cellprepare(e)
  {
    if (e.rowType === 'filter') {

      if(e.columnIndex === 1)
      {


       this.selectBox2 = new SelectBox(e.cellElement,
         {
          dataSource: this.typelist,
          valueExpr: 'value',
          displayExpr: 'text',
          onOptionChanged:this.onValueChangeOfSelectbox.bind(this)
          ,

        });
     this.populatetypelist();
      }
      }
      /* if (e.rowType === 'header') {
        e.cellElement.class='gridhdrcls';

        } */
    }

    onValueChangeOfSelectbox(e) {

          if (e.name === 'selectedItem' ) {

            console.log(e.value.text);
      if (e.value.text === "") {
        console.log('clear filters');
        this.dataGrid.instance.clearFilter();
      } else {
        console.log('filters contains');
        this.dataGrid.instance.filter(['type', 'contains', e.value.text]);
      }

          }

        }

   onShown() {
    setTimeout(() => {
        this.loadingVisible = false;
    }, 3000);
  }
  typeselboxtoggled(e)
  {

  }
  showLoadPanel() {
    this.loadingVisible = true;
  }

  ngOnInit() {
    this.populatetypelist();
    this.LoadData();
  }

LoadData()
{
  this.svc.GetPatrolCarList(this.selahwalid).subscribe(resp =>
    {

       this.dataSource = JSON.parse(resp);
     // console.log('resp' + resp);
      this.dataGrid.dataSource = this.dataSource;


      this.dataGrid.instance.refresh();
      this.populatetypelist();
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
              items: [{
                value: '1',
                text: ' الصناعية'
            }, {
                value: '2',
                text: ' شمال'
            }],
              displayExpr: 'text',
              valueExpr: 'value',
              value:'1',
              onValueChanged: this.groupChanged.bind(this)
          }
      }, {
          location: 'after',
          widget: 'dxButton',
          options: {
              icon: 'refresh',
              onClick: this.refreshDataGrid.bind(this)
          }
      });
}

groupChanged(e) {
  this.selahwalid = e.value;
 this.LoadData();
}



refreshDataGrid() {
  this.LoadData();

}

cleardata()
{

  this.patrolcarobj = null;
  this.patrolcarobj= new patrolcarscls();
 /* this.patrolcarobj.ahwalid =  -1;
  this.patrolcarobj.barcode = '';
  this.patrolcarobj.defective =  -1;
  this.patrolcarobj.platenumber =  '';
  this.patrolcarobj.type =  '';
  this.patrolcarobj.model =  '';
  this.patrolcarobj.rental = -1;
  this.patrolcarobj.patrolid =  -1;
  this.patrolcarobj.vinnumber =  '';*/
 // console.log('clear' + this.patrolcarobj.ahwalid);
}

PopupInitialize(e)
{

  this.cleardata();

  this.cleardefaultvalues();

  //e.component.columnOption("barcode", "allowEditing", false);
  if (e.parentType === 'dataRow' && e.dataField === 'barcode')
  {
  e.cancel = true;
  e.component.columnOption("barcode", "formItem", "{visible: false}");
    }

}
cleardefaultvalues()
{
  this.rentalchk = 0;
  this.defectchk = 0;
}
RowAdd(e)
{
  //console.log(this.rentalchk);
  this.cleardata();
  this.patrolcarobj.ahwalid =  this.selahwalid;
  this.patrolcarobj.barcode =  e.data.barcode;
  this.patrolcarobj.defective =  this.defectchk;
  this.patrolcarobj.platenumber =  e.data.platenumber;
  this.patrolcarobj.typecode =  this.seltypelist;
  this.patrolcarobj.model =  e.data.model;
  this.patrolcarobj.rental = this.rentalchk;
this.patrolcarobj.vinnumber = e.data.vinnumber;
  this.svc.AddPatrolCar(this.patrolcarobj).subscribe(resp =>
    {
    // console.log('resp' + resp);
     this.LoadData();
  },
    error => {

    });
    //console.log('clear' + this.patrolcarobj.ahwalid);
    this.cleardata();
    this.cleardefaultvalues();

  notify(' Record Added SuccessFully', 'success', 600);
}

checkBoxToggled(e)
{
  //console.log(e.value);
  if( e.value === true)
  {
    this.rentalchk = 1;
  }
  else{
    this.rentalchk = 0;
  }

}

seltypechange(e)
{
  //console.log(e);
this.seltypelist = e.value;
}

chkdeftoggle(e)
{
  //console.log(e.value);
  if( e.value === true)
  {
    this.defectchk = 1;
  }
  else{
    this.defectchk = 0;
  }

}

RowUpdate(e)
{

  this.svc.UpdatePatrolCar(this.patrolcarobj).subscribe(resp =>
    {

      //console.log('resp' + resp);
     this.LoadData();
  },
    error => {

    });
}

RowDelete(e)
{
  this.cleardata();

  this.patrolcarobj.patrolid =  e.data.patrolid;
 console.log(e.data.patrolid);
  this.svc.DeletePatrolCar(this.patrolcarobj).subscribe(resp =>
    {

      console.log('resp' + resp);
     this.LoadData();
  },
    error => {

    });
}
popupVisible:any = false;
showInfo() {
  this.patrolcarobj.ahwalid =  this.selahwalid;
  this.patrolcarobj.barcode =  '';
  this.patrolcarobj.defective =  1;
  this.patrolcarobj.platenumber =  '1111';
  this.patrolcarobj.typecode =  '01';
  this.patrolcarobj.model =  '2017';
  this.patrolcarobj.rental = 1;
  this.popupVisible = true;
}

}
