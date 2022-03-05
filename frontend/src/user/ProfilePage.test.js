import { render } from '@testing-library/react';
import ProfilePage from "./ProfilePage";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});