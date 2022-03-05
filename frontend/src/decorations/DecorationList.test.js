import { render } from '@testing-library/react';
import DecorationList from "./DecorationList";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <DecorationList />
    </MemoryRouter>
  );
});

// nosnap