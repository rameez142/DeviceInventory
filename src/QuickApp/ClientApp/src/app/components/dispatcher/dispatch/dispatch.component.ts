import { Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DxDataGridComponent } from "devextreme-angular"
import notify from 'devextreme/ui/notify';
import { ModalService } from '../../../services/modalservice';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})



export class DispatchComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  loadingVisible = false;
  selahwalid:number = -1;
  lookupDataSource:any =  [
    { id: 1, country: "Afghanistan"  },
    { id: 2, country: "Albania" },

];


  constructor(private svc:CommonService, private modalService: ModalService) {
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

    this.LoadData();
  }

LoadData()
{
  this.svc.GetDispatchList().subscribe(resp => 
    {
       
       this.dataSource = JSON.parse(resp);
      console.log('resp' + resp);
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
        console.log('refresh');
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
       console.log(e);
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
  
  this.popupVisible = true;
}
mappopupVisible:any = false;
showmapInfo() {
  
  //this.mappopupVisible = true;
  this.modalService.open('custom-modal-1');

}


}
