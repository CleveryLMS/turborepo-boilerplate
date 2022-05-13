import { render } from '@testing-library/react';

import { Avatar } from './Avatar';

describe('Avatar spec', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Avatar name={''} />);
    expect(baseElement).toBeTruthy();
  });
});
