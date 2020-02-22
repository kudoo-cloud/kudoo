import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ICompanyEntity } from 'src/store/types';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import useDeepCompareEffect from './useDeepCompareEffect';

type Props = {
  onChange: Function;
  selectedCompany?: ICompanyEntity;
};

const SelectedCompany: React.FC<Props> = props => {
  const { selectedCompany, onChange, children } = props;

  useDeepCompareEffect(() => {
    if (onChange) {
      onChange(selectedCompany);
    }
  }, [selectedCompany]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default compose<Props, Props>(
  connect((state: IReduxState) => ({
    selectedCompany: idx(state, x => x.profile.selectedCompany),
  }))
)(SelectedCompany);
