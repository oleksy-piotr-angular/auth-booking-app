// projects/auth-host-app/src/app/components/nav-bar/nav-bar.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './nav-bar.component';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { TokenService } from '@booking-app/auth';

//── Stub out routerLink & routerLinkActive ───────────────────────────────────
@Directive({ selector: '[routerLink]', standalone: true })
class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
}

@Directive({ selector: '[routerLinkActive]', standalone: true })
class RouterLinkActiveStubDirective {
  @Input('routerLinkActive') activeOptions: any;
}

// minimal ActivatedRoute stub
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

describe('NavBarComponent', () => {
  let fixture: ComponentFixture<NavBarComponent>;
  let tokenSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    tokenSpy = jasmine.createSpyObj('TokenService', ['getToken', 'clearToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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

  it('should show Login & Register with correct icons for guests', () => {
    tokenSpy.getToken.and.returnValue(null);
    fixture.detectChanges();

    const links = fixture.debugElement
      .queryAll(By.directive(RouterLinkStubDirective))
      .map((de) => de.injector.get(RouterLinkStubDirective).linkParams);
    expect(links).toEqual(
      jasmine.arrayWithExactContents(['login', 'register'])
    );

    const icons = fixture.debugElement
      .queryAll(By.css('mat-icon'))
      .map((de) => de.nativeElement.textContent.trim());
    expect(icons).toEqual(
      jasmine.arrayWithExactContents(['login', 'person_add'])
    );
  });

  it('should show Profile, Details, Search & Logout icons when authenticated', () => {
    tokenSpy.getToken.and.returnValue('token.123');
    fixture.detectChanges();

    // verify routerLink inputs
    const links = fixture.debugElement
      .queryAll(By.directive(RouterLinkStubDirective))
      .map((de) => de.injector.get(RouterLinkStubDirective).linkParams);
    expect(links).toEqual(jasmine.arrayContaining(['profile', 'search-mfe']));

    // verify icons: person, search, logout
    const icons = fixture.debugElement
      .queryAll(By.css('mat-icon'))
      .map((de) => de.nativeElement.textContent.trim());
    expect(icons).toEqual(
      jasmine.arrayContaining(['person', 'search', 'logout'])
    );
  });

  it('should clear token and navigate to login on Logout click', () => {
    tokenSpy.getToken.and.returnValue('token.123');
    fixture.detectChanges();

    const logoutBtn = fixture.debugElement
      .queryAll(By.css('button'))
      .find((b) => b.nativeElement.textContent.trim().includes('Logout'))!;
    logoutBtn.triggerEventHandler('click', null);

    expect(tokenSpy.clearToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
