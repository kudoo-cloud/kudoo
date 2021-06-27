import get from 'lodash/get';
import queryString from 'query-string';
import * as React from 'react';
import Common from './CommonTemplate';

class Welcome extends React.Component {
  _renderHTML() {
    const { location } = this.props;
    const query = queryString.parse(get(location, 'search', ''));
    return (
      <tr>
        <td align='center' valign='top'>
          <table
            width='640'
            cellSpacing='0'
            cellPadding='0'
            border='0'
            align='center'
            style={{ maxWidth: '640px', width: '100%' }}
            bgcolor='#FFFFFF'
          >
            <tbody>
              <tr>
                <td align='center' valign='top' style={{ padding: '50px' }}>
                  <table
                    width='600'
                    cellSpacing='0'
                    cellPadding='0'
                    border='0'
                    align='center'
                    style={{ maxWidth: '600px', width: '100%' }}
                  >
                    <tbody>
                      <tr>
                        <td
                          align='left'
                          valign='top'
                          style={{
                            fontFamily: "'Roboto', sans-serif",
                            paddingBottom: '10px',
                            fontSize: '25px',
                            fontWeight: 600,
                            color: '#434856',
                          }}
                        >
                          Welcome to the Kudoo family
                        </td>
                      </tr>
                      <tr>
                        <td
                          align='left'
                          valign='top'
                          style={{
                            paddingBottom: '10px',
                            color: '#434856',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '17px',
                              marginBottom: '10px',
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Hi {query.first_name} {query.last_name},
                          </div>
                          <div
                            style={{
                              fontSize: '17px',
                              marginBottom: '10px',
                              fontFamily: "'Roboto', sans-serif",
                              lineHeight: '24px',
                            }}
                          >
                            We
                            {`'`}
                            re very excited to have you onboard. We
                            {`'`}
                            ve put together a few helpful hints and tips in case
                            you get stuck at any point.
                          </div>
                          <div
                            style={{
                              fontSize: '17px',
                              marginBottom: '10px',
                              fontFamily: "'Roboto', sans-serif",
                              lineHeight: '24px',
                            }}
                          >
                            If you
                            {`'`}d like to look at the documentation, please
                            head to https://docs.kudoo.io/user/1.0/
                          </div>
                          <div
                            style={{
                              fontSize: '17px',
                              marginBottom: '10px',
                              fontFamily: "'Roboto', sans-serif",
                              lineHeight: '24px',
                            }}
                          >
                            If you have any questions or queries that can
                            {`'`}t be answered via the documentation, you can
                            log a post on our forum at
                            https://community.kudoo.io or else don
                            {`'`}t hesitate to email us at any time at
                            support@kudoo.cloud
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align='left'
                          valign='top'
                          style={{ padding: '10px 0px' }}
                        >
                          <table
                            width='350'
                            height='60'
                            cellPadding='0'
                            cellSpacing='0'
                            border='0'
                            bgcolor='#29a9db'
                            style={{ borderRadius: '200px' }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  align='center'
                                  valign='middle'
                                  style={{
                                    fontFamily: "'Roboto', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  <a
                                    href={window.location.origin}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                      color: '#ffffff',
                                      display: 'inline-block',
                                      textDecoration: 'none',
                                      lineHeight: '44px',
                                      fontSize: '15px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    Go to Kudoo web app
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );
  }

  _renderText() {
    const { location } = this.props;
    const query = queryString.parse(get(location, 'search', ''));
    return (
      <React.Fragment>
        {`
Hi ${query.first_name} ${query.last_name},

We're very excited to have you onboard. We've put together a few helpful hints and tips in case you get stuck at any point.

If you'd like to look at the documentation, please head to https://docs.kudoo.io/user/1.0/

If you have any questions or queries that can't be answered via the documentation, you can log a post on our forum at https://community.kudoo.io or else dont' hesitate to email us at any time at support@kudoo.cloud

Go to Kudoo web app
${window.location.origin}
        `}
      </React.Fragment>
    );
  }

  render() {
    const { match } = this.props;
    const type = get(match, 'params.type');
    return (
      <Common title='Welcome to Kudoo' type={type}>
        {() => {
          if (type === 'html') {
            return this._renderHTML();
          } else if (type === 'text') {
            return this._renderText();
          }
          return null;
        }}
      </Common>
    );
  }
}

export default Welcome;
