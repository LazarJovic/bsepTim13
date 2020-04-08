import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigningCertificateCardComponent } from './signing-certificate-card.component';

describe('SigningCertificateCardComponent', () => {
  let component: SigningCertificateCardComponent;
  let fixture: ComponentFixture<SigningCertificateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigningCertificateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigningCertificateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
