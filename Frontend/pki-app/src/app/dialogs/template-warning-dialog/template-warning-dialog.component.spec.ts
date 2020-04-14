import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateWarningDialogComponent } from './template-warning-dialog.component';

describe('TemplateWarningDialogComponent', () => {
  let component: TemplateWarningDialogComponent;
  let fixture: ComponentFixture<TemplateWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
