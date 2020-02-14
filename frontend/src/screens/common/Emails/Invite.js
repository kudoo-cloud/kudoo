import * as React from 'react';
import queryString from 'query-string';
import get from 'lodash/get';
import Common from './CommonTemplate';

class Invite extends React.Component {
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
            style={{ maxWidth: 600, width: '100%' }}>
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
                  }}>
                  Company Invitation
                </td>
              </tr>
              <tr>
                <td
                  align='left'
                  valign='top'
                  style={{ paddingBottom: 10, color: '#434856' }}>
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 10,
                      fontFamily: '"Roboto", sans-serif',
                    }}>
                    {query.first_name} {query.last_name} has invited you to join{' '}
                    {query.company_name} company on the Kudoo platform.
                  </div>
                  {query.type === 'update' ? (
                    <div
                      style={{
                        fontSize: 17,
                        marginBottom: 10,
                        fontFamily: '"Roboto", sans-serif',
                      }}>
                      To simplify the process we have automatically created your
                      account for this email, so all you need to do to finalise
                      setup of your account is to join {query.company_name}{' '}
                      company.
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 17,
                        marginBottom: 10,
                        fontFamily: '"Roboto", sans-serif',
                      }}>
                      {query.type === 'update' ? (
                        <span>
                          You can do that by selecting link below and filling
                          form.
                        </span>
                      ) : (
                        <span>
                          To join {query.company_name} company select link
                          below.
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td align='left' valign='top' style={{ padding: '10px 0px' }}>
                  <table
                    width={350}
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    bgcolor='#29a9db'
                    style={{ borderRadius: 200 }}>
                    <tbody>
                      <tr>
                        <td
                          align='center'
                          valign='middle'
                          style={{
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}>
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
                            }}>
                            Accept Invitation
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
${query.first_name} ${query.last_name} has invited you to join ${
          query.company_name
        } company in Kudoo platform.
${
  query.type === 'update'
    ? `To simplify the process we have automatically created an account for this email, so you only need to finalise setup of your account to join <%= @name %>. You can do that by selecting link below and entering your details.`
    : `To join ${query.company_name} company select link below.`
}
${query.token_url}
        `}
      </React.Fragment>
    );
  }

  render() {
    const { match } = this.props;
    const type = get(match, 'params.type');
    return (
      <Common title='Accept Invitation' type={type}>
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

export default Invite;
