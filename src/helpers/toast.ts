import { toast } from 'react-toastify';

export const showToast = (error = '', success = '') => {
  const toastType = error ? 'error' : 'success';
  const toastContent = error ? error : success;
  toast(toastContent, {
    type: toastType,
    closeButton: false,
    hideProgressBar: true,
  });
};
