import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { User } from 'src/app/model/user';
import { DialogCreateSubjectComponent } from '../dialog-create-subject/dialog-create-subject.component';
import { UserService } from 'src/app/services/userService/user.service';
import { KeyUsageDialogComponent } from 'src/app/dialogs/key-usage-dialog/key-usage-dialog.component';


@Component({
  selector: 'create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  createCertificateForm: FormGroup;
  keyUsageChecked: boolean;
  extendedKeyUsageChecked: boolean;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService
    private keyUsageDialog: MatDialog,
    private extendedKeyUsageDialog: MatDialog
  ) { }

  ngOnInit() {
    this.createCertificateForm = new FormGroup({
      'issuer': new FormControl(null, [Validators.required]),
      'serialNumber': new FormControl(null, [Validators.required]),
      'startDate': new FormControl({value: null}, [Validators.required]),
      'endDate': new FormControl({value: null}, [Validators.required]),
      'subject': new FormControl({value: null}, [Validators.required]),
      'signatureAlgorithm': new FormControl({value: null}, [Validators.required]),
      'pubKeyAlgorithm': new FormControl({value: null}, [Validators.required]),
      //'test': new FormControl({value: null}, null)
    });

  }

  chooseCert() {

  }

  createCertificate() {

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
              console.log("Kreiran subjekat");
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

  back() {
    this.router.navigate(['']);
  }

  keyUsageOpen() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "30vw";

    dialogConfig.data = {
      //patient: this.patient
    };
    this.keyUsageDialog.open(KeyUsageDialogComponent, dialogConfig);
  }

}



