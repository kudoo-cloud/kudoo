import get from 'lodash/get';
import queryString from 'query-string';
import * as React from 'react';
import Common from './CommonTemplate';

class Confirm extends React.Component {
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
                  Please verify your email
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
                    Hi {query.first_name} {query.last_name},
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 10,
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    You are almost ready to access your account.
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 10,
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    Simply click the button below to verify your email address.
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
                            Verify your email
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
Please verify your email

Hi ${query.first_name} ${query.last_name},

You are almost ready to access your account.

Simply select the link below to verify your email address.

${query.token_url}
        `}
      </React.Fragment>
    );
  }

  render() {
    const { match } = this.props;
    const type = get(match, 'params.type');
    return (
      <Common title='Verify your account' type={type}>
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

export default Confirm;
