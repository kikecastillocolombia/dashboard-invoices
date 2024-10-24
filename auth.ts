import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUserByName(name: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE name=${name}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Cambiar la validación para 'name' en lugar de 'email'
        const parsedCredentials = z
          .object({ name: z.string().min(3), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { name, password } = parsedCredentials.data;

          // Obtener usuario por 'name'
          const user = await getUserByName(name);
          if (!user) return null;

          // Comparar la contraseña
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
