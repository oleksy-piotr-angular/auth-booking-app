// projects/_shell-app/src/app/app.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Directive } from '@angular/core';
import { AppComponent } from './app.component';

//── Stub out <app-nav-bar> and <router-outlet> ───────────────────────────────
@Directive({
  selector: 'app-nav-bar',
  standalone: true,
})
class NavBarStubDirective {}

@Directive({
  selector: 'router-outlet',
  standalone: true,
})
class RouterOutletStubDirective {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    // Replace real imports with our stubs
    TestBed.overrideComponent(AppComponent, {
      set: {
        imports: [NavBarStubDirective, RouterOutletStubDirective],
      },
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the navigation bar', () => {
    fixture.detectChanges();
    const navBarEl = fixture.nativeElement.querySelector('app-nav-bar');
    expect(navBarEl).toBeTruthy();
  });

  it('should include a router-outlet', () => {
    fixture.detectChanges();
    const outletEl = fixture.nativeElement.querySelector('router-outlet');
    expect(outletEl).toBeTruthy();
  });
});
