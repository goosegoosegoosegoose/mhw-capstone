import { render } from '@testing-library/react';
import SearchForm from "./SearchForm";

test('smoke test', () => {
  render(      
    <SearchForm />
  );
});

test('snapshot', () => {
  const { asFragment } = render(<SearchForm />);
  expect(asFragment()).toMatchSnapshot();
});