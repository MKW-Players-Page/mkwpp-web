import {
  ChangeEvent,
  createContext,
  Dispatch,
  FormEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";

import "./Form.css";

/** Methods to provide a Field element with its data from the state of the parent Form. */
export interface FormFieldAccess {
  getValue: (field: string) => string | undefined;
  setValue: (field: string, value: string) => void;
  getErrors: (field: string) => string[];
  disabled: boolean;
}

const NOT_A_FORM_CHILD_ERROR = "<Field> element must appear as a child of a <Form> element.";

/** Context to provide a Field element access to the state of the parent Form. */
export const FormContext = createContext<FormFieldAccess>({
  getValue: () => {
    throw TypeError(NOT_A_FORM_CHILD_ERROR);
  },
  setValue: () => {
    throw TypeError(NOT_A_FORM_CHILD_ERROR);
  },
  getErrors: () => {
    throw TypeError(NOT_A_FORM_CHILD_ERROR);
  },
  disabled: false,
});

/** Constraint interface to make sure state given to a Form element has the `errors` field. */
export interface FormState {
  /** Mapping of field name to error strings. `non_field_errors` is a special key which will
   * display errors globally, above all fields.
   */
  errors: { [key: string]: string[] };
  submitting: boolean;
}

export interface FormProps<T extends FormState> {
  children?: ReactNode;
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  disabled?: boolean;
  title?: string;
  submitLabel: string;
  submit: (done: () => void) => void;
}

const Form = <T extends FormState>({
  children,
  state,
  setState,
  disabled,
  title,
  submitLabel,
  submit,
}: FormProps<T>) => {
  disabled = !!disabled || state.submitting;

  const getValue = (field: string) =>
    Object.hasOwn(state, field) ? (state[field as keyof T] as string) : undefined;

  const setValue = (field: string, value: string) => {
    if (Object.hasOwn(state, field)) {
      setState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getErrors = (field: string) => state.errors[field] || [];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, submitting: true }));
    submit(() => { setState((prev) => ({ ...prev, submitting: false })); });
  };

  const errors = state.errors["non_field_errors"];

  return (
    <form className="form" onSubmit={onSubmit}>
      {title && <h1>{title}</h1>}
      {errors && <p className="field-error">{errors}</p>}
      <div className="form-fields">
        <FormContext.Provider value={{ getValue, setValue, getErrors, disabled }}>
          {children}
        </FormContext.Provider>
      </div>
      <input disabled={disabled} type="submit" value={submitLabel} />
    </form>
  );
};

export interface FieldProps {
  type: HTMLInputTypeAttribute;
  field: string;
  label: string;
  placeholder?: string;
}

export const Field = ({ type, field, label, placeholder }: FieldProps) => {
  const { getValue, setValue, getErrors, disabled } = useContext(FormContext);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(field, e.target.value);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      <p>{label}</p>
      <input
        disabled={disabled}
        type={type}
        value={getValue(field)}
        onChange={onChange}
        placeholder={placeholder}
      />
      {errors.map((error, index) => (
        <p key={index} className="field-error">{error}</p>
      ))}
    </div>
  );
};

export interface SelectFieldProps {
  options: { label: string; value: string; }[];
  field: string;
  label: string;
};

export const SelectField = ({ options, field, label }: SelectFieldProps) => {
  const { getValue, setValue, getErrors, disabled } = useContext(FormContext);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(field, e.target.value);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      <p>{label}</p>
      <select disabled={disabled} value={getValue(field)} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.map((error, index) => (
        <p key={index} className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default Form;
