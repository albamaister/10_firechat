import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = [];
  public usuario: any = {};

  nombre = '';

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {

    // authState es el estado de la autenticacion, de esta manera se va a estar escuchando
    // cualquier cambio que sucesa en el estado de la autenticacion
    this.afAuth.authState.subscribe( user => {
      console.log('Estado del usuario: ', user );

      if (!user ) {
        return;
      }

      this.usuario.name = user.displayName;
      this.usuario.uid = user.uid;
      this.nombre = (this.usuario.name);

    });
   }


   login( proveedor: string) {
     if (proveedor === 'Google') {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
     } else {
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
     }

  }


  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }
   cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      this.chats = [];
      for (let mensaje of mensajes) {
          this.chats.unshift(mensaje);
      }
      return this.chats;
    } ));
   }

   agregarMensaje(texto: string) {
     // TODO falta el UID del usuario
      let mensaje: Mensaje = {
        nombre: this.nombre,
        mensaje: texto,
        fecha: new Date().getTime(),
        uid: this.usuario.uid
      };

      return this.itemsCollection.add(mensaje);
   }
}
