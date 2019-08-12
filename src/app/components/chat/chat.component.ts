import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent {
  mensaje = '';
  constructor(public _cs: ChatService) {
    this._cs.cargarMensajes().subscribe((mensajes: any[]) => {
      console.log(mensajes);
    } );
   }

  enviarMensaje() {
    console.log(this.mensaje);
  }

}
