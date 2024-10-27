import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'delete'; // Variantes que desees manejar
  size?: 'icon' | 'small' | 'medium' | 'large'; // Tamaños que desees manejar
}

export function Button({ children, className, variant = 'default', size = 'medium', ...rest }: ButtonProps) {
  const baseStyles = 'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  
  // Define estilos específicos para variantes
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600',
    delete: 'bg-red-500 text-white hover:bg-red-400 active:bg-red-600', // Botón eliminar (rojo opaco)
  };
  

  // Define estilos específicos para tamaños
  const sizeStyles = {
    icon: 'h-8 w-8',
    small: 'h-8 px-2 text-xs',
    medium: 'h-10 px-4 text-sm',
    large: 'h-12 px-6 text-lg',
  };

  return (
    <button
      {...rest}
      className={clsx(
        baseStyles,
        variantStyles[variant], // Aplica estilos de variante
        sizeStyles[size],       // Aplica estilos de tamaño
        className,
      )}
    >
      {children}
    </button>
  );
}
