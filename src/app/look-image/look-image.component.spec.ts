import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookImageComponent } from './look-image.component';

describe('LookImageComponent', () => {
  let component: LookImageComponent;
  let fixture: ComponentFixture<LookImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
