import * as React from 'react';
import { IComboBoxFieldState } from './IComboBoxFieldState';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { IFieldRenderProps } from '@dock365/reform';
import { FormFieldErrors } from '../FormFieldErrors/FormFieldErrors';
import { InputActionMeta, OptionsType } from "react-select/src/types";

export interface IReactSelectOption {
  label: string;
  value: string | number;
}

export interface IAsyncComboBoxFieldPropType extends IFieldRenderProps {
  customProps: {
    isMulti?: boolean;
    closeMenuOnSelect?: boolean;
    isClearable?: boolean;
    loadOptions: (inputValue: string, callback: ((options: OptionsType<IReactSelectOption>) => void)) => Promise<any>;
    onInputChange: (newValue: string, actionMeta: InputActionMeta) => void;
    selectedValue?: IReactSelectOption[];
  };
}

class AsyncComboBoxField extends React.Component<IAsyncComboBoxFieldPropType, IComboBoxFieldState> {

  public static defaultProps = {
    customProps: {
      options: [],
    },
  };
  private select = React.createRef<any>();
  private unknownOption = {value: undefined, label: "unknown"};

  constructor(props: IAsyncComboBoxFieldPropType) {
    super(props);
    this.state = {
      values: this.props.customProps.selectedValue || [],
    };
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  public componentDidUpdate(prevProps: IAsyncComboBoxFieldPropType) {
    if (
      this.props.customProps.selectedValue &&
      this.props.customProps.selectedValue !== prevProps.customProps.selectedValue
    ) {
      this.setState({values: this.props.customProps.selectedValue});
    }
  }

  public render(): JSX.Element {
    return (
      <div className="reformReactSelectField">
        {this.props.label && <label htmlFor="">{this.props.label}</label>}
        <AsyncSelect
          cacheOptions
          loadOptions={this.props.customProps && this.props.customProps.loadOptions}
          onInputChange={this.props.customProps && this.props.customProps.onInputChange}

          closeMenuOnSelect={this.props.customProps && this.props.customProps.closeMenuOnSelect}
          value={this.state.values}
          placeholder={this.props.placeholder}
          ref={this.select}
          isMulti={this.props.customProps && this.props.customProps.isMulti}
          onChange={this._onChange}
          onBlur={this._onBlur}
          isClearable={this.props.customProps && this.props.customProps.isClearable}
          isDisabled={this.props.readOnly}
        />
        <FormFieldErrors errors={this.props.errors}/>
      </div>
    );
  }

  private _onChange(values: any) {
    const ids = values && (
      this.props.customProps && this.props.customProps.isMulti ?
        values.map((value: IReactSelectOption) => value.value) : values.value
    );
    this.setState({values: this.props.customProps && this.props.customProps.isMulti ? values : [values]});
    if (this.props.onChange)
      this.props.onChange(ids);
  }

  private _onBlur() {
    if (this.props.onBlur) {
      if (this.state.values) {
        if (this.props.customProps && this.props.customProps.isMulti) {
          this.props.onBlur(this.state.values.map(value => value.value));
        } else {
          const id = this.state.values[0] ? this.state.values[0].value : null;
          this.props.onBlur(id);
        }
      } else {
        if (this.props.customProps && this.props.customProps.isMulti) {
          this.props.onBlur([]);
        } else {
          this.props.onBlur(null);
        }
      }
    }
  }
}

export default AsyncComboBoxField;
