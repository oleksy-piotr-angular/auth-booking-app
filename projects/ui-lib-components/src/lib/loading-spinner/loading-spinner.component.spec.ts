import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { LoadingSpinnerComponent } from './loading-spinner.component';

import { SharedMaterialModule } from '@booking-app/shared-material';

describe('LoadingSpinnerComponent', () => {
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let component: LoadingSpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent, CommonModule, SharedMaterialModule],
      providers: [
        provideNoopAnimations(), // disable animations
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a .spinner container', () => {
    const container = fixture.debugElement.query(By.css('.spinner'));
    expect(container).not.toBeNull();
    expect(container.nativeElement).toBeInstanceOf(HTMLElement);
  });

  it('contains a <mat-spinner> inside the container', () => {
    const matSpinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(matSpinner).not.toBeNull();
  });
});
