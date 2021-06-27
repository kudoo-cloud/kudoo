import idx from 'idx';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import { ICompanyEntity } from 'src/store/types';

type Props = {
  onChange: (company: any) => void;
  selectedCompany?: ICompanyEntity;
};

class SelectedCompany extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
  };

  componentDidUpdate(prevProps) {
    const nextSelectedCompany = idx(this.props, (x) => x.selectedCompany.id);
    const prevSelectedCompany = idx(prevProps, (x) => x.selectedCompany.id);
    if (nextSelectedCompany !== prevSelectedCompany) {
      this.props.onChange(nextSelectedCompany);
    }
  }

  render() {
    return this.props.children;
  }
}

export default compose<Props, Props>(
  connect((state: IReduxState) => ({
    selectedCompany: idx(state, (x) => x.profile.selectedCompany),
  })),
)(SelectedCompany);
