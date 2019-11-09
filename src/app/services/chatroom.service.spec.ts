import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatroomService } from './chatroom.service';

describe('ChatroomService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
        ChatroomService,
        { provide: AngularFirestore}
      ]
  }));

  it('should be created', () => {
    const service: ChatroomService = TestBed.get(ChatroomService);
    expect(service).toBeTruthy();
  });
});
