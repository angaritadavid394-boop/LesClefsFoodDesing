// Importación de Routes desde Angular Router para definir las rutas de la aplicación
import { Routes } from '@angular/router';

// Importación de los componentes que se usarán en las rutas
import { ListadoProductosComponent } from './listado-productos/listado-productos.component'; // Componente para mostrar todos los productos
import { FormularioComponent } from './formulario/formulario.component';                     // Componente para agregar/editar productos
import { ErrorComponent } from './error/error.component';                                   // Componente para mostrar página de error 404

// Definición y exportación del arreglo de rutas de la aplicación
export const routes: Routes = [
    // Ruta por defecto (raíz): cuando se accede a localhost:4200/ se muestra el listado de productos
    {path:'', component: ListadoProductosComponent},
    
    // Ruta '/listado': también muestra el listado de productos
    // Es una ruta alternativa para acceder a la misma vista de productos
    {path:'listado', component: ListadoProductosComponent},
    
    // Ruta '/agregar': muestra el formulario vacío para crear un nuevo producto
    {path:'agregar', component: FormularioComponent},
    
    // Ruta '/editar/:llave': muestra el formulario con los datos de un producto existente
    // ':llave' es un parámetro dinámico que contiene el ID del producto a editar
    // Ejemplo: localhost:4200/editar/-Mx2kL9pQrS5tU8vW3yZ
    {path:'editar/:llave', component: FormularioComponent},
    
    // Ruta comodín '**': captura cualquier URL que no coincida con las rutas anteriores
    // Debe ser la ÚLTIMA ruta definida, ya que las rutas se evalúan en orden
    // Muestra el componente de error para páginas no encontradas (404)
    {path: '**', component: ErrorComponent}
];