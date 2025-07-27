import { Box, IconButton, Switch, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import {
  createContext,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import "./Form.css";
import Icon from "./Icon";

/** Methods to provide a Field element with its data from the state of the parent Form. */
export interface FormFieldAccess {
  getValue: (field: string) => any | undefined;
  setValue: (field: string, value: any) => void;
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
  extraButtons?: ReactNode;
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  disabled?: boolean;
  title?: string;
  submitLabel: string;
  submit: (done: () => void) => void;
}

const Form = <T extends FormState>({
  children,
  extraButtons,
  state,
  setState,
  disabled,
  title,
  submitLabel,
  submit,
}: FormProps<T>) => {
  disabled = !!disabled || state.submitting;

  const getValue = (field: string) =>
    Object.hasOwn(state, field) ? state[field as keyof T] : undefined;

  const setValue = (field: string, value: any) => {
    if (Object.hasOwn(state, field)) {
      setState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getErrors = (field: string) => state.errors[field] || [];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, submitting: true }));
    submit(() => {
      setState((prev) => ({ ...prev, submitting: false }));
    });
  };

  const errors = state.errors["non_field_errors"];

  return (
    <form
      className="form"
      onKeyDown={(e) => {
        if (e.keyCode === 13) e.preventDefault();
      }}
      onSubmit={onSubmit}
      noValidate
    >
      {title && <h1>{title}</h1>}
      {errors && <p className="field-error">{errors}</p>}
      <div className="form-fields">
        <FormContext.Provider value={{ getValue, setValue, getErrors, disabled }}>
          {children}
        </FormContext.Provider>
      </div>
      <div className="form-buttons">
        <input disabled={disabled} type="submit" value={submitLabel} />
        {extraButtons}
      </div>
    </form>
  );
};

export interface TextFormFieldProps {
  field: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
  password?: boolean;
  type?: string;
  multiline?: boolean;
}

export const TextFormField = ({
  field,
  label,
  disabled,
  helperText,
  type,
  multiline,
  password = false,
}: TextFormFieldProps) => {
  const { getValue, setValue, getErrors, disabled: disabledByForm } = useContext(FormContext);

  const [showPassword, setShowPassword] = useState(false);

  const errors = getErrors(field);

  return (
    <div>
      <TextField
        label={label}
        helperText={helperText}
        type={password && !showPassword ? "password" : type}
        slotProps={
          password
            ? {
                input: {
                  endAdornment: (
                    <IconButton
                      aria-label={showPassword ? "hide the password" : "display the password"}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Icon icon="Invisible" /> : <Icon icon="Visible" />}
                    </IconButton>
                  ),
                },
              }
            : undefined
        }
        disabled={disabled || disabledByForm}
        multiline={multiline}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(field, e.target.value);
        }}
        value={getValue(field)}
        error={errors.length > 0}
      />
    </div>
  );
};

export interface SwitchFormFieldProps {
  field: string;
  label: string;
  disabled?: boolean;
  defaultChecked?: boolean;
}

export const SwitchFormField = ({
  field,
  label,
  disabled,
  defaultChecked,
}: SwitchFormFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <Box>
      <p>{label}</p>
      <Switch
        value={getValue(field)}
        onChange={(_, on) => {
          setValue(field, on);
        }}
        disabled={disabledByForm || disabled}
        defaultChecked={defaultChecked}
      />
    </Box>
  );
};
export interface DateFormFieldProps {
  field: string;
  label: string;
  disabled?: boolean;
  maxDate?: Dayjs;
  minDate?: Dayjs;
}

export const DateFormField = ({ field, label, disabled, maxDate, minDate }: DateFormFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div>
      <DatePicker
        label={label}
        disabled={disabled || disabledByForm}
        onChange={(v) => {
          setValue(field, v);
        }}
        value={getValue(field)}
        views={["year", "month", "day"]}
        yearsOrder="desc"
        maxDate={maxDate}
        minDate={minDate}
        slotProps={{
          actionBar: {
            actions: ["today", "nextOrAccept"],
          },
        }}
      />
    </div>
  );
};

export default Form;
