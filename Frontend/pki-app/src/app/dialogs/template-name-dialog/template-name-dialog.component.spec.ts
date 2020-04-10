import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateNameDialogComponent } from './template-name-dialog.component';

describe('TemplateNameDialogComponent', () => {
  let component: TemplateNameDialogComponent;
  let fixture: ComponentFixture<TemplateNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
