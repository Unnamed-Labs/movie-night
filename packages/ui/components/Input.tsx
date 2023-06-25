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

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  helpText,
  error,
  leftIcon,
}: InputProps) => {
  const internalLabel = label ? (required ? `${label} *` : label) : '';
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="flex w-full max-w-xs flex-col gap-2 text-base text-slate-100">
      <strong>{internalLabel}</strong>
      <div className="flex flex-row items-center gap-2 rounded-lg bg-slate-700 px-3 py-4">
        {leftIcon && <span className="text-lg">{leftIcon}</span>}
        <input
          className="bg-transparent outline-none"
          data-testid="input"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleOnChange}
        />
      </div>
      {error ? (
        <span
          className="flex flex-row items-center gap-2 px-2 text-sm text-rose-300"
          data-testid="input-error"
        >
          <HiOutlineExclamationCircle className="text-2xl" />
          {error}
        </span>
      ) : (
        helpText && (
          <span
            className="px-2 text-sm"
            data-testid="input-help-text"
          >
            {helpText}
          </span>
        )
      )}
    </label>
  );
};

export default Input;
