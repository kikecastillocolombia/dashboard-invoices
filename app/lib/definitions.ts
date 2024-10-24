export type User = {
  id: string;
  name: string;
  password: string;
  role: 'mesero' | 'administrador' | 'cocinero' | 'cajero';
};

export type Table = {
  id: string;
  number: number;
  seats: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
};

export type Order = {
  id: string;
  user_id: string;
  table_id: string;
  product_ids: string[];
  status: 'pending' | 'completed';
  date: string;
};

export type Account = {
  id: string;
  order_id: string;
  total: number;
  status: 'pending' | 'paid';
  date: string;
};
