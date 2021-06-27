import { SimpleCreatePageProps, StyleKeys } from './types';

export default (
  theme: Theme,
): StyleFnReturnType<StyleKeys, SimpleCreatePageProps> => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  sectionHeader: {
    padding: '20px 20px',
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});
