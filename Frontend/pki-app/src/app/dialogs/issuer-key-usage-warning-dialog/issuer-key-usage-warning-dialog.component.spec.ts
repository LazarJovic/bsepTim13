import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerKeyUsageWarningDialogComponent } from './issuer-key-usage-warning-dialog.component';

describe('IssuerKeyUsageWarningDialogComponent', () => {
  let component: IssuerKeyUsageWarningDialogComponent;
  let fixture: ComponentFixture<IssuerKeyUsageWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuerKeyUsageWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerKeyUsageWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
