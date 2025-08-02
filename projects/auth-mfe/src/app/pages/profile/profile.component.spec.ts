import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { AuthService, UserProfileData } from '@booking-app/auth';
import {
  createAuthServiceSpy,
  getStub,
  getOptionalStub,
  provideMockAuthService,
} from 'testing/test-helpers';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { CommonModule } from '@angular/common';
////////////////////////////////////////////////////////////////////////////////
// Stub out error & spinner components (standalone or not)
////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-form-error',
  template: '',
  standalone: true,
})
class FormErrorStub {
  @Input() message?: string;
}

@Component({
  selector: 'app-loading-spinner',
  template: '',
  standalone: true,
})
class SpinnerStub {}

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let inFlight$: Subject<UserProfileData>;

  const routeStub = {
    snapshot: { paramMap: { get: (_: string) => '42' } },
  };

  const mockUser: UserProfileData = {
    id: 42,
    email: 'bob@test.com',
    name: 'Bob',
    // any other fields your User has...
  };

  beforeEach(async () => {
    authSpy = createAuthServiceSpy();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, SharedMaterialModule],
      providers: [
        provideMockAuthService(authSpy),
        { provide: ActivatedRoute, useValue: routeStub },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(ProfileComponent, {
        set: {
          imports: [
            CommonModule,
            FormErrorStub,
            SpinnerStub,
            SharedMaterialModule,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('fetches user and renders profile on success', fakeAsync(() => {
      authSpy.getProfile.and.returnValue(of(mockUser));

      fixture.detectChanges(); // triggers ngOnInit
      tick();
      fixture.detectChanges();

      // instead of getUserId, the component should have called getProfile()
      expect(authSpy.getProfile).toHaveBeenCalled();
      expect(component.user).toEqual(mockUser);
      expect(component.error).toBeUndefined();

      const spinner = getOptionalStub<SpinnerStub>(
        fixture,
        SpinnerStub,
        'Spinner should be gone after load'
      );
      expect(spinner).toBeNull();

      // you might also verify some DOM element if your template shows name/email
      const el = fixture.nativeElement.querySelector('.profile-name');
      if (el) {
        expect(el.textContent).toContain(mockUser.name);
      }
    }));

    it('shows spinner while loading', fakeAsync(() => {
      inFlight$ = new Subject<UserProfileData>();
      authSpy.getProfile.and.returnValue(inFlight$.asObservable());

      fixture.detectChanges(); // ngOnInit
      fixture.detectChanges();

      const spinner = getStub<SpinnerStub>(
        fixture,
        SpinnerStub,
        'Spinner should appear while loading'
      );
      expect(spinner).toBeTruthy();

      inFlight$.next(mockUser);
      inFlight$.complete();
      tick();
      fixture.detectChanges();

      const gone = getOptionalStub<SpinnerStub>(
        fixture,
        SpinnerStub,
        'Spinner should disappear after succeed'
      );
      expect(gone).toBeNull();
    }));

    it('shows error on failure', fakeAsync(() => {
      const err = { message: 'Not authorized' };
      authSpy.getProfile.and.returnValue(throwError(() => err));

      fixture.detectChanges(); // ngOnInit
      tick();
      fixture.detectChanges();

      expect(component.error).toBe(err.message);

      // verify the FormError stub actually shows up
      const errCmp = getStub<FormErrorStub>(
        fixture,
        FormErrorStub,
        'FormErrorComponent missing on error'
      );
      expect(errCmp).toBeTruthy();
    }));
  });
});
