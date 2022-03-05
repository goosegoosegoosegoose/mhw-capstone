import { render } from '@testing-library/react';
import WeaponDetail from "./WeaponDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <WeaponDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <WeaponDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});