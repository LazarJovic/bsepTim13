import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Template } from 'src/app/model/template';

@Component({
  selector: 'template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.css']
})
export class TemplateCardComponent implements OnInit {

  @Input()
  item: Template;
  
  @Output()
  templateChosen = new EventEmitter();

  keyUsages: string;
  extendedKeyUsages: string;

  constructor() { }

  ngOnInit() {
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
    for(; i < this.item.keyUsage.length; i++) {
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
    for(; i < this.item.extendedKeyUsage.length; i++) {
      this.extendedKeyUsages += this.item.extendedKeyUsage[i] + ", ";
    }
    this.extendedKeyUsages = this.extendedKeyUsages.substr(0, this.extendedKeyUsages.length - 2);
  }
}
