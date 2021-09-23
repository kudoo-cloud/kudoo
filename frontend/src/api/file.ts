import { Request } from './request';

export const uploadFile = (url: string, file: File) => {
  return Request.call({
    url,
    method: 'put',
    data: file,
  });
};
