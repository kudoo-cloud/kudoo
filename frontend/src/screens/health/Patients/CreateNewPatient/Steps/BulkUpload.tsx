import React, { Component, useState } from 'react';
import {
  withStyles,
  TextField,
  Button,
  SectionHeader,
} from '@kudoo/components';
import ReactDataSheet from 'react-datasheet';
import { compose } from 'recompose';
import { withUploadBulkPatients } from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import clone from 'lodash/clone';
import styles, { StyleKeys } from '../styles';

type Props = IComponentProps<StyleKeys> & {
  uploadBulkPatients?: Function;
};

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  value?: string | number;
  type?: 'column';
}

class BulkDataSheet extends ReactDataSheet<GridElement, number> {}

const columns = [
  {
    readOnly: true,
    disableEvents: true,
    width: '5rem',
    description: 'This cell represent row number.',
  },
  {
    value: 'Given Name',
    type: 'column',
    readOnly: true,
    disableEvents: true,
  },
  {
    value: 'Family Name',
    type: 'column',
    readOnly: true,
    disableEvents: true,
  },
  {
    value: 'Date of Birth',
    type: 'column',
    readOnly: true,
    disableEvents: true,
  },
  {
    value: 'Medicare Number',
    type: 'column',
    readOnly: true,
    disableEvents: true,
  },
  { value: 'Sex', type: 'column', readOnly: true, disableEvents: true },
  {
    readOnly: true,
    disableEvents: true,
    width: '3rem',
    description: 'This cell represent delete row button.',
  },
];

const getInitialEmptyRow = () => {
  return [
    {
      readOnly: true,
      disableEvents: true,
      description: 'This cell represent row number.',
    },
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' },
    {
      readOnly: true,
      disableEvents: true,
      description: 'This cell represent delete row button.',
    },
  ];
};

const BulkUpload: React.FC<Props> = props => {
  const { classes, theme, uploadBulkPatients } = props;
  const [data, setData] = useState([
    columns,
    getInitialEmptyRow(),
  ] as GridElement[][]);
  const [isUploading, setIsUploading] = useState(false);

  const addRow = () => {
    setData(prevData => [...prevData, getInitialEmptyRow()]);
  };

  const removeRow = index => {
    setData(prevData => {
      const newData = clone(prevData);
      newData.splice(index, 1);
      return newData;
    });
  };

  return (
    <div>
      <SectionHeader
        title='Upload Bulk Patients'
        subtitle='You can copy paste data from other excel sheets or csv files.'
        renderLeftPart={() => (
          <div className={classes.prevNextWrapper}>
            <Button
              title='Submit'
              id='next-button'
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              loading={isUploading}
              buttonColor={theme.palette.primary.color2}
              onClick={async () => {
                const grid = data;
                const arr = [];
                for (let index = 0; index < grid.length; index++) {
                  const row = grid[index];
                  const obj = {
                    givenName: row[1].value,
                    familyName: row[2].value,
                    dateOfBirth: row[3].value,
                    medicareNumber: row[4].value,
                    sex: row[5].value,
                  };
                  arr.push(obj);
                }
                setIsUploading(true);
                const res = await uploadBulkPatients({ data: arr });
                setIsUploading(false);
                if (res.success) {
                  showToast(null, 'All patients are uploaded');
                } else {
                  res.error.map(err => showToast(err));
                }
              }}
            />
          </div>
        )}
      />
      <BulkDataSheet
        data={data}
        valueRenderer={cell => cell.value}
        className={classes.dataSheet}
        valueViewer={props => {
          if (props.cell.type === 'column') {
            return (
              <div className={classes.bulkUploadColumnHeading}>
                {props.value}
              </div>
            );
          }
          if (props.col === 0) {
            // render row number
            if (props.row === 0) return null;
            return (
              <div className={classes.bulkUploadColumnHeading}>{props.row}</div>
            );
          }
          if (props.col === 6) {
            // render delete button
            if (props.row === 0) return null;
            return (
              <div className={classes.bulkUploadColumnHeading}>
                <Button
                  title={<i className='fa fa-times' />}
                  buttonColor={theme.palette.secondary.color2}
                  onClick={() => removeRow(props.row)}
                />
              </div>
            );
          }
          return <div className={classes.bulkUploadCell}>{props.value}</div>;
        }}
        dataEditor={cell => {
          return (
            <TextField
              value={cell.value}
              onChangeText={cell.onChange}
              onKeyDown={cell.onKeyDown}
            />
          );
        }}
        parsePaste={data => {
          const grid = [];
          const rows = data.split('\n');
          for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            if (row.indexOf('\t') > -1) {
              grid[index] = row.split('\t');
            } else if (row.indexOf(',') > -1) {
              grid[index] = row.split(',');
            }
          }
          return grid;
        }}
        onCellsChanged={(changes, extraData) => {
          const grid = data.map(row => [...row]);
          changes.forEach(({ row, col, value }) => {
            grid[row][col] = { ...grid[row][col], value };
          });
          if (extraData) {
            extraData.forEach(({ row, col, value }) => {
              if (!grid[row]) {
                grid[row] = getInitialEmptyRow();
              }
              grid[row][col] = { ...(grid[row][col] || {}), value };
            });
          }
          setData(grid);
        }}
      />
      <Button
        title='Add Row'
        buttonColor={theme.palette.primary.color2}
        onClick={addRow}
      />
    </div>
  );
};

export default compose(
  withStyles(styles),
  withUploadBulkPatients()
)(BulkUpload);
