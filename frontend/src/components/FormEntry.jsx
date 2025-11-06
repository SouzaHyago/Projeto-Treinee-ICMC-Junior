import Textbox from "./Textbox"

function FormEntry({ label, type, mandatory=true, placeholder, value, onChange, multiline=false, inputClass="" }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1.5 text-base font-medium text-gray-700 flex items-center gap-1">
        {label}
        {mandatory && <span className="text-gray-500 ml-1"> *</span>}  
      </label>
      <Textbox
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        className={inputClass}
        multiline={multiline}
      />
    </div>
  );
}

export default FormEntry;