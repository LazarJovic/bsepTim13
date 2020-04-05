import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateSubjectComponent } from './dialog-create-subject.component';

describe('DialogCreateSubjectComponent', () => {
  let component: DialogCreateSubjectComponent;
  let fixture: ComponentFixture<DialogCreateSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCreateSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
