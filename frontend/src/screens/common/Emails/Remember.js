import get from 'lodash/get';
import queryString from 'query-string';
import * as React from 'react';
import Common from './CommonTemplate';

class Remember extends React.Component {
  _renderHTML() {
    const { location } = this.props;
    const query = queryString.parse(get(location, 'search', ''));

    return (
      <tr>
        <td align='center' valign='top' style={{ padding: 50 }}>
          <table
            width={600}
            cellSpacing={0}
            cellPadding={0}
            border={0}
            align='center'
            style={{ maxWidth: 600, width: '100%' }}
          >
            <tbody>
              <tr>
                <td
                  align='left'
                  valign='top'
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    paddingBottom: 10,
                    fontSize: 25,
                    fontWeight: 600,
                    color: '#434856',
                  }}
                >
                  Forgot your password?
                </td>
              </tr>
              <tr>
                <td
                  align='left'
                  valign='top'
                  style={{ paddingBottom: 10, color: '#434856' }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 10,
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    Not to worry. Reset your password by selecting the button
                    below.
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 10,
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    By tapping the button below you will be taken to a form
                    where you can create a new password.
                  </div>
                </td>
              </tr>
              <tr>
                <td align='left' valign='top' style={{ padding: '10px 0px' }}>
                  <table
                    width={350}
                    height={60}
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    bgcolor='#29a9db'
                    style={{ borderRadius: 200 }}
                  >
                    <tbody>
                      <tr>
                        <td
                          align='center'
                          valign='middle'
                          style={{
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                        >
                          <a
                            href={query.token_url}
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
                            Reset Password
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
    );
  }

  _renderText() {
    const { location } = this.props;
    const query = queryString.parse(get(location, 'search', ''));
    return (
      <React.Fragment>
        {`
Forgot your password?

Not to worry. Reset your password by selecting the button below.

By select the link below you will be taken to a form where you can create a new password.

${query.token_url}
        `}
      </React.Fragment>
    );
  }

  render() {
    const { match } = this.props;
    const type = get(match, 'params.type');
    return (
      <Common title='Reset Password' type={type}>
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

export default Remember;
