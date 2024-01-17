import { useState } from 'react'

const FormInput = ({
  label,
  type,
  name,
  placeholder,
  value,
  errorMessage,
  onchange,
  pattern,
  isFormValid,
}) => {
  const [focused, setFocused] = useState(false)

  const handleFocus = (e) => {
    setFocused(true)
  }

  return (
    <div className="flex flex-col mt-3 mb-1 ">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        required
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onchange(e.target.value)}
        pattern={pattern}
        onBlur={handleFocus}
        onFocus={() => name === 'confirmPassword' && setFocused(true)}
        focused={focused.toString()}
      />
      <span
        className={`text-xs font-medium text-red-600 leading-1 italic ${
          isFormValid ? 'hidden' : 'block'
        }`}
      >
        {errorMessage}
      </span>
    </div>
  )
}
export default FormInput
