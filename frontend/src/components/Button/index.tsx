import React, { ButtonHTMLAttributes, useState } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => {
  const [disabled, setDisabled] = useState(false);

  function handleButtonLoading(): void {
    setDisabled(!!loading);
  }

  return (
    <Container
      type="button"
      onClick={handleButtonLoading}
      disabled={disabled}
      {...rest}
    >
      {loading ? 'Carregando...' : children}
    </Container>
  );
};

export default Button;
