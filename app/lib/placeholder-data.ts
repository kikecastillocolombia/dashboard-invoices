import { Account, Order, Product, User, Table } from "./definitions";

const users: User[] = [
  {
    id: 'e7f261b1-44f7-4f38-8b43-f0c9cbe2d1d1',
    name: 'Julian Perez',
    password: 'password123',
    role: 'mesero',
  },
  {
    id: '4b4eb74d-1214-4f5b-89c3-fc84b80cd9a1',
    name: 'Maria Lopez',
    password: 'password123',
    role: 'administrador',
  },
  {
    id: 'cb8b92d4-65ed-4821-b52c-1bc9f6c476c4',
    name: 'Carlos Fernandez',
    password: 'password123',
    role: 'cocinero',
  },
  {
    id: '9b7b2372-0915-48c5-b7a7-e2f0331f6f45',
    name: 'Ana Garcia',
    password: 'password123',
    role: 'cajero',
  },
];

const tables: Table[] = [
  { id: 'table-1', number: 1, seats: 4, status: 'Disponible' },
  { id: 'table-2', number: 2, seats: 2, status: 'Ocupada' },
  { id: 'table-3', number: 3, seats: 6, status: 'Reservada' },
  { id: 'table-4', number: 4, seats: 4, status: 'Disponible' },
  { id: 'table-5', number: 5, seats: 2, status: 'Ocupada' },
];


const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Pizza Margherita',
    description: 'Pizza clásica con salsa de tomate y queso mozzarella.',
    price: 12,
    image_url: '/products/pizza-margherita.png',
  },
  {
    id: 'prod-2',
    name: 'Ensalada César',
    description: 'Lechuga romana fresca con aderezo César, crutones y parmesano.',
    price: 8,
    image_url: '/products/caesar-salad.png',
  },
  {
    id: 'prod-3',
    name: 'Espagueti a la Carbonara',
    description: 'Espagueti con salsa cremosa hecha de huevos, queso y panceta.',
    price: 15,
    image_url: '/products/spaghetti-carbonara.png',
  },
  {
    id: 'prod-4',
    name: 'Tiramisú',
    description: 'Delicioso postre italiano con sabor a café.',
    price: 6,
    image_url: '/products/tiramisu.png',
  },
  {
    id: 'prod-5',
    name: 'Limonada',
    description: 'Refrescante limonada hecha con limones frescos.',
    price: 3,
    image_url: '/products/lemonade.png',
  },
];

const orders: Order[] = [
  {
    id: 'order-1',
    user_id: users[0].id,
    table_id: tables[0].id,
    product_ids: [products[0].id, products[2].id],
    status: 'pending',
    date: '2024-10-24',
  },
  {
    id: 'order-2',
    user_id: users[0].id,
    table_id: tables[1].id,
    product_ids: [products[1].id, products[4].id],
    status: 'completed',
    date: '2024-10-24',
  },
];

const accounts: Account[] = [
  {
    id: 'account-1',
    order_id: orders[0].id,
    total: 27, 
    status: 'pending',
    date: '2024-10-24',
  },
  {
    id: 'account-2',
    order_id: orders[1].id,
    total: 11, 
    status: 'paid',
    date: '2024-10-24',
  },
];

export {accounts, orders, products, tables, users};
