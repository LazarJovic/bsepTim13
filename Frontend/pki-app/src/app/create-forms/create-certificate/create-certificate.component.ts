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
import { CreateCertificate } from 'src/app/model/create-certificate';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';

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
  selectedSubject: User;

  certificate: CreateCertificate;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public signingCertDialog: MatDialog,
    private userService: UserService,
    private certificateService: CertificateService,
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
      'validFrom': new FormControl({ value: null }, [Validators.required]),
      'validTo': new FormControl({ value: null }, [Validators.required]),
      'subject': new FormControl({ value: null }, [Validators.required]),
      'signatureAlgorithm': new FormControl({ value: null }, [Validators.required]),
      'pubKeyAlgorithm': new FormControl({ value: null }, [Validators.required])
    });

    this.getSubjects();

  }

  createCertificate() {
    var keyUsages: Array<string> = this.toStringArrayKeyUsage(this.keyUsage);
    var extendedKeyUsage: Array<string> = this.toStringArrayExtKeyUsage(this.extKeyUsage);
    this.selectedSubject = this.createCertificateForm.value.subject;
    this.certificate = new CreateCertificate(null, this.signingCertificate.issuerId, this.signingCertificate.issuerIssuerEmail, this.signingCertificate.issuerEmail, this.signingCertificate.serialNum,
      this.signingCertificate.issuerCommonName, this.createCertificateForm.value.validFrom, this.createCertificateForm.value.validTo,
      this.selectedSubject.id, this.selectedSubject.commonName, this.selectedSubject.email, this.createCertificateForm.value.signatureAlgorithm, this.createCertificateForm.value.pubKeyAlgorithm,
      keyUsages, extendedKeyUsage);

    this.certificateService.createCertificate(this.certificate).subscribe(
      {
        next: () => {
          console.log("kreiran");
        },
        error: data => {
          if (data.error && typeof data.error === "string")
            console.log(data.error);
          else
            console.log("Nije kreiran subjekat");
        }
      }
    );
  }

  toStringArrayKeyUsage(ks: KeyUsage) {
    let keyUsages: string[] = [];
    if (ks.digitalSignature) {
      keyUsages.push("digitalSignature");
    }
    if (ks.nonRepudiation) {
      keyUsages.push("nonRepudiation");
    }
    if (ks.keyEncipherment) {
      keyUsages.push("keyEncipherment");
    }
    if (ks.dataEncipherment) {
      keyUsages.push("dataEncipherment");
    }
    if (ks.keyAgreement) {
      keyUsages.push("keyAgreement");
    }
    if (ks.keyCertSign) {
      keyUsages.push("keyCertSign");
    }
    if (ks.CRLSign) {
      keyUsages.push("CRLSign");
    }
    if (ks.encipherOnly) {
      keyUsages.push("encipherOnly");
    }
    if (ks.decipherOnly) {
      keyUsages.push("decipherOnly");
    }
    return keyUsages;
  }

  toStringArrayExtKeyUsage(eku: ExtKeyUsage) {
    let keyUsages: string[] = [];
    if (eku.serverAuth) {
        keyUsages.push("serverAuth");
    }
    if (eku.clientAuth) {
        keyUsages.push("clientAuth");
    }
    if (eku.codeSigning) {
        keyUsages.push("codeSigning");
    }
    if (eku.emailProtection) {
        keyUsages.push("emailProtection");
    }
    if (eku.timeStamping) {
        keyUsages.push("timeStamping");
    }
    if (eku.ocspSigning) {
        keyUsages.push("ocspSigning");
    }
    if (eku.ipsecEndSystem) {
        keyUsages.push("ipsecEndSystem");
    }
    if (eku.ipsecTunnel) {
        keyUsages.push("ipsecTunnel");
    }
    if (eku.ipsecUser) {
        keyUsages.push("ipsecUser");
    }
    return keyUsages;
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

        //this.keyUsage.fromStringArrayResolve(this.signingCertificate.keyUsage);
        //this.extKeyUsage.fromStringArrayResolve(this.signingCertificate.extendedKeyUsage);
        this.onChangeIssuerUpdateKeyUsage();
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

  openSubjectDialog() {
    const dialogRef = this.dialog.open(DialogCreateSubjectComponent, {
      width: '40vw',
      height: '70vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var subject = new User(0, result.givenName, result.lastName, result.commonName, result.country, result.organization,
          result.organizationalUnit, result.locality, result.email, 0);

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
      }
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
    } else {
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

  onChangeIssuerUpdateKeyUsage() {
    let temp = Object.assign({}, this.keyUsage);
    this.keyUsage.digitalSignature = false;
    this.keyUsage.nonRepudiation = false;
    this.keyUsage.keyEncipherment = false;
    this.keyUsage.dataEncipherment = false;
    this.keyUsage.keyAgreement = false;
    this.keyUsage.keyCertSign = false;
    this.keyUsage.CRLSign = false;
    this.keyUsage.encipherOnly = false;
    this.keyUsage.decipherOnly = false;

    for (let i = 0; i < 9; i++) {
        if (!this.signingCertificate.keyUsage[i])
            break;
        if (temp.digitalSignature && this.signingCertificate.keyUsage[i] === "digitalSignature") {
            this.keyUsage.digitalSignature = true;
            continue;
        }
        if (temp.nonRepudiation && this.signingCertificate.keyUsage[i] === "nonRepudiation") {
            this.keyUsage.nonRepudiation = true;
            continue;
        }
        if (temp.keyEncipherment && this.signingCertificate.keyUsage[i] === "keyEncipherment") {
            this.keyUsage.keyEncipherment = true;
            continue;
        }
        if (temp.dataEncipherment && this.signingCertificate.keyUsage[i] === "dataEncipherment") {
            this.keyUsage.dataEncipherment = true;
            continue;
        }
        if (temp.keyAgreement && this.signingCertificate.keyUsage[i] === "keyAgreement") {
            this.keyUsage.keyAgreement = true;
            continue;
        }
        if (temp.keyCertSign && this.signingCertificate.keyUsage[i] === "keyCertSign") {
            this.keyUsage.keyCertSign = true;
            continue;
        }
        if (temp.CRLSign && this.signingCertificate.keyUsage[i] === "cRLSign") {
            this.keyUsage.CRLSign = true;
            continue;
        }
        if (temp.encipherOnly && this.signingCertificate.keyUsage[i] === "encipherOnly") {
            this.keyUsage.encipherOnly = true;
            continue;
        }
        if (temp.decipherOnly && this.signingCertificate.keyUsage[i] === "decipherOnly") {
            this.keyUsage.decipherOnly = true;
            continue;
        }
    }
    this.updateKeyUsageDesc();
    //Extended key usage
    let temp2 = Object.assign({}, this.extKeyUsage);
    this.extKeyUsage.serverAuth = false;
    this.extKeyUsage.clientAuth = false;
    this.extKeyUsage.codeSigning = false;
    this.extKeyUsage.emailProtection = false;
    this.extKeyUsage.timeStamping = false;
    this.extKeyUsage.ocspSigning = false;
    this.extKeyUsage.ipsecEndSystem = false;
    this.extKeyUsage.ipsecTunnel = false;
    this.extKeyUsage.ipsecUser = false;
    for (let i = 0; i < 9; i++) {
      if (!this.signingCertificate.extendedKeyUsage[i])
          break;
      if (temp2.serverAuth && this.signingCertificate.extendedKeyUsage[i] === "serverAuth") {
          this.extKeyUsage.serverAuth = true;
          continue;
      }
      if (temp2.clientAuth && this.signingCertificate.extendedKeyUsage[i] === "clientAuth") {
          this.extKeyUsage.clientAuth = true;
          continue;
      }
      if (temp2.codeSigning && this.signingCertificate.extendedKeyUsage[i] === "codeSigning") {
          this.extKeyUsage.codeSigning = true;
          continue;
      }
      if (temp2.emailProtection && this.signingCertificate.extendedKeyUsage[i] === "emailProtection") {
          this.extKeyUsage.emailProtection = true;
          continue;
      }
      if (temp2.timeStamping && this.signingCertificate.extendedKeyUsage[i] === "timeStamping") {
          this.extKeyUsage.timeStamping = true;
          continue;
      }
      if (temp2.ocspSigning && this.signingCertificate.extendedKeyUsage[i] === "ocspSigning") {
          this.extKeyUsage.ocspSigning = true;
          continue;
      }
      if (temp2.ipsecEndSystem && this.signingCertificate.extendedKeyUsage[i] === "ipsecEndSystem") {
          this.extKeyUsage.ipsecEndSystem = true;
          continue;
      }
      if (temp2.ipsecTunnel && this.signingCertificate.extendedKeyUsage[i] === "ipsecTunnel") {
          this.extKeyUsage.ipsecTunnel = true;
          continue;
      }
      if (temp2.ipsecUser && this.signingCertificate.extendedKeyUsage[i] === "ipsecUser") {
          this.extKeyUsage.ipsecUser = true;
          continue;
      }
  }
  this.updateExtKeyUsageDesc();
}

}



