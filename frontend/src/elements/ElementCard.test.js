import { render } from '@testing-library/react';
import ElementCard from "./ElementCard";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <ElementCard />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ElementCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});