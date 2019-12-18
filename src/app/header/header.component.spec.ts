import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../modules/material-module';
import { HeaderComponent } from './header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  // tslint:disable-next-line: prefer-const
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [ HeaderComponent ],
      providers: [
        {provide: AuthService},
        { provide: AngularFirestore, useValue: firestoreSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
