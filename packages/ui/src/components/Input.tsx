import { HiOutlineExclamationCircle } from 'react-icons/hi2';

export type InputProps = {
  label: string;
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  'data-testid'?: string;
  onChange: (val: string) => void;
};

export const Input = ({
  label,
  defaultValue,
  onChange,
  type = 'text',
  placeholder,
  required,
  helpText,
  error,
  leftIcon,
  'data-testid': dataTestId = 'input',
}: InputProps) => {
  const internalLabel = label ? (required ? `${label} *` : label) : '';
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="ui-flex ui-w-full ui-max-w-xs ui-flex-col ui-gap-2 ui-text-base ui-text-slate-50">
      <strong className="ui-font-raleway">{internalLabel}</strong>
      <div className="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-rounded-lg ui-bg-slate-700 ui-px-3 ui-py-4">
        {leftIcon && <span className="ui-text-lg">{leftIcon}</span>}
        <input
          className="ui-bg-transparent ui-outline-none ui-font-work-sans"
          data-testid={dataTestId}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleOnChange}
        />
      </div>
      {error ? (
        <span
          className="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-px-2 ui-text-sm ui-text-rose-300 ui-font-raleway"
          data-testid={`${dataTestId}-error`}
        >
          <HiOutlineExclamationCircle className="ui-text-2xl" />
          {error}
        </span>
      ) : (
        helpText && (
          <span
            className="ui-px-2 ui-text-sm ui-font-raleway"
            data-testid={`${dataTestId}-help-text`}
          >
            {helpText}
          </span>
        )
      )}
    </label>
  );
};
