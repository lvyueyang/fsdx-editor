import type { EditorOptions } from '@fsdx/editor-react';
import {
  simulateGetAttachmentList,
  simulateGetAudioList,
  simulateGetImageList,
  simulateGetVideoList,
  simulateUpload,
} from './mock-data';

export const demoOptions: EditorOptions = {
  image: { upload: simulateUpload, getList: simulateGetImageList },
  video: { upload: simulateUpload, getList: simulateGetVideoList },
  audio: { upload: simulateUpload, getList: simulateGetAudioList },
  attachment: { upload: simulateUpload, getList: simulateGetAttachmentList },
};
