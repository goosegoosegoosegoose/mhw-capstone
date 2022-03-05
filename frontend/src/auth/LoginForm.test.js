import { render } from '@testing-library/react';
import LoginForm from "./LoginForm";

test('smoke test', () => {
  render(      
    <LoginForm />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<LoginForm />);
  expect(asFragment()).toMatchSnapshot();
});