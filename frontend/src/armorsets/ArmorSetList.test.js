import { render } from '@testing-library/react';
import ArmorSetList from "./ArmorSetList";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <ArmorSetList />
    </MemoryRouter>
  );
});

// nosnap