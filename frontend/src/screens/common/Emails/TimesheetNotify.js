import get from 'lodash/get';
import queryString from 'query-string';
import * as React from 'react';
import Common from './CommonTemplate';

class TimesheetNotify extends React.Component {
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
                  Timesheet
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
                    Please find attached the latest timesheet from{' '}
                    {query.first_name} {query.last_name}.
                  </div>
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
Please find attached the latest timesheet from ${query.first_name} ${query.last_name}
        `}
      </React.Fragment>
    );
  }

  render() {
    const { match } = this.props;
    const type = get(match, 'params.type');
    return (
      <Common title='Timesheet Notify' type={type}>
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

export default TimesheetNotify;
