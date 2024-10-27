import { UserGroupIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardDataUsers } from "@/app/lib/data";
import {User} from '../../lib/definitions'
const iconMap = {
  users: UserGroupIcon,
};
type UserWithoutPassword = Omit<User, 'password'>;


export default async function CardUsers() {
  const { users } = await fetchCardDataUsers();

  return (
    <div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Renderizamos todos los usuarios */}
        {users.map((user: UserWithoutPassword) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

// Componente para renderizar un usuario individual
function UserCard({ user }: { user: UserWithoutPassword }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 shadow-md">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">Rol: {user.role}</p>
    </div>
  );
}

// Componente de tarjeta general
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "users";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
