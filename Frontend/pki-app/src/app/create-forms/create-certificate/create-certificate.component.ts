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
import { TemplateService } from 'src/app/services/template-service/template.service';
import { Template } from 'src/app/model/template';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { TemplateNameDialogComponent } from 'src/app/dialogs/template-name-dialog/template-name-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { LoadTemplateDialogComponent } from 'src/app/dialogs/load-template-dialog/load-template-dialog.component';

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

  minDate: string;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public signingCertDialog: MatDialog,
    private userService: UserService,
    private certificateService: CertificateService,
    private templateService: TemplateService,
    private keyUsageDialog: MatDialog,
    private extendedKeyUsageDialog: MatDialog,
    private templateNameDialog: MatDialog,
    private toast: ToastrService
  ) { }

  ngOnInit() {

    this.minDate = new Date(Date.now()).toISOString().split('T')[0];

    this.keyUsage = new KeyUsage(true, true, true, true, true, true, true, true, true);
    this.extKeyUsage = new ExtKeyUsage(true, true, true, true, true, true, true, true, true);
    this.keyUsageDesc = "DigitalSignature, NonRepudiation, KeyEncipherment, DataEncipherment, KeyAgreement, KeyCertSign, CRLSign, EncipherOnly, DecipherOnly";
    this.extKeyUsageDesc = "ServerAuth, ClientAuth, CodeSigning, EmailProtection, TimeStamping, OCSPSigning, IpsecEndSystem, IpsecTunnel, IpsecUser";
    this.createCertificateForm = new FormGroup({
      'issuer': new FormControl(null, [Validators.required]),
      'validFrom': new FormControl({ value: null }, [Validators.required]),
      'validTo': new FormControl({ value: null }, [Validators.required]),
      'subject': new FormControl({ value: null }, [Validators.required]),
      'signatureAlgorithm': new FormControl({ value: null }, [Validators.required]),
      'pubKeyAlgorithm': new FormControl("RSA", [Validators.required])
    });

    this.getSubjects(null);

  }

  createCertificate() {
    var keyUsages: Array<string> = this.toStringArrayKeyUsage(this.keyUsage);
    var extendedKeyUsage: Array<string> = this.toStringArrayExtKeyUsage(this.extKeyUsage);
    this.selectedSubject = this.createCertificateForm.value.subject;
    this.certificate = new CreateCertificate(null, this.signingCertificate.issuerId, this.signingCertificate.issuerIssuerEmail, this.signingCertificate.issuerEmail, this.signingCertificate.serialNum,
      this.signingCertificate.issuerCommonName, this.signingCertificate.validFrom, this.signingCertificate.validTo, this.createCertificateForm.value.validFrom, this.createCertificateForm.value.validTo,
      this.selectedSubject.id, this.selectedSubject.commonName, this.selectedSubject.email, this.createCertificateForm.value.signatureAlgorithm, this.createCertificateForm.value.pubKeyAlgorithm,
      keyUsages, extendedKeyUsage, this.keyUsageChecked, this.extendedKeyUsageChecked);

    this.certificateService.createCertificate(this.certificate).subscribe(
      {
        next: () => {
          this.toast.success("Certificate successfully created!");
          this.createCertificateForm.reset();
          this.createCertificateForm.patchValue({
            'pubKeyAlgorithm': 'RSA'
          });
        },
        error: data => {
          if (data.error && typeof data.error === "string")
            this.toast.error(data.error);
          else
            this.toast.error("Error creating certificate!");
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
      keyUsages.push("cRLSign");
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
    let tempKeyUsage = undefined;
    let tempExtKeyUsage = undefined;
    if (this.keyUsageChecked) {
      tempKeyUsage = this.toStringArrayKeyUsage(this.keyUsage);
    }
    if (this.keyUsageChecked) {
      tempExtKeyUsage = this.toStringArrayExtKeyUsage(this.extKeyUsage);
    }

    const dialogRef = this.signingCertDialog.open(ChooseCertificateDialogComponent, {
      width: '80vw',
      height: '90vh',
      data: {
        chosenKeyUsage: tempKeyUsage,
        chosenExtendedKeyUsage: tempExtKeyUsage
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.signingCertificate = result.certificate;
        this.createCertificateForm.patchValue({
          "issuer": this.signingCertificate.issuerCommonName
        });

        this.onChangeIssuerUpdateKeyUsage();
        this.checkIfEmpty();
      }
    });
  }

  getSubjects(subject: User) {
    this.userService.getUsers().subscribe({

      next: (result) => {
        this.subjects = result;
        if (subject) {
          this.createCertificateForm.patchValue({
            "subject": subject
          });
        }
      },
      error: data => {
        if (data.error && typeof data.error === "string")
          this.toast.error(data.error);
        else
          this.toast.error("Could not load subjects.");
      }

    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  openSubjectDialog() {
    const dialogRef = this.dialog.open(DialogCreateSubjectComponent, {
      width: '40vw',
      height: '70vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        let subject = new User(0, result.givenName, result.lastName, result.commonName, result.country, result.organization,
          result.organizationalUnit, result.locality, result.email, 0);

        this.userService.createSubject(subject).subscribe(
          {
            next: (data) => {
              this.toast.success("Subject created successfully!");
              this.getSubjects(data);
            },
            error: data => {
              if (data.error && typeof data.error === "string")
                this.toast.error(data.error);
              else
                this.toast.error("Could not load subjects.");
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
    } else {
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
    if (!this.signingCertificate)
      return
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

  openTemplateName() {
    if (typeof this.createCertificateForm.value.signatureAlgorithm !== "string" || typeof this.createCertificateForm.value.pubKeyAlgorithm !== "string") {
      this.toast.warning("Please select a Signature Algorithm and a Public Key Algorithm");
      return;
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = "400px";

    let dialogRef = this.keyUsageDialog.open(TemplateNameDialogComponent, dialogConfig).afterClosed()
      .subscribe(response => {
        if (response) {
          this.saveTemplate(response.name);
        }
      });

  }

  saveTemplate(name: string) {
    let tempKeyUsage: Array<string> = this.toStringArrayKeyUsage(this.keyUsage);
    let tempExtendedKeyUsage: Array<string> = this.toStringArrayExtKeyUsage(this.extKeyUsage);
    let template = new Template(0,
      this.createCertificateForm.value.signatureAlgorithm,
      this.createCertificateForm.value.pubKeyAlgorithm,
      tempKeyUsage, tempExtendedKeyUsage, name, "");
    if (!this.keyUsageChecked)
      template.keyUsage = undefined;
    if (!this.extendedKeyUsageChecked)
      template.extendedKeyUsage = undefined;
    this.templateService.saveTemplate(template).subscribe({
      next: () => {
        this.toast.success("Template saved!");
      },
      error: (data) => {
        if (data.error && typeof data.error === "string")
          this.toast.error(data.error);
        else
          this.toast.error("An error occured while saving template!");
      }
    })
  }

  openLoadTemplate() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "80vw";
    dialogConfig.height = "90vh";
    let issuerKeyUsage = undefined;
    let issuerExtKeyUsage = undefined;
    if (this.signingCertificate && this.signingCertificate.keyUsage) {
      issuerKeyUsage = this.signingCertificate.keyUsage;
    }
    if (this.signingCertificate && this.signingCertificate.extendedKeyUsage) {
      issuerExtKeyUsage = this.signingCertificate.extendedKeyUsage;
    }

    dialogConfig.data = {
      issuerKeyUsage: issuerKeyUsage,
      issuerExtKeyUsage: issuerExtKeyUsage
    };

    let dialogRef = this.keyUsageDialog.open(LoadTemplateDialogComponent, dialogConfig).afterClosed()
      .subscribe(response => {
        if (response) {
          this.createCertificateForm.patchValue({
            "signatureAlgorithm": response.template.signatureAlgorithm,
            "pubKeyAlgorithm": response.template.keyAlgorithm
          });

          this.onLoadTemplateUpdateKeyUsage(response.template);
          this.onLoadTemplateUpdateExtendedKeyUsage(response.template);
          this.onChangeIssuerUpdateKeyUsage();
          this.checkIfEmpty();
          this.toast.success(`Loaded: ${ response.template.name }`);
        }
      });
  }

  onLoadTemplateUpdateKeyUsage(template: Template) {
    if (!template.keyUsage) {
      this.keyUsageChecked = false;
      return;
    }
    this.keyUsageChecked = true;
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
      if (!template.keyUsage[i])
        break;
      if (template.keyUsage[i] === "digitalSignature") {
        this.keyUsage.digitalSignature = true;
        continue;
      }
      if (template.keyUsage[i] === "nonRepudiation") {
        this.keyUsage.nonRepudiation = true;
        continue;
      }
      if (template.keyUsage[i] === "keyEncipherment") {
        this.keyUsage.keyEncipherment = true;
        continue;
      }
      if (template.keyUsage[i] === "dataEncipherment") {
        this.keyUsage.dataEncipherment = true;
        continue;
      }
      if (template.keyUsage[i] === "keyAgreement") {
        this.keyUsage.keyAgreement = true;
        continue;
      }
      if (template.keyUsage[i] === "keyCertSign") {
        this.keyUsage.keyCertSign = true;
        continue;
      }
      if (template.keyUsage[i] === "cRLSign") {
        this.keyUsage.CRLSign = true;
        continue;
      }
      if (template.keyUsage[i] === "encipherOnly") {
        this.keyUsage.encipherOnly = true;
        continue;
      }
      if (template.keyUsage[i] === "decipherOnly") {
        this.keyUsage.decipherOnly = true;
        continue;
      }
    }
    this.updateKeyUsageDesc();
  }

  onLoadTemplateUpdateExtendedKeyUsage(template: Template) {
    if (!template.extendedKeyUsage) {
      this.extendedKeyUsageChecked = false;
      return;
    }
    this.extendedKeyUsageChecked = true;
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
      if (!template.extendedKeyUsage[i])
        break;
      if (template.extendedKeyUsage[i] === "serverAuth") {
        this.extKeyUsage.serverAuth = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "clientAuth") {
        this.extKeyUsage.clientAuth = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "codeSigning") {
        this.extKeyUsage.codeSigning = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "emailProtection") {
        this.extKeyUsage.emailProtection = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "timeStamping") {
        this.extKeyUsage.timeStamping = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "ocspSigning") {
        this.extKeyUsage.ocspSigning = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "ipsecEndSystem") {
        this.extKeyUsage.ipsecEndSystem = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "ipsecTunnel") {
        this.extKeyUsage.ipsecTunnel = true;
        continue;
      }
      if (template.extendedKeyUsage[i] === "ipsecUser") {
        this.extKeyUsage.ipsecUser = true;
        continue;
      }
    }
    this.updateExtKeyUsageDesc();
  }

  checkIfEmpty() {
    if (this.keyUsageAllFalse()) {
      this.fixNoKeyUsageSelected();
    }
    if (this.extendedKeyUsageAllFalse()) {
      this.fixNoExtendedKeyUsageSelected();
    }
  }

  
  fixNoKeyUsageSelected() {
    this.keyUsageChecked = false;
    this.keyUsage.digitalSignature = true;
    this.keyUsage.nonRepudiation = true;
    this.keyUsage.keyEncipherment = true;
    this.keyUsage.dataEncipherment = true;
    this.keyUsage.keyAgreement = true;
    this.keyUsage.keyCertSign = true;
    this.keyUsage.CRLSign = true;
    this.keyUsage.encipherOnly = true;
    this.keyUsage.decipherOnly = true;
    this.onChangeIssuerUpdateKeyUsage();
  }

  fixNoExtendedKeyUsageSelected() {
    this.extendedKeyUsageChecked = false;
    this.extKeyUsage.serverAuth = true;
    this.extKeyUsage.clientAuth = true;
    this.extKeyUsage.codeSigning = true;
    this.extKeyUsage.emailProtection = true;
    this.extKeyUsage.timeStamping = true;
    this.extKeyUsage.ocspSigning = true;
    this.extKeyUsage.ipsecEndSystem = true;
    this.extKeyUsage.ipsecTunnel = true;
    this.extKeyUsage.ipsecUser = true;
    this.onChangeIssuerUpdateKeyUsage();
  }

  public keyUsageAllFalse(): boolean {
    return !this.keyUsage.digitalSignature && !this.keyUsage.nonRepudiation && !this.keyUsage.keyEncipherment && !this.keyUsage.dataEncipherment
      && !this.keyUsage.keyAgreement && !this.keyUsage.keyCertSign && !this.keyUsage.CRLSign && !this.keyUsage.encipherOnly && !this.keyUsage.decipherOnly;
  }

  public extendedKeyUsageAllFalse(): boolean {
    return !this.extKeyUsage.serverAuth && !this.extKeyUsage.clientAuth && !this.extKeyUsage.codeSigning
      && !this.extKeyUsage.emailProtection && !this.extKeyUsage.timeStamping && !this.extKeyUsage.ocspSigning
      && !this.extKeyUsage.ipsecEndSystem && !this.extKeyUsage.ipsecTunnel && !this.extKeyUsage.ipsecUser;
  }
}



