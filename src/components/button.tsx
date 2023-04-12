import React, { type ReactNode } from 'react';

/* interface LinkProps {
  children: ReactNode;
  variant?: 'page1' | 'page2' | 'page3' | 'page4' | 'page5' | 'page6' | 'page7';
  className?: string;
} */

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled';
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
        'bg-c flex basis-2 flex-col rounded bg-emerald-300 px-20 py-3 text-xl text-slate-700 duration-150 hover:bg-emerald-600 hover:text-white';
      break;
    case 'secondary':
      buttonType =
        'bg-c flex basis-2 flex-col rounded bg-purple-300 px-20 py-3 text-xl text-slate-700 hover:bg-purple-500 hover:text-white';
      break;
    case 'disabled':
      buttonType =
        'bg-c flex basis-2 flex-col rounded  bg-slate-500 px-20 py-3 text-xl text-slate-700';
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
