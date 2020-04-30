import * as React from 'react';
import { IFormFieldErrorsProps } from './IFormFieldErrorsProps';

const liStyle = {
  listStyle: "none",
  color: "rgb(168, 0, 0)",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: 1.3,
};

export const FormFieldErrors: React.SFC<IFormFieldErrorsProps> = ({errors}) => {
  if (errors && errors.length > 0) {
    return (
      <ul style={{padding: 0, margin: 0}}>
        {errors.map((error, i) => <li key={i} style={liStyle}>{error}</li>)}
      </ul>
    );
  }

  return null;
};
