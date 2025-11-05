import { useState } from 'react'
import MainContainer from "../components/MainContainer"
import FormEntry from "../components/FormEntry"

function CriarTarefa() {
  const [value, setValue] = useState("");
  function labelOpcional(label){
    return (
      <>
        {label} <span className="text-gray-400">(opcional)</span>
      </>
    );
  }

  return (
    <MainContainer 
      title="Criar tarefa" 
      subtitle={"Preencha com a informação da sua tarefa."} 
      bordered={false}
    >
      {/* Container do formulário */}
      <div className='flex flex-col justify-between gap-10 -mt-6'>
        {/* Inputs de texto */}
        <div className='flex flex-col flex-1 gap-3'>
          <FormEntry 
            label="Nome da tarefa"
            placeholder="Insira o nome da tarefa" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
          />
          <FormEntry 
            label={labelOpcional("Descrição")}
            mandatory={false}
            multiline={true}
            placeholder="Insira a descrição da tarefa" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            inputClass="h-32"
          />
          {/* Inputs de data e horário */}
          <div className='flex gap-4'>
            <div className="flex-1">
              <FormEntry
                label="Data"
                placeholder="DD/MM/AAAA"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <FormEntry
                label="Horário"
                placeholder="HH:MM"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <FormEntry
            label={labelOpcional("Observações")}
            mandatory={false}
            multiline={true}
            placeholder="Adicione detalhes sobre a sua tarefa"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputClass="h-32"
          />
        </div>
        {/* Botões de ação */}
        <div className="flex justify-center gap-20">
          {/* Cancelar */}
          <button
            className={`
              px-4 py-2 min-w-[200px]
              text-white bg-[#A0A3A4] 
              rounded-lg border-gray-700 shadow-sm 
              hover:bg-[#767676] transition
            `}
            onClick={() => console.log("Criação de tarefa cancelada!")}
          >
            Cancelar
          </button>
          {/* Salvar */}
          <button
            className={`
              px-4 py-2 min-w-[200px]
              text-white bg-[#40869E]
              rounded-lg border-gray-700 shadow-sm 
              hover:bg-[#006186] transition
            `}
            onClick={() => console.log("Tarefa criada!")}
          >
            Salvar tarefa
          </button>
        </div>
      </div>
    </MainContainer>
  );
}

export default CriarTarefa