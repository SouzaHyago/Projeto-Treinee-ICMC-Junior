
import FormEditarPerfil from '@/components/FormEditarPerfil'

export default function Configuracoes() {
  const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";

  return (
    <div className={`${CUSTOM_BG_COLOR} rounded-[50px] container p-8 w-full max-w-6xl shadow-xl backdrop-blur-sm`}>
      <h1 className="text-[36px] font-bold text-gray-800">Configurações</h1>
      <div className="flex justify-center mt-8">
        <FormEditarPerfil />
      </div>
    </div>
  );
}
