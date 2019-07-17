import * as React from 'react';
import { IComboBoxFieldState } from './IComboBoxFieldState';
import Select from 'react-select';
import { IFieldRenderProps } from '@dock365/reform';
import { FormFieldErrors } from '../FormFieldErrors/FormFieldErrors';

export interface IReactSelectOption {
  label: string;
  value: string | number;
}

export type propsType = IFieldRenderProps & {
  customProps: {
    options: IReactSelectOption[];
    isMulti?: boolean;
    closeMenuOnSelect?: boolean;
  }
};

class ComboBoxField extends React.Component<propsType, IComboBoxFieldState> {
  private select = React.createRef<any>();
  constructor(props: propsType) {
    super(props);
    this.state = {
      values: [],
    };
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  public componentDidMount() {
    if (this.props.value && this.props.customProps.options) {
      this.setState({
        values: this.props.value.map((id: string) => this.props.customProps.options.find((option: IReactSelectOption) => `${option.value}` === `${id}`)),
      });
    }
  }

  public componentDidUpdate(prevProps: propsType) {
    if (!this.props.value && prevProps.value) {
      this.select.current.setState({ value: [] });
      if (this.props.onChange)
        this.props.onChange(this.props.customProps && this.props.customProps.isMulti ? [] : null);
    }
    if ((this.props.value && !prevProps.value) || (this.props.customProps.options.length !== prevProps.customProps.options.length)) {
      this.setState({
        values: this.props.value && this.props.customProps && this.props.customProps.isMulti ?
          this.props.value.map((id: number) =>
            this.props.customProps.options &&
            this.props.customProps.options.find((option: IReactSelectOption) => option.value === id)
          ) :
          [this.props.customProps.options.find((option: IReactSelectOption) => option.value === this.props.value)],
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div className="reformReactSelectField">
        {this.props.label && <label htmlFor="">{this.props.label}</label>}
        <Select
          closeMenuOnSelect={this.props.customProps && this.props.customProps.closeMenuOnSelect}
          value={this.state.values}
          placeholder={this.props.placeholder}
          ref={this.select}
          isMulti={this.props.customProps && this.props.customProps.isMulti}
          options={this.props.customProps && this.props.customProps.options}
          onChange={this._onChange}
          onBlur={this._onBlur}
          isDisabled={this.props.readOnly}
        />
        <FormFieldErrors errors={this.props.errors} />
      </div>
    );
  }

  private _onChange(values: any) {
    const ids = values && (
      this.props.customProps && this.props.customProps.isMulti ?
        values.map((value: IReactSelectOption) => value.value) : values.value
    );
    this.setState({ values: this.props.customProps && this.props.customProps.isMulti ? values : [values] });
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

export default ComboBoxField;
