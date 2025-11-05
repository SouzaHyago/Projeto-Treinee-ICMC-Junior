export default function MainContainer({
  title,
  subtitle,
  count,
  onCountClick,
  bordered=true,
  isMainPage=false,
  children,
}) {
  const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";

  return (
    <div className="text-[#6B7280] flex flex-col h-full">
      {/*Bloco principal*/}
      <div
        className={`
          ${CUSTOM_BG_COLOR} rounded-[50px] p-8 shadow-xl backdrop-blur-sm bg-opacity-90 
          flex-1 flex flex-col min-h-0 justify-between
        `}
      >
        {/*Conteúdo acima do bloco principal*/}
        <div className="flex flex-col mt-2 ml-4 mb-6 flex-shrink-0">
          {/*Título e contador (opcional)*/}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800 mr-3">{title}</h1>
            {count !== undefined && (
              <span
                className="text-base font-semibold px-3 py-1 rounded-full text-gray-800 border border-gray-300 bg-transparent cursor-pointer hover:bg-gray-100 transition"
                onClick={onCountClick}
                title="Clique para alternar entre preenchido e vazio (Empty State)"
              >
                {count}
              </span>
            )}
          </div>
          {/*Subtítulo (opcional)*/}
          <div>
            {subtitle && (
              <p className="text-[18px] font-normal text-gray-500 pt-2">
              {subtitle}
              </p>
            )}
          </div>
        </div>
        {/* Borda do conteúdo */}
        <div className={`rounded-[25px] p-10 flex-1 flex flex-col min-h-0 ${bordered ? "border border-[#949798]" : ""
          }`}>
          {children}
        </div>
      </div>
    </div>
  );
}
