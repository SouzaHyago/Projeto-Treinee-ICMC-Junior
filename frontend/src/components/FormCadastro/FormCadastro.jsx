import { useNavigate } from 'react-router-dom'
import styles from './FormCadastro.module.css'
import FormEntry from '../../components/FormEntry'
import api from "@/api"
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function FormCadastro({ title, subtitle, cadastro }) {
  const navigate = useNavigate();
  const [nome,setNome] = useState("");
  const [cpf,setCpf] = useState("");
  const [email,setEmail] = useState("");
  const [dataNascimento,setDataNascimento] = useState("");
  const [senha,setSenha] = useState("");


  async function handleSubmit(e){
    e.preventDefault();
        try {
      const response = await api.post("/users/cadastro", {
        nome,
        cpf,
        email,
        dataNascimento,
        senha
      });

      console.log("Usuário cadastrado:", response.data);
      toast.success("Cadastro realizado com sucesso!"); 
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);

      toast.error(error?.response?.data?.message || "Erro ao cadastrar.");
    }
  }

  return (
    <form className={styles.formCadastro} onSubmit={handleSubmit}>
      <h2 className="text-[36px] font-medium text-gray-800">{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.fields}>
        {/* Nome */}
        <FormEntry
          onChange={(e) => setNome(e.target.value)}
          label="Nome"
          placeholder="Digite seu nome"
        />

        {/* CPF + Data de nascimento */}
        <div className={styles.both}>
          <div className={styles.halfsize}>
            <FormEntry
              onChange={(e) => setCpf(e.target.value)}
              label="CPF"
              placeholder="Digite seu CPF"
              inputClass={styles.halfInput}
            />
          </div>
          <div className={styles.halfsize}>
            <label className="mb-1.5 text-base font-medium text-gray-700 flex items-center gap-1">
              Data de nascimento
              <span className="text-gray-500 ml-1">*</span>
            </label>
            <input
              onChange={(e) => setDataNascimento(e.target.value)}
              type="date"
              className={styles.input}
            />
          </div>
          
        </div>

        {/* Email */}
        <FormEntry
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="Digite seu email"
        />

        {/* Senha */}
        <div>
          <label className="mb-1.5 text-base font-medium text-gray-700 flex items-center gap-1">
            Senha
            <span className="text-gray-500 ml-1">*</span>
          </label>
          <input
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Digite sua senha"
            className={styles.input}
          />
        </div>

        {cadastro && (
          <>
            <button type="submit">Criar conta</button>
            <div style={{ textAlign: "center" }}>
              <p>Tem uma conta?</p>
              <a href="/login" className={styles.link}>Entrar</a>
            </div>
          </>
        )}
      </div>
    </form>
  )
}