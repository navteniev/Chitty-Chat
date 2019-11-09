import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private db: AngularFirestore) { }


  public getUserList() {
    return this.db.collection('users').snapshotChanges()
            .pipe(map(actions =>
              actions.map(obj => {
                const id = obj.payload.doc.id;
                const data = obj.payload.doc.data();
                return {id, ...data};
              })
            )
          );
  }

  public getCurrentUserInfo(userID: string) {
    return this.db.doc('users/' + userID).snapshotChanges();
  }
}
