export type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'standalone';
  disabled?: boolean;
  'data-testid'?: string;
  onClick?: () => void | Promise<void>;
};

export const Button = ({
  label,
  variant = 'primary',
  disabled = false,
  'data-testid': dataTestId = 'button',
  onClick,
}: ButtonProps) => {
  let buttonType =
    'ui-flex ui-rounded ui-min-w-[144px] ui-justify-center ui-px-4 ui-items-center ui-py-3 ui-text-base ui-font-extrabold ui-font-work-sans';

  if (disabled) {
    buttonType += ' ui-text-slate-500 ui-bg-slate-700 hover:ui-cursor-not-allowed';
  } else {
    buttonType += ' ui-text-slate-900';

    switch (variant) {
      case 'primary':
        buttonType +=
          ' ui-bg-emerald-300 ui-transition-colors hover:ui-bg-emerald-600 hover:ui-text-slate-50';
        break;
      case 'secondary':
        buttonType +=
          ' ui-bg-purple-300 ui-transition-colors hover:ui-bg-purple-500 hover:ui-text-slate-50';
        break;
      case 'standalone':
        buttonType =
          'ui-flex ui-min-w-fit ui-basis-4 ui-py-3 ui-text-base ui-text-slate-50 ui-underline ui-font-bold ui-font-work-sans hover:ui-no-underline';
        break;
    }
  }

  const handleOnClick = () => {
    if (onClick) {
      void onClick();
    }
  };

  return (
    <button
      className={buttonType}
      disabled={disabled}
      onClick={handleOnClick}
      data-testid={dataTestId}
    >
      {label.toLowerCase()}
    </button>
  );
};
