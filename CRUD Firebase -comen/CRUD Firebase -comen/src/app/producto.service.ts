// Importaciones necesarias
import { Injectable } from '@angular/core';              // Decorador para crear servicios inyectables
import { Producto } from './producto/producto.model';     // Modelo/interfaz de datos Producto
import { DatosService } from './datos.service';           // Servicio que maneja las peticiones HTTP a Firebase
import { Subject } from 'rxjs';                           // Subject de RxJS para crear un flujo de eventos personalizado

@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación como singleton
})
export class ProductoService {

  // Propiedad que almacena en memoria local todos los productos
  // Es un objeto donde cada llave (string) mapea a un Producto
  productos: {[llave:string]: Producto} = {};
  
  // Subject que actúa como observable personalizado para notificar cambios en la lista de productos
  // Los componentes pueden suscribirse a este Subject para recibir actualizaciones en tiempo real
  productosActualizados = new Subject<{[llave:string]: Producto}>();

  // Inyección de dependencia del servicio DatosService para comunicación con Firebase
  constructor(private datosService: DatosService){}

  // Método que retorna el observable de productos desde Firebase
  // No modifica el estado local, solo expone el observable del servicio de datos
  listarProductos(){
    return this.datosService.listarProductos();
  }

  // Método unificado para agregar o modificar productos
  // Parámetros: 
  //   - producto: datos del producto a guardar
  //   - llave: ID del producto (null para nuevo, string para actualización existente)
  guardarProducto(producto: Producto, llave: string | null = null) {
    if(llave === null){
      // CASO AGREGAR: No hay llave, se crea un nuevo producto
      // Se suscribe al observable para ejecutar refrescarProductos cuando la operación se complete
      this.datosService.agregarProducto(producto).subscribe(() => {
        this.refrescarProductos();  // Actualiza la lista local después de agregar exitosamente
      });
    } else { 
      // CASO MODIFICAR: Hay llave, se actualiza el producto existente
      this.datosService.modificarProducto(producto, llave).subscribe(() => {
        this.refrescarProductos();  // Actualiza la lista local después de modificar exitosamente
      });
    }
  }

  // Método privado para actualizar la lista local de productos desde Firebase
  private refrescarProductos(){
    // Obtiene todos los productos del servidor
    this.listarProductos().subscribe((productos: {[llave:string]: Producto}) => {
      // Actualiza el estado local con los nuevos datos
      this.setProductos(productos);
    });
  }

  // Método para establecer los productos y notificar a los componentes suscritos
  setProductos(productos: {[llave:string]: Producto}){
    this.productos = productos;                           // Actualiza la propiedad local
    this.productosActualizados.next(this.productos);      // Emite el nuevo valor a todos los suscriptores
                                                          // Esto permite que los componentes reaccionen al cambio
  }

  // Método para obtener un producto específico por su llave (ID)
  // Retorna el producto o undefined si no existe
  getProductoByLlave(llave: string): Producto | undefined {
   return this.productos[llave];  // Accede al objeto productos usando la llave como índice
  }

  // Método para eliminar un producto por su llave (ID)
  eliminarProducto(llave: string){
   this.datosService.eliminarProducto(llave).subscribe(()=>{
    this.refrescarProductos();  // Actualiza la lista local después de eliminar exitosamente
   });
  }

}
