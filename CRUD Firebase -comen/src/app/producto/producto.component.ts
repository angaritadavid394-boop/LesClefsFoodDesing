import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Producto } from './producto.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  // ===== ENTRADAS (Input): el padre -> hijo =====
  // El componente padre (listado-productos) le pasa los datos del producto y su llave (ID).
  @Input() producto!: Producto;
  @Input() llave!: string;

  // ===== SALIDA (Output): el hijo -> padre =====
  // Cuando el usuario pulsa "Editar", el hijo NO navega por su cuenta:
  // emite un evento con la llave para que el padre decida qué hacer.
  @Output() editar = new EventEmitter<string>();

  editarProducto() {
    // Comunicación hijo -> padre: emitimos la llave del producto hacia el componente padre.
    this.editar.emit(this.llave);
  }
}
