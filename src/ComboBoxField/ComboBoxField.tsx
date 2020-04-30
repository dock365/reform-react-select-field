import * as React from 'react';
import { IComboBoxFieldState } from './IComboBoxFieldState';
import Select from 'react-select';
import { IFieldRenderProps } from '@dock365/reform';
import { FormFieldErrors } from '../FormFieldErrors/FormFieldErrors';
import { labelStyle, selectorStyles } from "./styles";

export interface IReactSelectOption {
  label: string;
  value: string | number;
}

export interface IComboBoxFieldPropsType extends IFieldRenderProps  {
  customProps: {
    options: IReactSelectOption[];
    isMulti?: boolean;
    closeMenuOnSelect?: boolean;
    isClearable?: boolean;
  };
}

class ComboBoxField extends React.Component<IComboBoxFieldPropsType, IComboBoxFieldState> {

  public static defaultProps = {
    customProps: {
      options: [],
    },
  };
  private select = React.createRef<any>();
  private unknownOption = {value: undefined, label: "unknown"};

  constructor(props: IComboBoxFieldPropsType) {
    super(props);
    this.state = {
      values: [],
    };
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  public componentDidMount() {
    if (this.props.value && this.props.customProps.options) {
      const values = this.props.customProps && this.props.customProps.isMulti ?
        this.props.value.map((id: string) => {
          return this.props.customProps.options
              .find((option: IReactSelectOption) => `${option.value}` === `${id}`) ||
            (id && this.unknownOption);
        }) :
        [
          this.props.customProps.options
            .find((option: IReactSelectOption) => `${option.value}` === `${this.props.value}`) ||
          (this.props.value && this.unknownOption),
        ];
      this.setState({
                      values,
                    });
    }
  }

  public componentDidUpdate(prevProps: IComboBoxFieldPropsType) {
    if (!this.props.value && prevProps.value) {
      this.select.current.setState({value: []});
      if (this.props.onChange)
        this.props.onChange(this.props.customProps && this.props.customProps.isMulti ? [] : null);
    } else if (
      (this.props.value && !prevProps.value) ||
      (this.props.value !== prevProps.value) ||
      (this.props.customProps.options && !prevProps.customProps.options) ||
      (this.props.customProps.options.length !== prevProps.customProps.options.length)
    ) {
      this.setState({
                      values: this.props.value && this.props.customProps && this.props.customProps.isMulti ?
                        this.props.value.map((id: number) =>
                                               this.props.customProps.options &&
                                               this.props.customProps.options
                                                 .find((option: IReactSelectOption) => option.value === id) ||
                                               (id && this.unknownOption),
                        ) :
                        [
                          this.props.customProps.options
                            .find((option: IReactSelectOption) => option.value === this.props.value) ||
                          (this.props.value && this.unknownOption),
                        ],
                    });
    }
  }

  public render(): JSX.Element {
    return (
      <div className="reformReactSelectField">
        {this.props.label && <label htmlFor="" style={labelStyle}>{this.props.label}</label>}
        <Select
          closeMenuOnSelect={this.props.customProps && this.props.customProps.closeMenuOnSelect}
          value={this.state.values}
          placeholder={this.props.placeholder}
          ref={this.select}
          isMulti={this.props.customProps && this.props.customProps.isMulti}
          options={this.props.customProps && this.props.customProps.options}
          onChange={this._onChange}
          onBlur={this._onBlur}
          isClearable={this.props.customProps && this.props.customProps.isClearable}
          isDisabled={this.props.readOnly}
          styles={selectorStyles}
        />
        <FormFieldErrors errors={this.props.errors}/>
      </div>
    );
  }

  private _onChange(values: any) {
    const ids = values && (
      this.props.customProps && this.props.customProps.isMulti ?
        values
          .map((value: IReactSelectOption) => value.value)
          .filter((value: string | number) => value !== undefined) :
        values.value
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

export default ComboBoxField;
