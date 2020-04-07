import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { User } from 'src/app/model/user';
import { DialogCreateSubjectComponent } from '../dialog-create-subject/dialog-create-subject.component';
import { UserService } from 'src/app/services/userService/user.service';
import { KeyUsageDialogComponent } from 'src/app/dialogs/key-usage-dialog/key-usage-dialog.component';
import { ExtendedKeyUsageDialogComponent } from 'src/app/dialogs/extended-key-usage-dialog/extended-key-usage-dialog.component';
import { KeyUsage } from 'src/app/model/key-usage';
import { ExtKeyUsage } from 'src/app/model/ext-key-usage';
import { ChooseCertificateDialogComponent } from 'src/app/dialogs/choose-certificate-dialog/choose-certificate-dialog.component';
import { SigningCertificate } from 'src/app/model/signing-certificate';

@Component({
  selector: 'create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  createCertificateForm: FormGroup;
  keyUsageChecked: boolean;
  extendedKeyUsageChecked: boolean;
  keyUsage: KeyUsage;
  extKeyUsage: ExtKeyUsage;
  keyUsageDesc: string;
  extKeyUsageDesc: string;
  signingCertificate: SigningCertificate;
  subjects: Array<User>;
  selectedUser: User;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public signingCertDialog: MatDialog,
    private userService: UserService,
    private keyUsageDialog: MatDialog,
    private extendedKeyUsageDialog: MatDialog
  ) { }

  ngOnInit() {
    this.keyUsage = new KeyUsage(true, true, true, true, true, true, true, true, true);
    this.extKeyUsage = new ExtKeyUsage(true, true, true, true, true, true, true, true, true);
    this.keyUsageDesc = "DigitalSignature, NonRepudiation, KeyEncipherment, DataEncipherment, KeyAgreement, KeyCertSign, CRLSign, EncipherOnly, DecipherOnly";
    this.extKeyUsageDesc = "ServerAuth, ClientAuth, CodeSigning, EmailProtection, TimeStamping, OCSPSigning, IpsecEndSystem, IpsecTunnel, IpsecUser";
    this.createCertificateForm = new FormGroup({
      'issuer': new FormControl(null, [Validators.required]),
      'serialNumber': new FormControl(null, [Validators.required]),
      'startDate': new FormControl({ value: null }, [Validators.required]),
      'endDate': new FormControl({ value: null }, [Validators.required]),
      'subject': new FormControl({ value: null }, [Validators.required]),
      'signatureAlgorithm': new FormControl({ value: null }, [Validators.required]),
      'pubKeyAlgorithm': new FormControl({ value: null }, [Validators.required])
    });

    this.getSubjects();

  }

  chooseCert() {
    const dialogRef = this.signingCertDialog.open(ChooseCertificateDialogComponent, {
      width: '80vw',
      height: '90vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.signingCertificate = result.certificate;


        this.createCertificateForm.patchValue({
          "issuer": this.signingCertificate.issuerCommonName
        });

        this.keyUsage.fromStringArrayResolve(this.signingCertificate.keyUsage);
      }
    });
  }

  getSubjects() {
    this.userService.getUsers().subscribe({

      next: (result) => {
        this.subjects = result;
      },
      error: data => {
        if (data.error && typeof data.error === "string")
          console.log(data.error);
        else
          console.log("Nisu dobavljeni subjekti");
      }

    });
  }

  createCertificate() {
    console.log(this.createCertificateForm);
  }

  openSubjectDialog() {
    const dialogRef = this.dialog.open(DialogCreateSubjectComponent, {
      width: '40vw',
      height: '70vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      var subject = new User(0, result.givenName, result.lastName, result.commonName, result.country, result.organization,
        result.organizationalUnit, result.locality, result.email);

      this.userService.createSubject(subject).subscribe(
        {
          next: () => {
            this.getSubjects();
          },
          error: data => {
            if (data.error && typeof data.error === "string")
              console.log(data.error);
            else
              console.log("Nije kreiran subjekat");
          }
        }
      );
    });
  }

  back() {
    this.router.navigate(['']);
  }

  keyUsageOpen() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = "250px";

    if (this.signingCertificate && this.signingCertificate.keyUsage) {
      dialogConfig.data = {
        keyUsage: this.keyUsage,
        issuerKeyUsage: this.signingCertificate.keyUsage
      };
    }else {
      dialogConfig.data = {
        keyUsage: this.keyUsage,
        issuerKeyUsage: undefined
      };
    }
    let dialogRef = this.keyUsageDialog.open(KeyUsageDialogComponent, dialogConfig).afterClosed()
      .subscribe(response => {
        if (response) {
          this.keyUsage = response.keyUsage;
          this.updateKeyUsageDesc();
        }
      });
  }

  extendedKeyUsageOpen() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = "250px";

    if (this.signingCertificate && this.signingCertificate.extendedKeyUsage) {
      dialogConfig.data = {
        extKeyUsage: this.extKeyUsage,
        issuerExtKeyUsage: this.signingCertificate.extendedKeyUsage
      };
    }else {
      dialogConfig.data = {
        extKeyUsage: this.extKeyUsage,
        issuerExtKeyUsage: undefined
      };
    }
    let dialogRef = this.extendedKeyUsageDialog.open(ExtendedKeyUsageDialogComponent, dialogConfig).afterClosed()
      .subscribe(response => {
        if (response) {
          this.extKeyUsage = response.extKeyUsage;
          this.updateExtKeyUsageDesc();
        }
      });
  }

  updateKeyUsageDesc() {
    this.keyUsageDesc = "";
    if (this.keyUsage.digitalSignature) {
      this.keyUsageDesc += "DigitalSignature, "
    }
    if (this.keyUsage.nonRepudiation) {
      this.keyUsageDesc += "NonRepudiation, "
    }
    if (this.keyUsage.keyEncipherment) {
      this.keyUsageDesc += "KeyEncipherment, "
    }
    if (this.keyUsage.dataEncipherment) {
      this.keyUsageDesc += "DataEncipherment, "
    }
    if (this.keyUsage.keyAgreement) {
      this.keyUsageDesc += "KeyAgreement, "
    }
    if (this.keyUsage.keyCertSign) {
      this.keyUsageDesc += "KeyCertSign, "
    }
    if (this.keyUsage.CRLSign) {
      this.keyUsageDesc += "CRLSign, "
    }
    if (this.keyUsage.encipherOnly) {
      this.keyUsageDesc += "EncipherOnly, "
    }
    if (this.keyUsage.decipherOnly) {
      this.keyUsageDesc += "DecipherOnly, "
    }
    this.keyUsageDesc = this.keyUsageDesc.substr(0, this.keyUsageDesc.length - 2);
  }

  updateExtKeyUsageDesc() {
    this.extKeyUsageDesc = "";
    if (this.extKeyUsage.serverAuth) {
      this.extKeyUsageDesc += "ServerAuth, "
    }
    if (this.extKeyUsage.clientAuth) {
      this.extKeyUsageDesc += "ClientAuth, "
    }
    if (this.extKeyUsage.codeSigning) {
      this.extKeyUsageDesc += "CodeSigning, "
    }
    if (this.extKeyUsage.emailProtection) {
      this.extKeyUsageDesc += "EmailProtection, "
    }
    if (this.extKeyUsage.timeStamping) {
      this.extKeyUsageDesc += "TimeStamping, "
    }
    if (this.extKeyUsage.ocspSigning) {
      this.extKeyUsageDesc += "OCSPSigning, "
    }
    if (this.extKeyUsage.ipsecEndSystem) {
      this.extKeyUsageDesc += "IpsecEndSystem, "
    }
    if (this.extKeyUsage.ipsecTunnel) {
      this.extKeyUsageDesc += "IpsecTunnel, "
    }
    if (this.extKeyUsage.ipsecUser) {
      this.extKeyUsageDesc += "IpsecUser, "
    }
    this.extKeyUsageDesc = this.extKeyUsageDesc.substr(0, this.extKeyUsageDesc.length - 2);
  }

}



