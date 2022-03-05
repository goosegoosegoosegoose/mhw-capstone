import { render } from '@testing-library/react';
import EmailForm from "./EmailForm";

test('smoke test', () => {
  render(      
    <EmailForm />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<EmailForm />);
  expect(asFragment()).toMatchSnapshot();
});