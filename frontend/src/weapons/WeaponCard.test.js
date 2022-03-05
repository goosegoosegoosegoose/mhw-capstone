import { render } from '@testing-library/react';
import WeaponCard from "./WeaponCard";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <WeaponCard />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <WeaponCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});