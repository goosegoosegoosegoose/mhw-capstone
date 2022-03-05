import { render } from '@testing-library/react';
import WeaponTypeCard from "./WeaponTypeCard";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <WeaponTypeCard />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <WeaponTypeCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});