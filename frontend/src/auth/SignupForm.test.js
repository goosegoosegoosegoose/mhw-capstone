import { render } from '@testing-library/react';
import SignupForm from "./SignupForm";

test('smoke test', () => {
  render(      
    <SignupForm />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<SignupForm />);
  expect(asFragment()).toMatchSnapshot();
});