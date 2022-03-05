import { render } from '@testing-library/react';
import PlusButton from "./PlusButton";

test('smoke test', () => {
  render(      
    <PlusButton />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<PlusButton />);
  expect(asFragment()).toMatchSnapshot();
});