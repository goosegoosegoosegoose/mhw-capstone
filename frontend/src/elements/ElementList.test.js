import { render } from '@testing-library/react';
import ElementList from "./ElementList";

test('smoke test', () => {
  render(      
    <ElementList />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<ElementList />);
  expect(asFragment()).toMatchSnapshot();
});