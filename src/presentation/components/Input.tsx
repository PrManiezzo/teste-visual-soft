import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({ label, error, onChange, type, name, ...props }) => {

  function maskPhone(value: string) {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      return value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      return value.replace(/(\d{0,2})/, '($1');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'tel' || name === 'phone') {
      e.target.value = maskPhone(e.target.value);
    }
    if (onChange) onChange(e);
  };

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input-field ${error ? 'error' : ''}`}
        type={type}
        name={name}
        onChange={handleChange}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};
