import { render } from '@testing-library/react';
import ArmorList from "./ArmorList";

test('smoke test', () => {
  render(      
    <ArmorList />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<ArmorList />);
  expect(asFragment()).toMatchSnapshot();
});