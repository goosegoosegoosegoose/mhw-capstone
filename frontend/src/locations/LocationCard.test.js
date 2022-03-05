import { render } from '@testing-library/react';
import LocationCard from "./LocationCard";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <LocationCard />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <LocationCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});