# Example

```javascript
  <Field
    name="ClientId"
    label="Client"
    render={ComboBoxField}
    customProps={{
      options: this.props.clients,
      isMulti: true,
      closeMenuOnSelect: true,
    }}
  />
```