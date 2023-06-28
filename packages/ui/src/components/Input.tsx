import { HiOutlineExclamationCircle } from 'react-icons/hi2';

type InputProps = {
  label?: string;
  value: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  onChange: (val: string) => void;
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  helpText,
  error,
  leftIcon,
}) => {
  const internalLabel = label ? (required ? `${label} *` : label) : '';
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="ui-flex ui-w-full ui-max-w-xs ui-flex-col ui-gap-2 ui-text-base ui-text-slate-100">
      <strong>{internalLabel}</strong>
      <div className="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-rounded-lg ui-bg-slate-700 ui-px-3 ui-py-4">
        {leftIcon && <span className="ui-text-lg">{leftIcon}</span>}
        <input
          className="ui-bg-transparent ui-outline-none"
          data-testid="input"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleOnChange}
        />
      </div>
      {error ? (
        <span
          className="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-px-2 ui-text-sm ui-text-rose-300"
          data-testid="input-error"
        >
          <HiOutlineExclamationCircle className="ui-text-2xl" />
          {error}
        </span>
      ) : (
        helpText && (
          <span
            className="ui-px-2 ui-text-sm"
            data-testid="input-help-text"
          >
            {helpText}
          </span>
        )
      )}
    </label>
  );
};