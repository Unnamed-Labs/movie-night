import React, { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled' | 'standalone';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  let buttonType = '';

  switch (variant) {
    case 'primary':
      buttonType =
        'flex rounded bg-emerald-300 min-w-[144px] justify-center px-4 items-center py-3 text-xl text-slate-700 transition-colors hover:bg-emerald-600 hover:text-white';
      break;
    case 'secondary':
      buttonType =
        'flex rounded bg-purple-300 min-w-[144px] justify-center px-4 items-center py-3 text-xl text-slate-700 transition-colors hover:bg-purple-500 hover:text-white';
      break;
    case 'disabled':
      buttonType =
        'flex rounded bg-slate-500 min-w-[144px] justify-center px-4 items-center py-3 text-xl text-slate-700';
      break;
    case 'standalone':
      buttonType = 'flex basis-4 py-3 text-xl text-white underline hover:no-underline';
      break;
  }

  return (
    <button
      className={`${buttonType}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
