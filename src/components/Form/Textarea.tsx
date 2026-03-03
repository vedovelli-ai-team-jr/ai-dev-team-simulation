import { FieldApi } from '@tanstack/react-form'
import { FormField } from './FormField'

interface TextareaProps {
  field: FieldApi<any, any, any, any>
  label?: string
  placeholder?: string
  rows?: number
}

export function Textarea({
  field,
  label,
  placeholder,
  rows = 4,
}: TextareaProps) {
  return (
    <FormField field={field} label={label}>
      <textarea
        id={field.name}
        name={field.name}
        placeholder={placeholder}
        rows={rows}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </FormField>
  )
}
