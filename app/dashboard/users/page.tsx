// app/users/page.tsx
import { Metadata } from 'next';
import CardUsers from '@/app/ui/users/CardUsers';

export const metadata: Metadata = {
  title: 'Dashboard/Users',
};

export default async function UsersPage() {
  // Llamada al fetch en el servidor
  
  return (
    <div>
      <CardUsers />
    </div>
  );
}
