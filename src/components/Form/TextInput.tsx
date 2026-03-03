import { FieldApi } from '@tanstack/react-form'
import { FormField } from './FormField'

interface TextInputProps {
  field: FieldApi<any, any, any, any>
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
}

export function TextInput({
  field,
  label,
  placeholder,
  type = 'text',
}: TextInputProps) {
  return (
    <FormField field={field} label={label}>
      <input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </FormField>
  )
}
