import { Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { ModalService } from '../../../services/modalservice';

@Component({
  selector: 'app-handhelds',
  templateUrl: './handhelds.component.html',
  styleUrls: ['./handhelds.component.css']
})
export class HandheldsComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  loadingVisible = false;
  selahwalid:number = -1;
  rentalchk:number = 0;
  defectchk:number = 0;
  typesrc:any;
  dataSource: any;
  devicetypesrc:any;
   userid: string;
   popupVisible: any = false;
   hdntrans: string = '';
   defective: number = 0;
   rental: number = 0;
   handheldid: number = 0;
   barcode: string = '';
   ahwalsrc:any;
   selhdrAhwalId:number;

//  public handheldobj:handhelds = new handhelds();


  constructor ( private modalService: ModalService, public svc:CommonService) {
    this.userid = window.localStorage.getItem('UserID');
    this.ahwalsrc= JSON.parse(window.localStorage.getItem('Ahwals'));
    this.selhdrAhwalId = this.ahwalsrc[0].ahwalid;

    this.showLoadPanel();
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

    this.LoadData();
  }

LoadData()
{
   let rqhdr:object;
rqhdr = {
  ahwalid:this.selahwalid,
  userid:this.userid
};

  this.svc.GethandheldsList(rqhdr).subscribe(resp =>
    {

       this.dataSource = resp;
      console.log('resp' + resp);
      this.dataGrid.dataSource = this.dataSource;
      this.dataGrid.instance.refresh();

  },
    error => {

    });



}
onToolbarPreparing(e) {

  e.toolbarOptions.items.unshift({
    location: 'before',
    template: 'الأحوال'
  }, {
      location: 'before',
      widget: 'dxSelectBox',
      options: {
        width: 200,
        dataSource: this.ahwalsrc,
        displayExpr: 'name',
        valueExpr: 'ahwalid',
        value:this.ahwalsrc[0].ahwalid,
        onValueChanged: this.ahwalChanged.bind(this)
      }
    }, {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'plus',
        onClick: this.ShowAddPopup.bind(this)
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
  this.selhdrAhwalId = e.value;
  this.LoadData();
}



/* ContextMenuprepare(e)
{
   if (e.row.rowType === 'data') {
    e.items = [{
      text: 'جديد',
      value:e.row.rowIndex,
      onItemClick: this.ContextMenuClick.bind(this)
  },
  {
      text: 'تعديل',
      value:e.row.rowIndex,
      onItemClick:this.ContextMenuClick.bind(this)
  },
  {
      text: 'حذف',
      value:e.row.rowIndex,
      onItemClick: this.ContextMenuClick.bind(this)
  },
  {
    text: 'تقرير',
    items:[{ text: 'Excel',
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
} */


refreshDataGrid() {
  this.LoadData();
  //this.dataGrid.instance.refresh();
}

cleardata()
{
  //this.handheldobj = null;
  //this.handheldobj= new handhelds();
}

PopupInitialize(e)
{
  console.log('popupini');
  this.cleardata();
  this.cleardefaultvalues();
  if (e.parentType === 'dataRow' && e.dataField === 'barcode')
  {
  e.cancel = true;
  e.component.columnOption('barcode', 'formItem', '{visible: false}');
    }
}
cleardefaultvalues()
{

  this.defectchk = 0;
}
chkdeftoggle(e)
{
  if( e.value === true)
  {
    this.defectchk = 1;
  }
  else{
    this.defectchk = 0;
  }

}

checkBoxToggled(e) {
  //console.log(e.value);
  if (e === true) {
    this.rentalchk = 1;
  }
  else {
    this.rentalchk = 0;
  }

}
RowAdd(e)
{

  this.cleardata();
  let rqhdr:object;
  rqhdr = {
    ahwalid:this.selahwalid,
    userid:this.userid,
    defective:this.defectchk,
    serial:e.data.serial,
    transmode:'ADD'
  };

/*
  this.handheldobj.ahwalid =  this.selahwalid;
  this.handheldobj.barcode =  e.data.barcode;
  this.handheldobj.defective =  this.defectchk;
  this.handheldobj.serial =  e.data.serial;
 */

  this.svc.Addhandhelds(rqhdr).subscribe(resp =>
    {
      notify(resp, 'success', 600);

     this.LoadData();
  },
    error => {

    });
    this.cleardata();
    this.cleardefaultvalues();

}




RowUpdate(e)
{
  console.log('update' + e.data);
 /*  this.handheldobj.ahwalid =  this.selahwalid;
  this.handheldobj.barcode =  e.data.barcode;
  this.handheldobj.defective =  this.defectchk;
  this.handheldobj.serial =  e.data.serial;
  this.handheldobj.handheldid = e.data.handheldid; */
  let rqhdr:object;
  rqhdr = {
    ahwalid:this.selahwalid,
    userid:this.userid,
    defective:this.defectchk,
    serial:e.data.serial,
    transmode:'UPDATE',
    handheldid : e.data.handheldid
  };

  this.svc.Updatehandhelds(rqhdr).subscribe(resp =>
    {
      notify(resp, 'success', 600);

     this.LoadData();
  },
    error => {

    });
}

RowDelete(e)
{
  this.cleardata();
  let rqhdr:object;
  rqhdr = {
    handheldid : e.data.handheldid,
    userid:this.userid
  };
  this.svc.Deletehandhelds(rqhdr).subscribe(resp =>
    {

      notify(resp, 'success', 600);
     this.LoadData();
  },
    error => {

    });
}

ShowAddPopup() {
  this.hdntrans = 'I';

  this.cleardefaultvalues();
  this.popupVisible = true;
}

ShowUpdatePopup(e, dt) {
}

DelRecord(e, rindex) {
  this.dataGrid.instance.deleteRow(rindex);
}

ClosePopup() {
  this.popupVisible = false;
}

}
