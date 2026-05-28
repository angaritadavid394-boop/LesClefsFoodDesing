import { Component } from '@angular/core';
import { Producto } from '../producto/producto.model';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../producto.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {
  llaveProducto: string | null = null;
  descripcionInput: string = '';
  precioInput: number | null = null;

  constructor(private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    // Verificamos si debemos cargar un producto ya existente
    const llave = this.route.snapshot.paramMap.get('llave');
    if(llave){
      const producto = this.productoService.getProductoByLlave(llave);
      if(producto){
        // Si encontramos el producto lo cargamos en el formulario
        this.llaveProducto = llave;
        this.descripcionInput = producto.descripcion;
        this.precioInput = producto.precio;
      }
    }
  }
  
  guardarProducto(evento: Event){
    evento.preventDefault();
    
    //Validar que sean valores correcto
    if(this.descripcionInput.trim() === '' 
      || this.precioInput == null || this.precioInput <=0){
      console.log('Debe ingresar una descripción y un precio válidos');
      return;
    }

    const producto = new Producto(this.descripcionInput, this.precioInput);

    // Agregamos el nuevo producto usando el servicio
    this.productoService.guardarProducto(producto, this.llaveProducto);

    // Limpiamos los campos del formulario
    this.limpiarFormulario()

    // Redirigir al inicio
    this.router.navigate(['/']);

  }

  cancelar(){
    // Redirigimos al inicio
    this.router.navigate(['/']);
  }

  eliminarProducto(){
    if(this.llaveProducto !== null){
      this.productoService.eliminarProducto(this.llaveProducto);
      this.limpiarFormulario();
      this.router.navigate(['/']);
    }
  }

  limpiarFormulario(){
    this.llaveProducto = null;
    this.descripcionInput = '';
    this.precioInput = null;
  }
}
