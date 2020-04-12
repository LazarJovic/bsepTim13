import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeWarningDialogComponent } from './revoke-warning-dialog.component';

describe('RevokeWarningDialogComponent', () => {
  let component: RevokeWarningDialogComponent;
  let fixture: ComponentFixture<RevokeWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevokeWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
