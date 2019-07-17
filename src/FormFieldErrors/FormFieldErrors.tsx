import * as React from 'react';
import { IFormFieldErrorsProps } from './IFormFieldErrorsProps';

const liStyle = {
  listStyle: "none",
  color: "#ff5050",
};

export const FormFieldErrors: React.SFC<IFormFieldErrorsProps> = ({ errors }) => {
  if (errors && errors.length > 0) {
    return (
      <ul style={{ padding: 0 }}>
        {errors.map((error, i) => <li key={i} style={liStyle}>{error}</li>)}
      </ul>
    );
  }
  return null;
};
