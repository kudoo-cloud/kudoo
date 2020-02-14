import * as React from 'react';

class Common extends React.Component {
  componentDidMount() {
    const newDoctype = document.implementation.createDocumentType(
      'html',
      '-//W3C//DTD XHTML 1.0 Strict//EN',
      'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
    );

    document.doctype.parentNode.replaceChild(newDoctype, document.doctype);
  }

  _renderHTML() {
    return (
      <html>
        <head>
          <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <title>{this.props.title}</title>
          <link
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
            rel='stylesheet'
          />
          <style
            type='text/css'
            dangerouslySetInnerHTML={{
              __html: `
              body{background-color:#F2F2F2;}
              /* CLIENT-SPECIFIC STYLES */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; }
              /* RESET STYLES */
              img { border: 0; outline: none; text-decoration: none; }
              table { border-collapse: collapse !important; }
              body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
              /* iOS BLUE LINKS */
              a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              }
              /* ANDROID CENTER FIX */
              div[style*="margin: 16px 0;"] { margin: 0 !important; }
              /* MEDIA QUERIES */
              @media all and (max-width:639px){
              .wrapper{ width:320px!important; padding: 0 !important; }
              .container{ width:300px!important;  padding: 0 !important; }
              .mobile{ width:300px!important; display:block!important; padding: 0 !important; }
              .img{ width:100% !important; height:auto !important; }
              *[class="mobileOff"] { width: 0px !important; display: none !important; }
              *[class*="mobileOn"] { display: block !important; max-height:none !important; }
              }
              `,
            }}
          />
        </head>
        <body>
          <center style={{ backgroundColor: '#f2f2f2' }}>
            <table
              width='100%'
              border='0'
              cellPadding='0'
              cellSpacing='0'
              style={{
                backgroundColor: '#f2f2f2',
                border: 0,
                borderCollapse: 'collapse',
                borderSpacing: 0,
              }}
              bgcolor='#F2F2F2'>
              <tbody>
                <tr style={{ backgroundColor: '#f2f2f2' }} bgcolor='#F2F2F2'>
                  <td align='center' valign='top'>
                    <table
                      cellSpacing='0'
                      cellPadding='0'
                      border='0'
                      align='center'
                      style={{ maxWidth: '640px', width: '100%' }}
                      bgcolor='#434855'>
                      <tbody>
                        <tr>
                          <td
                            align='center'
                            valign='top'
                            style={{ padding: '60px' }}>
                            <table
                              cellSpacing='0'
                              cellPadding='0'
                              border='0'
                              align='center'
                              style={{ maxWidth: '600px', width: '100%' }}>
                              <tbody>
                                <tr>
                                  <td
                                    align='center'
                                    valign='top'
                                    style={{ padding: '40px' }}>
                                    <img
                                      width='390'
                                      height='90'
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: 'none',
                                        display: 'block',
                                      }}
                                      border='0'
                                      className='img'
                                      alt='Kudoo Logo'
                                      src='https://marketing-image-production.s3.amazonaws.com/uploads/ef51ed3be02627dde8448fe27aeef5f517b41785b92e882d1c3b8d62e3f529fab4ee8a254df117dfc8eac4529b2eb5a410aad0c74f3abf900f2367eedbac90ab.png'
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='center'
                                    valign='top'
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                      color: 'white',
                                      fontSize: '30px',
                                    }}>
                                    Where big ideas grow
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
                <tr>
                  <td align='center' valign='top'>
                    <table
                      cellSpacing='0'
                      cellPadding='0'
                      border='0'
                      align='center'
                      style={{ maxWidth: '640px', width: '100%' }}
                      bgcolor='#2bc88f'>
                      <tbody>
                        <tr>
                          <td
                            align='center'
                            valign='top'
                            style={{ padding: '30px' }}>
                            <table
                              cellSpacing='0'
                              cellPadding='0'
                              border='0'
                              align='center'
                              style={{ maxWidth: '600px', width: '100%' }}>
                              <tbody>
                                <tr>
                                  <td
                                    width='300'
                                    align='center'
                                    valign='middle'
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                      padding: '0px',
                                      fontSize: '20px',
                                      fontWeight: 600,
                                      color: '#068c58',
                                    }}>
                                    Let’s get social
                                  </td>
                                  <td
                                    width='300'
                                    align='center'
                                    valign='top'
                                    style={{ padding: '0px' }}>
                                    <table
                                      cellSpacing='0'
                                      cellPadding='0'
                                      border='0'
                                      align='center'
                                      style={{
                                        maxWidth: '640px',
                                        width: '100%',
                                      }}>
                                      <tbody>
                                        <tr>
                                          <td align='center' valign='top'>
                                            <table
                                              cellSpacing='0'
                                              cellPadding='0'
                                              border='0'
                                              align='center'
                                              style={{
                                                maxWidth: '600px',
                                                width: '100%',
                                              }}>
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align='center'
                                                    valign='middle'
                                                    style={{
                                                      marginRight: '10px',
                                                    }}>
                                                    <a href='https://facebook.com/kudoocloud'>
                                                      <img
                                                        width='50'
                                                        height='50'
                                                        style={{
                                                          margin: 0,
                                                          padding: 0,
                                                          border: 'none',
                                                          display: 'block',
                                                        }}
                                                        border='0'
                                                        className='img'
                                                        alt='Facebook'
                                                        src='https://marketing-image-production.s3.amazonaws.com/uploads/509f36c680c892e9f8be17b8dbfa39cc42210be4fbff46c09c7ee34f1afd64eb65a5d58ec30084d4990b7233ea5f210694cbcf720e3dd668e1d7ed65b57db2c2.png'
                                                      />
                                                    </a>
                                                  </td>
                                                  <td
                                                    align='center'
                                                    valign='middle'
                                                    style={{
                                                      marginRight: '10px',
                                                    }}>
                                                    <a href='https://twitter.com/kudoocloud'>
                                                      <img
                                                        width='50'
                                                        height='50'
                                                        style={{
                                                          margin: 0,
                                                          padding: 0,
                                                          border: 'none',
                                                          display: 'block',
                                                        }}
                                                        border='0'
                                                        className='img'
                                                        alt='Twitter'
                                                        src='https://marketing-image-production.s3.amazonaws.com/uploads/3e66681928f37c0f7ac06bc8856491c57f1961966a5b8013bde548db4c2e723cfef5b7a9ffd4e0e902ff0b0907aafebbc6076e8d83318019a882c58bfeb462a1.png'
                                                      />
                                                    </a>
                                                  </td>
                                                  <td
                                                    align='center'
                                                    valign='middle'
                                                    style={{
                                                      marginRight: '10px',
                                                    }}>
                                                    <a href='https://reddit.com/r/kudoo'>
                                                      <img
                                                        width='50'
                                                        height='50'
                                                        style={{
                                                          margin: 0,
                                                          padding: 0,
                                                          border: 'none',
                                                          display: 'block',
                                                        }}
                                                        border='0'
                                                        className='img'
                                                        alt='Reddit'
                                                        src='https://marketing-image-production.s3.amazonaws.com/uploads/760cedcd4d7db65977a5369c044a1a99c65b73518cb71a7d366fd3e627afa44cb8cb9626902eebddba2945472ed55410fd3c5e629ae9c416aa0d22f45c6c1bf4.png'
                                                      />
                                                    </a>
                                                  </td>
                                                  <td
                                                    align='center'
                                                    valign='middle'
                                                    style={{
                                                      marginRight: '10px',
                                                    }}>
                                                    <a href='https://github.com/kudoocloud'>
                                                      <img
                                                        width='50'
                                                        height='50'
                                                        style={{
                                                          margin: 0,
                                                          padding: 0,
                                                          border: 'none',
                                                          display: 'block',
                                                        }}
                                                        border='0'
                                                        className='img'
                                                        alt='Github'
                                                        src='https://marketing-image-production.s3.amazonaws.com/uploads/2634fd6f39f8d5d8a95b0c54c7545e6ef349b5fab8921d2156b6356e9acd6486f5520695f52e347e85db51a7ed70948ef4269b0bc3dbe1f17b4113bb72ea036f.png'
                                                      />
                                                    </a>
                                                  </td>
                                                  <td
                                                    align='center'
                                                    valign='middle'
                                                    style={{
                                                      marginRight: '10px',
                                                    }}>
                                                    <a href='https://medium.com/kudoocloud'>
                                                      <img
                                                        width='50'
                                                        height='50'
                                                        style={{
                                                          margin: 0,
                                                          padding: 0,
                                                          border: 'none',
                                                          display: 'block',
                                                        }}
                                                        border='0'
                                                        className='img'
                                                        alt='Medium'
                                                        src='https://marketing-image-production.s3.amazonaws.com/uploads/bc84f967b9faec7a249d961614fc5b1e7b0ddf972ee9e2a0e515f6e482ef9435daf23ada4181f7f8be9bc159678e1753018b8daeba0fb88387c2ba8f9cf3acf7.png'
                                                      />
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
                      </tbody>
                    </table>
                  </td>
                </tr>
                {this.props.children()}
                <tr>
                  <td align='center' valign='top'>
                    <table
                      width='640'
                      cellSpacing='0'
                      cellPadding='0'
                      border='0'
                      align='center'
                      style={{ maxWidth: '640px', width: '100%' }}
                      bgcolor='#eaeaec'>
                      <tbody>
                        <tr>
                          <td
                            align='center'
                            valign='top'
                            style={{ padding: '50px' }}>
                            <table
                              width='600'
                              cellSpacing='0'
                              cellPadding='0'
                              border='0'
                              align='center'
                              style={{ maxWidth: '600px', width: '100%' }}>
                              <tbody>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    style={{ fontSize: '20px' }}>
                                    <div
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                        color: '#b7b7b7',
                                        marginBottom: '10px',
                                        fontSize: '20px',
                                      }}>
                                      If you have any problems please contact us
                                      at{' '}
                                    </div>
                                    <a
                                      href='mailto:support@kudoo.cloud?subject=Contact'
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                        fontSize: '20px',
                                      }}>
                                      support@kudoo.cloud
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
          </center>
        </body>
      </html>
    );
  }

  _renderText() {
    return (
      <React.Fragment>
        {`
██╗  ██╗  ██╗   ██╗  ██████╗    ██████╗    ██████╗
██║ ██╔╝  ██║   ██║  ██╔══██╗  ██╔═══██╗  ██╔═══██╗
█████╔╝   ██║   ██║  ██║  ██║  ██║   ██║  ██║   ██║
██╔═██╗   ██║   ██║  ██║  ██║  ██║   ██║  ██║   ██║
██║  ██╗  ╚██████╔╝  ██████╔╝  ╚██████╔╝  ╚██████╔╝
╚═╝  ╚═╝   ╚═════╝   ╚═════╝    ╚═════╝    ╚═════╝

Where big ideas grow

=======================================================

Let's get social

Facebook: https://facebook.com/kudoocloud
Github: https://github.com/kudoocloud
Medium: https://medium.com/kudoocloud
Reddit: https://reddit.com/r/kudoo
Twitter: https://twitter.com/kudoocloud

=======================================================
    `}
        {this.props.children()}
        {`
=======================================================

If you have any problems please contact us at

support@kudoo.cloud
        `}
      </React.Fragment>
    );
  }

  render() {
    const { type } = this.props;
    const Tag = type === 'html' ? 'div' : 'pre';
    return (
      <Tag id='email-content'>
        {type === 'html' && this._renderHTML()}
        {type === 'text' && this._renderText()}
      </Tag>
    );
  }
}

export default Common;
