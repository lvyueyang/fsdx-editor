import { createRoot } from 'react-dom/client';
import { Editor } from '../src/editor/editor';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Editor />);
}
