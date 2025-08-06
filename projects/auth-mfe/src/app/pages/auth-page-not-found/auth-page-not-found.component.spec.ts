import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPageNotFoundComponent } from './auth-page-not-found.component';

describe('PageNotFoundComponent', () => {
  let component: AuthPageNotFoundComponent;
  let fixture: ComponentFixture<AuthPageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPageNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
