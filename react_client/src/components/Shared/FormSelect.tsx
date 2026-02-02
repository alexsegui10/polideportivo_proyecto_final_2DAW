import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface FormSelectOption {
    value: string | number;
    label: string;
}

interface FormSelectProps {
    label: string;
    value: string | number;
    onChange: (value: any) => void;
    options: FormSelectOption[];
    error?: string;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

export const FormSelect = ({
    label,
    value,
    onChange,
    options,
    error,
    required = false,
    disabled = false,
    fullWidth = true
}: FormSelectProps) => {
    return (
        <FormControl fullWidth={fullWidth} error={!!error} required={required} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};
