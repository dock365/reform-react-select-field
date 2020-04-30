import { CSSProperties } from "react";

export const labelStyle: CSSProperties = {
  padding: "5px 0",
  display: "inline-block",
};

export const selectorStyles = {
  control: (base: CSSProperties): CSSProperties => ({
    ...base,
    minHeight: "32px",
    borderRadius: "2px",
    borderColor: "rgb(161, 159, 157)",
  }),
  indicatorSeparator: (base: CSSProperties): CSSProperties => ({
    ...base,
    marginBottom: "5px",
    marginTop: "5px",
  }),
  dropdownIndicator: (base: CSSProperties): CSSProperties => ({...base, padding: "5px"}),
};
