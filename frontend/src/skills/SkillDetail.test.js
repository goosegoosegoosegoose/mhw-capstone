import { render } from '@testing-library/react';
import SkillDetail from "./SkillDetail";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <SkillDetail />
    </MemoryRouter>
  );
});

test('snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <SkillDetail />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});