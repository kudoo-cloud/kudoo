import idx from 'idx';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import { IDAOEntity } from 'src/store/types';

type Props = {
  onChange: (dao: any) => void;
  selectedDAO?: IDAOEntity;
};

class SelectedDAO extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
  };

  componentDidUpdate(prevProps) {
    const nextSelectedDAO = idx(this.props, (x) => x.selectedDAO.id);
    const prevSelectedDAO = idx(prevProps, (x) => x.selectedDAO.id);
    if (nextSelectedDAO !== prevSelectedDAO) {
      this.props.onChange(nextSelectedDAO);
    }
  }

  render() {
    return this.props.children;
  }
}

export default compose<Props, Props>(
  connect((state: IReduxState) => ({
    selectedDAO: idx(state, (x) => x.profile.selectedDAO),
  })),
)(SelectedDAO);
