// ====================================================

// Email: support@ebenmonney.com
// ====================================================

import { Component ,AfterViewInit} from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { ModalService } from '../../services/modalservice';
import { CommonService } from '../../services/common.service'
import * as Prism from 'prismjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeInOut]
})
export class HomeComponent implements AfterViewInit {

  constructor(public configurations: ConfigurationService, private alertService: AlertService,
    private modalService: ModalService, private svc: CommonService) {


        window.localStorage.setItem('UserID', '6');

  this.svc.GetOrganizationList(parseInt(window.localStorage.getItem('UserID'))).subscribe(resp =>{

        window.localStorage.setItem('Orgs',resp );
    },
      error => {
      });

      this.svc.GetShiftsList().toPromise().then(resp =>
        { 
           window.localStorage.setItem('Shifts',JSON.stringify(resp) );
           console.log(window.localStorage.getItem('Shifts'));
      });

      this.svc.GetAhwalList(parseInt(window.localStorage.getItem('UserID'))).subscribe(resp =>{

        window.localStorage.setItem('Ahwals',resp );
        console.log(window.localStorage.getItem('Ahwals'));
    },
      error => {
      });

  }

  Bootstrappopup() {
    this.alertService.showDialog('Caller 1 IS ON THE LINE', DialogType.confirm,
      () => this.alertService.showMessage('Updating Caller Status!', '', MessageSeverity.default),
      () => this.alertService.showMessage('Operation Cancelled!', '', MessageSeverity.default));
  }

  showCallerPopup(id: string) {
    this.modalService.open(id);
    // this.alertService.showMessage('Operation Cancelled!', '', MessageSeverity.default)
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
   /**
   * @method ngAfterViewInit
   */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
