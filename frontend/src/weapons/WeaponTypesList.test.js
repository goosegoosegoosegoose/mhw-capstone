import { render } from '@testing-library/react';
import WeaponTypesList from "./WeaponTypesList";

test('smoke test', () => {
  render(      
    <WeaponTypesList />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<WeaponTypesList />);
  expect(asFragment()).toMatchSnapshot();
});