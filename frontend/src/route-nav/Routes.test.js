import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Routes from './Routes';

test('smoke test', () => {
  render(    
    <MemoryRouter>
      <Routes />
    </MemoryRouter>
  );
});