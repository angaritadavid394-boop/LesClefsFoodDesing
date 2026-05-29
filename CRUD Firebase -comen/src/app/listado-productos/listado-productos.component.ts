import { Component } from '@angular/core';
import { ProductoComponent } from '../producto/producto.component';
import { Producto } from '../producto/producto.model';
import { FormsModule } from '@angular/forms';
import { FormularioComponent } from "../formulario/formulario.component";
import { ProductoService } from '../producto.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [ProductoComponent, FormsModule, FormularioComponent],
  templateUrl: './listado-productos.component.html',
  styleUrl: './listado-productos.component.css'
})
export class ListadoProductosComponent {

  productos: {[llave:string]: Producto} = {};
  productosSubscripcion: Subscription | null = null;

  constructor(private productoService: ProductoService,
    private router: Router
  ){}

  ngOnInit(){
   this.cargarProductos();

   // Escuchamos los cambios en la lista de productos
   this.productosSubscripcion = this.productoService.productosActualizados.subscribe((productos) => {
    this.productos = productos;
   });
  }

  cargarProductos(){
    this.productoService.listarProductos().subscribe((productos: {[llave:string]: Producto}) => {
      this.productos = productos;
      this.productoService.setProductos(productos);
    });
  }

  obtenerLlaves(): string[]{
    if(this.productos){
      return Object.keys(this.productos);
    }
    return [];
  }

  agregarProducto(){
    this.router.navigate(['agregar']);
  }

  // Recibe la llave emitida por el hijo (app-producto) mediante @Output
  // y decide la navegacion hacia el formulario de edicion.
  onEditarProducto(llave: string){
    this.router.navigate(['/editar', llave]);
  }

  ngOnDestroy(): void {
    if(this.productosSubscripcion != null){
      this.productosSubscripcion.unsubscribe();
    }
  }
}
