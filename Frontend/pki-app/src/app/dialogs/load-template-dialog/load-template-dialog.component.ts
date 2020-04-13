import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { KeyUsageDialogComponent } from '../key-usage-dialog/key-usage-dialog.component';
import { TemplateService } from 'src/app/services/template-service/template.service';
import { ToastrService } from 'ngx-toastr';
import { Template } from 'src/app/model/template';

@Component({
  selector: 'app-load-template-dialog',
  templateUrl: './load-template-dialog.component.html',
  styleUrls: ['./load-template-dialog.component.css']
})
export class LoadTemplateDialogComponent implements OnInit {

  templates: Template[];
  issuerKeyUsage: string[];
  issuerExtKeyUsage: string[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KeyUsageDialogComponent>,
    private templateService: TemplateService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
      this.issuerKeyUsage = data.issuerKeyUsage;
      this.issuerExtKeyUsage = data.issuerExtKeyUsage;
    }

  ngOnInit() {
    this.getTemplates();
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(template) {
    this.dialogRef.close({ template: template });
  }

  getTemplates() {
    this.templateService.getTemplates().subscribe({
      next: (result) => {
        this.templates = result;
      },
      error: (data) => {
        if (data.error && typeof data.error === "string")
          this.toast.error(data.error);
        else
          this.toast.error("An error occured while loading templates!");
      }
    })
  }
}
