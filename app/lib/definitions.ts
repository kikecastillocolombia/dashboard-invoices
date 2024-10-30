export type User = {
  id: string;
  name: string;
  password: string;
  role: 'mesero' | 'administrador' | 'cocinero' | 'cajero';
};

export type Table = {
  id: string;         // Identificador único para la mesa
  number: number;     // Número de la mesa (ejemplo: Mesa 1, Mesa 2)
  seats: number;      // Número de asientos en la mesa
  status: 'Disponible' | 'Ocupada' | 'Reservada'; // Estado actual de la mesa
};

export type TableStatus = {
  label: string;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
};

// lib/definitions.ts

export interface Order {
  id: string;
  status: string;
  date: string;
  user_id: string;
  table_id: string;
  table_number: string;
  product_names: string[];
}




export type Account = {
  id: string;
  order_id: string;
  total: number;
  status: 'pending' | 'paid';
  date: string;
};
