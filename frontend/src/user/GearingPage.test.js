import { render } from '@testing-library/react';
import GearingPage from "./GearingPage";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <GearingPage />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <GearingPage />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});