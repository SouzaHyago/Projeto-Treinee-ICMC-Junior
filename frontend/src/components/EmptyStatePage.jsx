import { Link } from "react-router-dom";

  function EmptyStatePage({text, addButton=false}) {
  return(
    <div className="flex-1 flex justify-center items-center">
      <div className="flex flex-col items-center text-center w-full">
        <p className="text-gray-700 font-bold text-[22px] mb-2">
          Nenhuma tarefa
        </p>

        <p className="text-gray-500 text-[15px] font-normal max-w-xs mb-6">
          {text}
        </p>
        {addButton && (
          <Link to="/criar-tarefa">
            <div className="flex items-center px-6 py-2 text-white bg-[#8E8E8E] rounded-[20px] 
                            shadow-md hover:bg-[#787878] transition text-sm font-medium"
            >
              Criar
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default EmptyStatePage;