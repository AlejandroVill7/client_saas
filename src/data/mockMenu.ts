import type { MenuResponse } from '@/types/menu';

export const mockMenu: MenuResponse = {
  franquicia: { nombre: "Maison Dorée", logo: null },
  sucursal: "Centro Histórico",
  mesa: "Mesa 7",
  categorias: [
    {
      id: 1,
      nombre: "Entradas",
      productos: [
        {
          id: 1, nombre: "Carpaccio de Res", descripcion: "Finas láminas de res con rúcula, parmesano y aceite de trufa negra", precio: 285,
          imagen: null,
          variantes: [
            { id: 1, nombre: "Extra Trufa", precio_extra: 120 },
            { id: 2, nombre: "Sin Parmesano", precio_extra: 0 },
          ],
        },
        {
          id: 2, nombre: "Tartar de Atún", descripcion: "Atún rojo con aguacate, sésamo tostado y salsa ponzu", precio: 320,
          imagen: null, variantes: [],
        },
        {
          id: 3, nombre: "Burrata con Higos", descripcion: "Burrata cremosa, higos caramelizados, prosciutto y reducción de balsámico", precio: 295,
          imagen: null,
          variantes: [{ id: 3, nombre: "Sin Prosciutto", precio_extra: 0 }],
        },
      ],
    },
    {
      id: 2,
      nombre: "Platos Fuertes",
      productos: [
        {
          id: 4, nombre: "Filete Mignon", descripcion: "Corte premium de 250g con puré trufado y espárragos a la parrilla", precio: 680,
          imagen: null,
          variantes: [
            { id: 4, nombre: "Término Medio", precio_extra: 0 },
            { id: 5, nombre: "Término Tres Cuartos", precio_extra: 0 },
            { id: 6, nombre: "Bien Cocido", precio_extra: 0 },
          ],
        },
        {
          id: 5, nombre: "Risotto de Hongos", descripcion: "Arroz arborio con porcini, shiitake y aceite de trufa blanca", precio: 420,
          imagen: null, variantes: [],
        },
        {
          id: 6, nombre: "Salmón en Costra", descripcion: "Salmón noruego con costra de hierbas, salsa de champagne y vegetales baby", precio: 520,
          imagen: null,
          variantes: [{ id: 7, nombre: "Sin Salsa", precio_extra: 0 }],
        },
      ],
    },
    {
      id: 3,
      nombre: "Postres",
      productos: [
        {
          id: 7, nombre: "Crème Brûlée", descripcion: "Clásica crema quemada con vainilla de Madagascar", precio: 185,
          imagen: null, variantes: [],
        },
        {
          id: 8, nombre: "Fondant de Chocolate", descripcion: "Bizcocho tibio con centro líquido de chocolate 70% cacao, helado de vainilla", precio: 220,
          imagen: null, variantes: [],
        },
      ],
    },
    {
      id: 4,
      nombre: "Bebidas",
      productos: [
        {
          id: 9, nombre: "Espresso Doble", descripcion: "Café de especialidad, tostado medio, origen Chiapas", precio: 75,
          imagen: null, variantes: [],
        },
        {
          id: 10, nombre: "Copa de Vino Tinto", descripcion: "Malbec reserva, notas de ciruela y vainilla", precio: 195,
          imagen: null, variantes: [],
        },
      ],
    },
  ],
};
