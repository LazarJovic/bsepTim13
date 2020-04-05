import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyUsageDialogComponent } from './key-usage-dialog.component';

describe('KeyUsageDialogComponent', () => {
  let component: KeyUsageDialogComponent;
  let fixture: ComponentFixture<KeyUsageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyUsageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyUsageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
