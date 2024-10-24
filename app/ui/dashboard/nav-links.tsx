'use client'; // Asegura que el componente sea cliente para poder usar hooks

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  Squares2X2Icon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; // Importamos clsx para clases condicionales

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Usuarios', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'Mesas', href: '/dashboard/tables', icon: Squares2X2Icon },        // Ruta para las mesas
  { name: 'Productos', href: '/dashboard/products', icon: ShoppingCartIcon }, // Ruta para los platos
  { name: 'Ordenes', href: '/dashboard/orders', icon: DocumentDuplicateIcon }, // Ruta para los pedidos
  { name: 'Cuentas', href: '/dashboard/accounts', icon: CurrencyDollarIcon },  // Ruta para las cuentas
];

export default function NavLinks() {
  const pathname = usePathname(); // Obtenemos la ruta actual

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href, // Resalta el enlace activo
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
