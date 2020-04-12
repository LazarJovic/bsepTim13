import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { SigningCertificate } from 'src/app/model/signing-certificate';
import { IssuerKeyUsageWarningDialogComponent } from 'src/app/dialogs/issuer-key-usage-warning-dialog/issuer-key-usage-warning-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'signing-certificate-card',
  templateUrl: './signing-certificate-card.component.html',
  styleUrls: ['./signing-certificate-card.component.css']
})
export class SigningCertificateCardComponent implements OnInit {

  @Input()
  item: SigningCertificate;
  @Input()
  chosenKeyUsage: string[];
  @Input()
  chosenExtendedKeyUsage: string[];

  @Output() certificateChosen = new EventEmitter();

  keyUsages: string;
  conflicting: boolean;

  constructor(
    private warningDialog: MatDialog
  ) { }

  ngOnInit() {
    this.updateKeyUsage();
    this.conflicting = this.isConflicting();
  }

  chooseCertificate() {
    this.certificateChosen.emit(this.item);
  }

  warnKeyUsage() {
    const dialogRef = this.warningDialog.open(IssuerKeyUsageWarningDialogComponent, {
      maxWidth: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.certificateChosen.emit(this.item);
      }
    });
  }

  updateKeyUsage() {
    this.keyUsages = "";
    var i = 0;
    for(; i < this.item.keyUsage.length; i++) {
      this.keyUsages += this.item.keyUsage[i] + ", ";
    }
    this.keyUsages = this.keyUsages.substr(0, this.keyUsages.length - 2);
  }

  isConflicting() {
    if (this.chosenKeyUsage === undefined && this.item.keyUsage) {
      return false;
    }
    if (this.chosenExtendedKeyUsage === undefined && this.item.extendedKeyUsage) {
      return false;
    }
    for (let element of this.chosenKeyUsage) {
      let flag = false;
      for (let element2 of this.item.keyUsage) {
        if (element === element2) {
          flag = true;
          break;
        }
      }
      if (!flag)
        return true;
    }
    for (let element of this.chosenExtendedKeyUsage) {
      let flag = false;
      for (let element2 of this.item.extendedKeyUsage) {
        if (element === element2) {
          flag = true;
          break;
        }
      }
      if (!flag)
        return true;
    }
    return false;
  }

}
