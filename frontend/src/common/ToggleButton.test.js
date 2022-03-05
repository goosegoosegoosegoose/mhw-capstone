import { render } from '@testing-library/react';
import ToggleButton from "./ToggleButton";

test('smoke test', () => {
  render(      
    <ToggleButton />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<ToggleButton />);
  expect(asFragment()).toMatchSnapshot();
});