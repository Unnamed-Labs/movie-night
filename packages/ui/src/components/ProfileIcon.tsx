import { useState } from 'react';

export type ProfileIconProps = {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  disabled?: boolean;
  selectable?: boolean;
  'data-testid'?: string;
  onClick?: () => void;
};

export const ProfileIcon = ({
  src,
  alt,
  height = 48,
  width = 48,
  disabled,
  selectable,
  'data-testid': dataTestId = 'profile-icon',
  onClick,
}: ProfileIconProps) => {
  const [selected, setSelected] = useState(false);
  const selectableClasses = selectable ? 'hover:ui-cursor-pointer hover:ui-animate-bounce' : '';
  const disabledClasses = disabled ? 'hover:ui-cursor-not-allowed' : '';

  const handleOnProfileIconClick = () => {
    if (!disabled && selectable) {
      setSelected(!selected);

      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div
      className={`ui-relative ${selectableClasses} ${disabledClasses}`}
      style={{ width, height }}
      data-testid={dataTestId}
      onClick={handleOnProfileIconClick}
    >
      {disabled && (
        <div
          className="ui-absolute ui-left-0 ui-top-0 ui-z-10 ui-h-full ui-w-full ui-bg-slate-900 ui-opacity-50"
          data-testid={`${dataTestId}-disabled`}
        />
      )}
      {selected && (
        <div
          className="ui-absolute ui-left-0 ui-top-0 ui-z-10 ui-h-full ui-w-full ui-bg-slate-900 ui-opacity-15"
          data-testid={`${dataTestId}-selected`}
        />
      )}
      <img
        className="ui-h-full ui-w-full ui-rounded-full ui-object-cover"
        src={src}
        alt={alt}
        data-testid={`${dataTestId}-img`}
      />
    </div>
  );
};
