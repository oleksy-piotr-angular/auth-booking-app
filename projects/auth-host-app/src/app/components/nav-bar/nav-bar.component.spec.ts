// projects/auth-host-app/src/app/components/nav-bar/nav-bar.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { TokenService } from '../../services/token/token.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '@booking-app/shared-material';

// ── Stub out routerLink and routerLinkActive as no-ops ───────────────────────
@Directive({
  selector: '[routerLink]',
  standalone: true,
})
class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
}

@Directive({
  selector: '[routerLinkActive]',
  standalone: true,
})
class RouterLinkActiveStubDirective {
  @Input('routerLinkActive') activeOptions: any;
}

// ── Minimal ActivatedRoute stub ─────────────────────────────────────────────
import { ActivatedRoute, convertToParamMap } from '@angular/router';
const activatedRouteStub = {
  snapshot: {
    url: [],
    paramMap: convertToParamMap({}),
    queryParamMap: convertToParamMap({}),
  },
  url: [],
  paramMap: convertToParamMap({}),
  queryParamMap: convertToParamMap({}),
  pathFromRoot: [],
} as unknown as ActivatedRoute;

// ── The tests ────────────────────────────────────────────────────────────────
describe('NavBarComponent', () => {
  let fixture: ComponentFixture<NavBarComponent>;
  let tokenSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // create spies
    tokenSpy = jasmine.createSpyObj('TokenService', ['getToken', 'clearToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // override NavBarComponent to use our stub directives instead of actual router ones
    TestBed.overrideComponent(NavBarComponent, {
      set: {
        imports: [
          CommonModule,
          RouterLinkStubDirective,
          RouterLinkActiveStubDirective,
          SharedMaterialModule,
        ],
      },
    });

    // configure the test bed
    TestBed.configureTestingModule({
      imports: [NavBarComponent, NoopAnimationsModule],
      providers: [
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    });

    fixture = TestBed.createComponent(NavBarComponent);
  });

  it(`should have the 'auth-host-app' title`, () => {
    const fixture = TestBed.createComponent(NavBarComponent);
    const navBar = fixture.componentInstance;
    expect(navBar.title).toEqual('auth-host-app');
  });

  it('shows Login/Register when NOT authenticated', () => {
    tokenSpy.getToken.and.returnValue(null);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const labels = buttons.map((b) => b.nativeElement.textContent.trim());
    expect(labels).toContain('Login');
    expect(labels).toContain('Register');
    expect(labels).not.toContain('Profile');
  });

  it('shows Profile/Logout when authenticated', () => {
    tokenSpy.getToken.and.returnValue('token.123');
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const labels = buttons.map((b) => b.nativeElement.textContent.trim());
    expect(labels).toContain('Profile');
    expect(labels).toContain('Logout');
  });

  it('clears token and navigates to login on logout', () => {
    tokenSpy.getToken.and.returnValue('token.123');
    fixture.detectChanges();

    const logoutBtn = fixture.debugElement
      .queryAll(By.css('button'))
      .find((b) => b.nativeElement.textContent.trim() === 'Logout')!;
    logoutBtn.triggerEventHandler('click', null);

    expect(tokenSpy.clearToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
