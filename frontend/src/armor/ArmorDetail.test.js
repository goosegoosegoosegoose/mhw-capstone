import { render } from '@testing-library/react';
import ArmorDetail from "./ArmorDetail"

test('smoke test', () => {
  render(      
    <ArmorDetail />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<ArmorDetail />);
  expect(asFragment()).toMatchSnapshot();
});