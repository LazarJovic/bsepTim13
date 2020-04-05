import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedKeyUsageDialogComponent } from './extended-key-usage-dialog.component';

describe('ExtendedKeyUsageDialogComponent', () => {
  let component: ExtendedKeyUsageDialogComponent;
  let fixture: ComponentFixture<ExtendedKeyUsageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedKeyUsageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedKeyUsageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
