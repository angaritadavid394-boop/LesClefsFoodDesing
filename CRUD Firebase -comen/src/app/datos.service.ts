// Importación de módulos necesarios de Angular
import { HttpClient } from '@angular/common/http';  // Para realizar peticiones HTTP (GET, POST, PUT, DELETE)
import { Injectable } from '@angular/core';          // Decorador que marca la clase como un servicio inyectable
import { Observable } from 'rxjs';                   // Para manejar respuestas asíncronas con Observables de RxJS
import { Producto } from './producto/producto.model'; // Importa la interfaz o modelo de datos Producto

// Decorador @Injectable que configura el servicio para ser inyectado en toda la aplicación
@Injectable({
  providedIn: 'root'  // El servicio se proporciona a nivel raíz (singleton global)
})
export class DatosService {
  // URL base de la base de datos Firebase Realtime Database
  // ===== CAMBIA ESTA URL POR LA DE TU PROPIA REALTIME DATABASE =====
  // La obtienes en: consola Firebase -> Realtime Database (arriba de la tabla).
  // Formato: https://TU-PROYECTO-default-rtdb.firebaseio.com/
  url = 'https://TU-PROYECTO-default-rtdb.firebaseio.com/';

  // Constructor que inyecta el servicio HttpClient para realizar las peticiones HTTP
  constructor(private httpClient: HttpClient){}

  // Método para obtener todos los productos desde Firebase
  // Retorna un Observable que contiene un objeto con llaves string y valores de tipo Producto
  listarProductos(): Observable<{[llave:string]: Producto}>{
    // Realiza una petición GET al endpoint 'datos.json' de Firebase
    // Firebase devuelve un objeto donde cada propiedad es un ID único y su valor es el producto
    return this.httpClient.get<{[llave:string]: Producto}>(this.url + 'datos.json');
  }

  // Método para agregar un nuevo producto a la base de datos
  // Recibe un objeto Producto y retorna un Observable con la respuesta del servidor
  agregarProducto(producto: Producto): Observable<any>{
    // Usa el método POST para que Firebase genere automáticamente un ID único
    // El producto se envía como cuerpo de la petición
    return this.httpClient.post(`${this.url}datos.json`, producto);
  }

  // Método para modificar un producto existente en la base de datos
  // Recibe el producto con los nuevos datos y la llave (ID) del producto a modificar
  modificarProducto(producto: Producto, llave: string): Observable<any>{
    // Construye la URL específica incluyendo la llave del producto
    const url_modificar = `${this.url}datos/${llave}.json`;
    // Realiza una petición PUT para actualizar completamente el producto en esa ubicación
    return this.httpClient.put(url_modificar, producto);
  }

  // Método para eliminar un producto de la base de datos
  // Recibe la llave (ID) del producto que se desea eliminar
  eliminarProducto(llave: string): Observable<any>{
    // Construye la URL específica incluyendo la llave del producto
    const url_eliminar = `${this.url}datos/${llave}.json`;
    // Realiza una petición DELETE para eliminar el producto de la base de datos
    return this.httpClient.delete(url_eliminar);
  }
}