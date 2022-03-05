import { render } from '@testing-library/react';
import CharmList from "./CharmList";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <CharmList />
    </MemoryRouter>
  );
});

// nosnap