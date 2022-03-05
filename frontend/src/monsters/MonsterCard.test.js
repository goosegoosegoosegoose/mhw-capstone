import { render } from '@testing-library/react';
import MonsterCard from "./MonsterCard";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <MonsterCard />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <MonsterCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});