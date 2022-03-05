import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('smoke test', () => {
  render(    
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
});

test('mounts properly', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const homeLink = getByText(/Monster Hunter World/i);
  expect(homeLink).toBeInTheDocument();
})