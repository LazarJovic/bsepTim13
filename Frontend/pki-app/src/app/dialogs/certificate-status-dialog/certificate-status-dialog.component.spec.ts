import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateStatusDialogComponent } from './certificate-status-dialog.component';

describe('CertificateStatusDialogComponent', () => {
  let component: CertificateStatusDialogComponent;
  let fixture: ComponentFixture<CertificateStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
