import { render } from '@testing-library/react';
import ArmorCard from "./ArmorCard";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <ArmorCard />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ArmorCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});