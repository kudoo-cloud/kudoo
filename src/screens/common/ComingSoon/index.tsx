import { ErrorBoundary, withStyles } from '@kudoo/components';
import * as React from 'react';
import comingSoon from './coming-soon.jpg';
import Styles from './styles';
interface IProps {
  classes?: any;
}

class ComingSoon extends React.Component<IProps, {}> {
  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div>
          <img
            src={comingSoon}
            className={classes.imageSize}
            alt={'Coming Soon'}
          />
        </div>
      </ErrorBoundary>
    );
  }
}
export default withStyles<IProps>(Styles)(ComingSoon);
