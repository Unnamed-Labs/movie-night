import React, { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'standalone';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
}) => {
  let buttonType =
    'flex rounded min-w-[144px] justify-center px-4 items-center py-3 text-xl text-slate-500';

  if (disabled) {
    buttonType += ' bg-slate-700 hover:cursor-not-allowed';
  } else {
    switch (variant) {
      case 'primary':
        buttonType += ' bg-emerald-300 transition-colors hover:bg-emerald-600 hover:text-white';
        break;
      case 'secondary':
        buttonType += ' bg-purple-300 transition-colors hover:bg-purple-500 hover:text-white';
        break;
      case 'standalone':
        buttonType = 'flex basis-4 py-3 text-xl text-white underline hover:no-underline';
        break;
    }
  }

  return (
    <button
      className={buttonType}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
