import { render } from '@testing-library/react';
import LocationDetail from "./LocationDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <LocationDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <LocationDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});