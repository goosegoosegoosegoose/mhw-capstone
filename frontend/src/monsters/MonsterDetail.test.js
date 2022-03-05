import { render } from '@testing-library/react';
import MonsterDetail from "./MonsterDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <MonsterDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <MonsterDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});