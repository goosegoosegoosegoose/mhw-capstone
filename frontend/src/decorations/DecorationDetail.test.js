import { render } from '@testing-library/react';
import DecorationDetail from "./DecorationDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <DecorationDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <DecorationDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});