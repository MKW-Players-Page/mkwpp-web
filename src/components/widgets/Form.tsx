import {
  ChangeEvent, createContext, Dispatch, FormEvent, HTMLInputTypeAttribute, ReactNode,
  SetStateAction, useContext
} from 'react';

import './Form.css';

/** Methods to provide a Field element with its data from the state of the parent Form. */
interface FormFieldAccess {
  getValue: (field: string) => string | undefined;
  setValue: (field: string, value: string) => void;
  getErrors: (field: string) => string[];
};

const NOT_A_FORM_CHILD_ERROR = "<Field> element must appear as a child of a <Form> element.";

/** Context to provide a Field element access to the state of the parent Form. */
const FormContext = createContext<FormFieldAccess>({
  getValue: () => { throw TypeError(NOT_A_FORM_CHILD_ERROR); },
  setValue: () => { throw TypeError(NOT_A_FORM_CHILD_ERROR); },
  getErrors: () => { throw TypeError(NOT_A_FORM_CHILD_ERROR); },
});

/** Constraint interface to make sure state given to a Form element has the `errors` field. */
export interface FormState {
  /** Mapping of field name to error strings. `non_field_errors` is a special key which will
   * display errors globally, above all fields.
   */
  errors: { [key: string]: string[]; };
};

export interface FormProps<T extends FormState> {
  children?: ReactNode;
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  title: string;
  submitLabel: string;
  submit: () => void;
};

const Form = <T extends FormState,>({
  state,
  setState,
  children,
  title,
  submitLabel,
  submit,
}: FormProps<T>) => {
  const getValue = (field: string) => (
    Object.hasOwn(state, field) ? state[field as keyof T] as string : undefined
  );

  const setValue = (field: string, value: string) => {
    if (Object.hasOwn(state, field)) {
      setState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getErrors = (field: string) => state.errors[field] || [];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const errors = state.errors['non_field_errors'];

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1>{title}</h1>
      {errors && <p className="field-error">{errors}</p>}
      <div className="form-fields">
        <FormContext.Provider value={{ getValue, setValue, getErrors }}>
          {children}
        </FormContext.Provider>
      </div>
      <input type="submit" value={submitLabel} />
    </form>
  );
};

export interface FieldProps {
  type: HTMLInputTypeAttribute;
  field: string;
  label: string;
};

export const Field = ({ type, field, label }: FieldProps) => {
  const { getValue, setValue, getErrors } = useContext(FormContext);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(field, e.target.value);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      <p>{label}</p>
      <input type={type} value={getValue(field)} onChange={onChange} />
      {errors.map((error) => (
        <p className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default Form;
