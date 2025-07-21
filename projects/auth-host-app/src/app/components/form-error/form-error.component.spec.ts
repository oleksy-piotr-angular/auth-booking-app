// projects/auth-host-app/src/app/shared/form-error/form-error.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { FormErrorComponent } from './form-error.component';

describe('FormErrorComponent', () => {
  let fixture: ComponentFixture<FormErrorComponent>;
  let component: FormErrorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders nothing when message is null and messages is undefined', () => {
    component.message = null;
    component.messages = undefined;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent?.trim()).toBe('');
  });

  it('renders the provided error message', () => {
    component.message = 'Server unavailable';
    component.messages = undefined;
    fixture.detectChanges();

    const msgs = fixture.debugElement.queryAll(
      By.css('.form-error-message[role="alert"]')
    );
    expect(msgs.length).toBe(1);
    expect(msgs[0].nativeElement.textContent.trim()).toBe('Server unavailable');
  });

  it('renders multiple error messages when messages input is provided', () => {
    component.message = null;
    component.messages = ['Failed to load', 'Timeout'];
    fixture.detectChanges();

    const msgs = fixture.debugElement.queryAll(
      By.css('.form-error-message[role="alert"]')
    );
    expect(msgs.length).toBe(2);
    expect(msgs.map((d) => d.nativeElement.textContent.trim())).toEqual([
      'Failed to load',
      'Timeout',
    ]);
  });

  it('deduplicates identical messages before rendering', () => {
    component.message = null;
    component.messages = [
      'Error A',
      'Error B',
      'Error A',
      'Error B',
      'Error C',
    ];
    fixture.detectChanges();

    const msgs = fixture.debugElement.queryAll(
      By.css('.form-error-message[role="alert"]')
    );
    expect(msgs.length).toBe(3);
    expect(msgs.map((d) => d.nativeElement.textContent.trim())).toEqual([
      'Error A',
      'Error B',
      'Error C',
    ]);
  });
});
