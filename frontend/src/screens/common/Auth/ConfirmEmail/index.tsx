import { Button, ErrorBoundary } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProfileActions from 'src/store/actions/profile';
import './index.scss';

interface IProps {
  match: any;
}

class ConfirmEmail extends React.Component<IProps, {}> {
  public _renderConfirmEmail() {
    return (
      <div>
        <div className='title'>Thank you for signing up </div>
        <Grid container justify={'center'}>
          <Grid item xs={12}>
            <div className='middle-container'>
              <img
                className='mail-sent-icon'
                src={require('@kudoo/components/build/assets/images/message-sent-icon.png')}
              />
              <div className='message-wrapper'>
                <div className='message-title'>Verify your email</div>
                <div className='message-desc'>
                  Please check your email and verfiy your account by clicking
                  the link provided.
                </div>
              </div>
              <Button
                href='/login'
                classes={{ component: 'signin-btn' }}
                isDisabled={false}
                width='100%'
                title='Back to sign in'
                applyBorderRadius
                target='_self'
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  public _renderConfirmEmailSuccess() {
    return (
      <div>
        <div className='title'>Your email has been verified!</div>
        <Grid container justify={'center'}>
          <Grid item xs={12}>
            <div className='middle-container'>
              <img
                className='mail-sent-icon'
                src={require('@kudoo/components/build/assets/images/message-sent-icon.png')}
              />
              <div className='message-wrapper'>
                <div className='message-desc'>
                  You are officially a part of the Kudoo team. <br /> Let’s get
                  started.
                </div>
              </div>
              <Button
                href='/login'
                classes={{ component: 'signin-btn' }}
                isDisabled={false}
                width='100%'
                title='Back to sign in'
                applyBorderRadius
                target='_self'
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  public _renderConfirmEmailError() {
    return (
      <div>
        <div className='title'>Link is expired or invalid.</div>
        <Grid container justify={'center'}>
          <Grid item xs={12}>
            <div className='middle-container'>
              <img
                className='mail-sent-icon'
                src={require('@kudoo/components/build/assets/images/message-sent-icon.png')}
              />
              <Button
                href='/login'
                classes={{ component: 'signin-btn' }}
                isDisabled={false}
                width='100%'
                title='Back to sign in'
                applyBorderRadius
                target='_self'
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  public render() {
    const params = this.props.match.params;
    return (
      <ErrorBoundary>
        <div className='verify-email-page'>
          {!params.status && this._renderConfirmEmail()}
          {params.status === 'success' && this._renderConfirmEmailSuccess()}
          {(params.status === 'invalid' || params.status === 'expired') &&
            this._renderConfirmEmailError()}
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...ProfileActions }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail);
