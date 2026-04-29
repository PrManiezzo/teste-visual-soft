import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => (
  <button
    className={`btn btn-${variant}`}
    {...props}
  >
    {children}
  </button>
);
