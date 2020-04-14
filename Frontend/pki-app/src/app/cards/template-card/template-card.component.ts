import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Template } from 'src/app/model/template';
import { TemplateService } from 'src/app/services/template-service/template.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { TemplateWarningDialogComponent } from 'src/app/dialogs/template-warning-dialog/template-warning-dialog.component';

@Component({
  selector: 'template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.css']
})
export class TemplateCardComponent implements OnInit {

  @Input()
  item: Template;
  @Input()
  issuerKeyUsage: string[];
  @Input()
  issuerExtKeyUsage: string[];

  @Output()
  templateChosen = new EventEmitter();
  @Output()
  templateDeleted = new EventEmitter();

  keyUsages: string;
  extendedKeyUsages: string;
  conflicting: boolean;

  constructor(
    private templateService: TemplateService,
    private toastr: ToastrService,
    private warningDialog: MatDialog
  ) { }

  ngOnInit() {
    this.conflicting = this.isConflicting();
    this.updateKeyUsage();
    this.updateExtendedKeyUsage();
  }

  chooseTemplate() {
    this.templateChosen.emit(this.item);
  }

  updateKeyUsage() {
    if (!this.item.keyUsage) {
      this.keyUsages = "Key Usage not checked"
      return;
    }
    this.keyUsages = "";
    var i = 0;
    for (; i < this.item.keyUsage.length; i++) {
      this.keyUsages += this.item.keyUsage[i] + ", ";
    }
    this.keyUsages = this.keyUsages.substr(0, this.keyUsages.length - 2);
  }

  updateExtendedKeyUsage() {
    if (!this.item.extendedKeyUsage) {
      this.extendedKeyUsages = "Extended Key Usage not checked"
      return;
    }
    this.extendedKeyUsages = "";
    var i = 0;
    for (; i < this.item.extendedKeyUsage.length; i++) {
      this.extendedKeyUsages += this.item.extendedKeyUsage[i] + ", ";
    }
    this.extendedKeyUsages = this.extendedKeyUsages.substr(0, this.extendedKeyUsages.length - 2);
  }

  delete() {
    this.templateService.deleteTemplate(this.item.id).subscribe({
      next: (result) => {
        this.templateDeleted.emit();
      },
      error: (data) => {
        if (data.error && typeof data.error === "string")
          this.toastr.error(data.error);
        else
          this.toastr.error("An error occured while deleting template!");
      }
    });
  }

  isConflicting() {
    if (this.issuerKeyUsage === undefined && this.item.keyUsage) {
      return false;
    }
    if (this.issuerExtKeyUsage === undefined && this.item.extendedKeyUsage) {
      return false;
    }
    if (!this.item.keyUsage && !this.item.extendedKeyUsage) {
      return false;
    }
    if (this.item.keyUsage) {
      for (let element of this.item.keyUsage) {
        let flag = false;
        for (let element2 of this.issuerKeyUsage) {
          if (element === element2) {
            flag = true;
            break;
          }
        }
        if (!flag)
          return true;
      }
    }
    if (this.item.extendedKeyUsage) {
      for (let element of this.item.extendedKeyUsage) {
        let flag = false;
        for (let element2 of this.issuerExtKeyUsage) {
          if (element === element2) {
            flag = true;
            break;
          }
        }
        if (!flag)
          return true;
      }
    }
    return false;
  }

  openWarning() {
    const dialogRef = this.warningDialog.open(TemplateWarningDialogComponent, {
      maxWidth: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.templateChosen.emit(this.item);
      }
    });
  }
}
