import { render } from '@testing-library/react';
import DecoCounter from "./DecoCounter";

test('smoke test', () => {
  render(      
    <DecoCounter />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<DecoCounter />);
  expect(asFragment()).toMatchSnapshot();
});