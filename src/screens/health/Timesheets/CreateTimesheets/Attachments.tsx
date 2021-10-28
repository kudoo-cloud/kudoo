import { FieldLabel, FileBlock, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import styles from './styles';

type Props = {
  actions: any;
  classes: any;
  history: any;
  allowedToEdit: any;
  attachedFiles: any;
  onUpdateAttachments: any;
};

type State = {};
class Attachments extends Component<Props, State> {
  static defaultProps = {
    deleteAttachment: () => ({}),
  };

  _removeAttachment = async (file, index) => {
    try {
      const { attachedFiles, deleteAttachment, onUpdateAttachments }: any =
        this.props;
      if (file.id) {
        // if file is already uploaded, then update db also
        await deleteAttachment({
          where: {
            id: file.id,
          },
        });
      }
      attachedFiles.splice(index, 1);
      onUpdateAttachments({ attachedFiles });
    } catch (error) {
      showToast(error.toString());
    }
  };

  render() {
    const { classes, allowedToEdit, attachedFiles, onUpdateAttachments } =
      this.props;
    let extraProp = {};
    // if there are more than one file attached then we are going to print below section in pdf
    if (attachedFiles.length <= 0) {
      extraProp = {
        'data-html2canvas-ignore': true,
      };
    }
    if (!allowedToEdit && attachedFiles.length <= 0) {
      // if weekperiod timesheet is finalised/approved that means it is not allowed to edit
      // and if there is no already attahched files then we can omit this section
      return null;
    }
    return (
      <div className={classes.attachementWrapper} {...extraProp}>
        <FieldLabel label='Attachments' />
        <Dropzone
          multiple
          className={classes.dragAreaWrapper}
          activeClassName={classes.activeDragArea}
          onDropAccepted={(file) => {
            onUpdateAttachments({
              attachedFiles: [].concat(attachedFiles, file),
            });
          }}
        >
          <div className={classes.attachementBlock}>
            <div className={classes.attachedFilesBlock}>
              {attachedFiles.map((file, index) => (
                <FileBlock
                  key={index}
                  file={
                    file instanceof File
                      ? file
                      : { ...file, name: file.fileName }
                  }
                  variant='interactive'
                  onRemoveClick={(e) => {
                    e.stopPropagation();
                    this._removeAttachment(file, index);
                  }}
                />
              ))}
            </div>
            {allowedToEdit && (
              <div className={classes.dragArea} data-html2canvas-ignore>
                <div className={classes.dragText}>
                  Drag files here or Browse
                </div>
              </div>
            )}
          </div>
        </Dropzone>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  // withDeleteAttachment(),
)(Attachments);
