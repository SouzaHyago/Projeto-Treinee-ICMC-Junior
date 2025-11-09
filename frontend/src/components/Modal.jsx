import { FiX } from "react-icons/fi"

const baseButtonStyle = "text-white px-4 py-2.5 font-medium rounded-full transition shadow-sm min-w-[180px]";

function Modal({ 
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  onExtraButton,
  lButtonText = "Cancelar",
  rButtonText,
  lButtonStyle = "bg-[#ADADAD] hover:bg-[#8E8E8E]",
  rButtonStyle,
  swappedButtons = false,
  xToClose = false
}) {
  if (!isOpen)
    return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-55 flex justify-center 
                                      items-center z-50 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} 
           className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-12 text-center m-4">
        {xToClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            aria-label="Fechar modal"
          >
            <FiX className="h-6 w-6" />
          </button>
        )}
        <h2 className="text-2xl font-medium text-gray-900">
          {title}
        </h2>

        <p className="mt-4 text-base text-gray-600">
          {message}
        </p>

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
            onClick={onExtraButton ? onExtraButton : (swappedButtons ? onConfirm : onClose)}
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