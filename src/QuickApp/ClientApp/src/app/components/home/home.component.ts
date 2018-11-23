// ====================================================

// Email: support@ebenmonney.com
// ====================================================

import { Component, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { ModalService } from '../../services/modalservice';
import * as Prism from 'prismjs';
import { SignalRService } from '../../services/caller-signalr.service';
import { CallerInfo } from '../../Models/caller.model';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeInOut]
})
export class HomeComponent implements AfterViewInit {
  chatMessage: CallerInfo;
  caller_details: string;
  callerid: string;
  constructor(public configurations: ConfigurationService, private alertService: AlertService,
    private modalService: ModalService, private signalrService: SignalRService) {
    this.subscribeToEvents();
    this.caller_details = "";
    this.callerid = "";
  }
  private subscribeToEvents(): void {
    this.signalrService.connectionEstablished.subscribe(() => {
      //alert('Connection Established');
      //ADDED FOR TESTING OF SENDING MESSAGE TO SERVER
      //this.chatMessage = new CallerInfo();
      //this.chatMessage.CallerId = "11";
      //this.chatMessage.OrgId = "1";
      //this.chatMessage.Payload = "IMRAN";
      //this.chatMessage.Type = "Call";      
     // this.signalrService.invokeUpdateGrids(this.chatMessage);
    });

    this.signalrService.startCallEventReceived.subscribe((message) => {
      console.log(message);
      this.callerid = message.callerId;
      this.caller_details = message.payload;
      console.log(this.callerid);
      this.showCallerPopup('custom-modal-1');
    });
    this.signalrService.endCallEventRecieved.subscribe((message) => {
      this.closeModal('custom-modal-1');
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
    console.log(this.callerid);
    this.modalService.close(id);
  }
  /**
  * @method ngAfterViewInit
  */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
