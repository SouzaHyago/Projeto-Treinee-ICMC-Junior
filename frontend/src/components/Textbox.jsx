function TextBox({ placeholder, type="text", value, onChange, multiline=false, className="" }) {
  if (multiline) {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border border-gray-300 rounded-[10px] shadow-sm 
                    text-gray-700 placeholder-gray-400 text-sm resize-none ${className}`}
      />
    );
  }
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-[10px] shadow-sm 
                  text-gray-700 placeholder-gray-400 text-sm ${className}`}
    />
  );
}

export default TextBox;