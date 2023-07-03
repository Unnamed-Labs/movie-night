import React, { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'standalone';
  disabled?: boolean;
  'data-testid'?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  'data-testid': dataTestId = 'button',
  onClick,
}) => {
  let buttonType =
    'ui-flex ui-rounded ui-min-w-[144px] ui-justify-center ui-px-4 ui-items-center ui-py-3';

  if (disabled) {
    buttonType += ' ui-text-slate-500 ui-bg-slate-700 hover:ui-cursor-not-allowed';
  } else {
    buttonType += ' ui-text-slate-700';

    switch (variant) {
      case 'primary':
        buttonType +=
          ' ui-bg-emerald-300 ui-transition-colors hover:ui-bg-emerald-600 hover:ui-text-white';
        break;
      case 'secondary':
        buttonType +=
          ' ui-bg-purple-300 ui-transition-colors hover:ui-bg-purple-500 hover:ui-text-white';
        break;
      case 'standalone':
        buttonType =
          'ui-flex ui-min-w-fit ui-basis-4 ui-py-3 ui-text-white ui-underline hover:ui-no-underline';
        break;
    }
  }

  return (
    <button
      className={buttonType}
      disabled={disabled}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
};