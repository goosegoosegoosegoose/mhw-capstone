import { render } from '@testing-library/react';
import MonsterList from "./MonsterList";

test('smoke test', () => {
  render(      
    <MonsterList />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<MonsterList />);
  expect(asFragment()).toMatchSnapshot();
});