import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfoService } from './user-info.service';

describe('UserInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore}
      ]
  }));

  it('should be created', () => {
    const service: UserInfoService = TestBed.get(UserInfoService);
    expect(service).toBeTruthy();
  });
});
