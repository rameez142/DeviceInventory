import { Component, OnInit ,ViewChild} from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { DxDataGridComponent } from 'devextreme-angular'
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-handheldinventory',
  templateUrl: './handheldinventory.component.html',
  styleUrls: ['./handheldinventory.component.css']
})
export class HandheldinventoryComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  loadingVisible = false;
  orgs:any;

  constructor(private svc:CommonService) {
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
  this.svc.GetHandHeldsInventoryList().subscribe(resp =>
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
  //let orgs2: any = " [{    value: 'Org1',    text: 'Grouping by Org3'}, {    value: 'Org2',    text: 'Grouping by Org4'}]";
  e.toolbarOptions.items.unshift({
      location: 'before',
      template: 'Organization'
  }, {
          location: 'before',
          widget: 'dxSelectBox',
          options: {
              width: 200,
              items: JSON.parse(window.localStorage.getItem("Orgs")),
              displayExpr: 'text',
              valueExpr: 'value',
              value: 'الصناعية',
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
this.dataGrid.instance.clearGrouping();
//console.log('ddd' + e.value);
  this.dataGrid.instance.columnOption(e.value, 'groupIndex', 0);
}



refreshDataGrid() {
  this.dataGrid.instance.refresh();
}

}
