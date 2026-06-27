import type { EditorOptions } from '../../src/types';
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
