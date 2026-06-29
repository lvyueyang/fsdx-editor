import { expect, test } from '@rstest/core';
import { render } from '@testing-library/react';
import { Editor } from '../src/core/editor';

test('Editor should render without crashing', async () => {
  const { container } = render(<Editor />);
  expect(container.querySelector('.fsdx-editor-wrapper')).toBeTruthy();
});
