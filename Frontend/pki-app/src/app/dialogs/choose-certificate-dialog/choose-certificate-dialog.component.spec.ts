import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCertificateDialogComponent } from './choose-certificate-dialog.component';

describe('ChooseCertificateDialogComponent', () => {
  let component: ChooseCertificateDialogComponent;
  let fixture: ComponentFixture<ChooseCertificateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCertificateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCertificateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
