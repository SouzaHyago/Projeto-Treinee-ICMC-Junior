const baseButtonStyle = "text-white px-4 py-2.5 font-medium rounded-full transition shadow-sm min-w-[180px]";

function Modal({ 
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  lButtonText = "Cancelar",
  rButtonText,
  lButtonStyle = "bg-[#ADADAD] hover:bg-[#8E8E8E]",
  rButtonStyle,
  swappedButtons = false
}) {
  if (!isOpen)
    return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-55 flex justify-center 
                                      items-center z-50 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-12 m-4">
          <h2 className="text-2xl font-medium text-gray-900 text-center">
          {title}
        </h2>

        <div className="mt-4 text-base text-gray-600 max-h-80 overflow-y-auto">
          {message}
        </div>

        <div className="mt-8 flex justify-between">

          {/* Botão Esquerdo */}
          <button
            onClick={swappedButtons ? onConfirm : onClose}
            className={`${baseButtonStyle} ${lButtonStyle}`}
          >
            {lButtonText}
          </button>

          {/* Botão Direito */}
          <button
            onClick={swappedButtons? onClose : onConfirm}
            className={`${baseButtonStyle} ${rButtonStyle}`}
          >
            {rButtonText}
          </button>
        </div>

      </div>
    </div>
  );

}

export default Modal;