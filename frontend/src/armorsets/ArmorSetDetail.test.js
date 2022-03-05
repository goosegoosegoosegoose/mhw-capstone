import { render } from '@testing-library/react';
import ArmorSetDetail from "./ArmorSetDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <ArmorSetDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ArmorSetDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});