import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisiveComponent } from './decisive.component';

describe('DecisiveComponent', () => {
  let component: DecisiveComponent;
  let fixture: ComponentFixture<DecisiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
