export interface Variante {
  id: number;
  nombre: string;
  precio_extra: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  variantes: Variante[];
}

export interface Categoria {
  id: number;
  nombre: string;
  productos: Producto[];
}

export interface Franquicia {
  nombre: string;
  logo: string | null;
}

export interface MenuResponse {
  franquicia: Franquicia;
  sucursal: string;
  mesa: string;
  categorias: Categoria[];
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
  variantes_seleccionadas: Variante[];
  notas: string;
  lineId: string;
}
