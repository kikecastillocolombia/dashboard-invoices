// app/accounts/page.tsx

import CardAccounts from "@/app/ui/accounts/CardAccounts";

export default function AccountsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cuentas</h1>
      <CardAccounts />
    </div>
  );
}
