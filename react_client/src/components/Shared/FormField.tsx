import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps {
    label: string;
    type?: 'text' | 'number' | 'datetime-local' | 'email' | 'password';
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    fullWidth?: boolean;
    inputProps?: TextFieldProps['inputProps'];
}

export const FormField = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    multiline = false,
    rows = 1,
    placeholder,
    fullWidth = true,
    inputProps
}: FormFieldProps) => {
    return (
        <TextField
            label={label}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            required={required}
            disabled={disabled}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            placeholder={placeholder}
            fullWidth={fullWidth}
            InputLabelProps={type === 'datetime-local' ? { shrink: true } : undefined}
            inputProps={inputProps}
        />
    );
};
