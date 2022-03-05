import { render } from '@testing-library/react';
import WeaponList from "./WeaponList";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <WeaponList />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <WeaponList />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});