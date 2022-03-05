import { render } from '@testing-library/react';
import CharmDetail from "./CharmDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <CharmDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <CharmDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});