import { render } from '@testing-library/react';
import SkillList from "./SkillList";
import { MemoryRouter } from 'react-router-dom';

test('smoke test', () => {
  render(
    <MemoryRouter>
      <SkillList />
    </MemoryRouter>
  );
});

// nosnap