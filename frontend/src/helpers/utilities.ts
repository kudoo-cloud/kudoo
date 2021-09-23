export const getDaoLogoKey = (daoId: string, ext: string) => {
  return `dao/${daoId}/logo${ext}`;
};

export const getFileExtension = (path = '') => {
  return path.substring(path.lastIndexOf('.'));
};
