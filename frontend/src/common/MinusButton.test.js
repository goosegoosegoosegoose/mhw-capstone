import { render } from '@testing-library/react';
import MinusButton from "./MinusButton";

test('smoke test', () => {
  render(      
    <MinusButton />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<MinusButton />);
  expect(asFragment()).toMatchSnapshot();
});