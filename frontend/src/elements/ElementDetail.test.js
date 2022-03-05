import { render } from '@testing-library/react';
import ElementDetail from "./ElementDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <ElementDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ElementDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});