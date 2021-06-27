import { ClassesKeys, Props } from './types';

export default (): StyleFnReturnType<ClassesKeys, Props> => ({
  formFields: {
    flex: 1,
    padding: '0px 20px',
    paddingBottom: 20,
  },
  gstCheckbox: {
    paddingTop: 25,
    marginTop: 12,
    marginLeft: 10,
  },
});
