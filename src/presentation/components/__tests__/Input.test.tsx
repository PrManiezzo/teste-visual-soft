import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';
import { describe, it, expect } from 'vitest';

describe('Input', () => {
  it('shows error message', () => {
    render(<Input label="Nome" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('applies phone mask for type="tel"', () => {
    render(<Input type="tel" placeholder="Telefone" />);
    const input = screen.getByPlaceholderText('Telefone') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '11999999999' } });
    expect(input.value).toBe('(11) 99999-9999');

    fireEvent.change(input, { target: { value: '1199999999' } });
    expect(input.value).toBe('(11) 9999-9999');
  });
});
