import { FieldApi } from '@tanstack/react-form'
import { FormField } from './FormField'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  field: FieldApi<any, any, any, any>
  label?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({
  field,
  label,
  options,
  placeholder,
}: SelectProps) {
  return (
    <FormField field={field} label={label}>
      <select
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
