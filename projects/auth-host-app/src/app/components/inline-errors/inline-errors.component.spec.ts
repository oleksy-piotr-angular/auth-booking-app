import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineErrorsComponent } from './inline-errors.component';

describe('InlineErrorsComponent', () => {
  let component: InlineErrorsComponent;
  let fixture: ComponentFixture<InlineErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineErrorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InlineErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
