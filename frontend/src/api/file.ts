import { Request } from './request';

export const uploadFile = (url: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return Request.call({
    url,
    method: 'put',
    data: formData,
  });
};
