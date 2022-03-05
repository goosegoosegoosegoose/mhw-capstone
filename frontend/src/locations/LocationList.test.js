import { render } from '@testing-library/react';
import LocationList from "./LocationList";

test('smoke test', () => {
  render(      
    <LocationList />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<LocationList />);
  expect(asFragment()).toMatchSnapshot();
});