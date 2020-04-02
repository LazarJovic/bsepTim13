import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateOverviewComponent } from './certificate-overview.component';

describe('CertificateOverviewComponent', () => {
  let component: CertificateOverviewComponent;
  let fixture: ComponentFixture<CertificateOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
