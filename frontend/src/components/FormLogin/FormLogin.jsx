import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import FormEntry from "@/components/FormEntry";
import styles from "../FormLogin/FormLogin.module.css";
import { useAuth } from "@/context/AuthContext";

export default function FormLogin() {
	const pronouns = ["o", "a", "e"];
	const [index, setIndex] = useState(0);
  const [emailCpf, setEmailCpf] = useState("");
  const [senha, setSenha] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();

  try {
    await login(emailCpf, senha);  
    navigate("/");     
  } catch (err) {
    alert(err.message);
  }
}

useEffect(() => {
		const intervalo = setInterval(() => {
			setIndex((i) => (i + 1) % pronouns.length);
		}, 1500);

		return () => clearInterval(intervalo);
}, []);


	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2 className="text-[36px] font-medium text-gray-800 flex items-center">
				Bem vind
				<AnimatePresence mode="wait">
					<motion.span
						key={pronouns[index]}
						initial={{ opacity: 0.1, y: 0 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0.1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="inline-block"
					>
						{pronouns[index]}
					</motion.span>
				</AnimatePresence>
				!
			</h2>

			<p className={styles.subtitle}>
				Insira suas informações para acessar a conta.
			</p>

			<FormEntry
				label="E-mail ou CPF"
				placeholder="Digite seu e-mail ou CPF"
				value={emailCpf}
				onChange={(e) => setEmailCpf(e.target.value)}
			/>

			<div>
				<p className={styles.label}>Senha <b>*</b></p>
				<input
					type="password"
					placeholder="Digite sua senha"
					value={senha}
					onChange={(e) => setSenha(e.target.value)}
				/>
			</div>

			<button type="submit">Entrar</button>

			<div style={{ textAlign: "center" }}>
				<p>Não tem uma conta?</p>
				<Link to="/cadastro" className={styles.link}>Inscreva-se</Link>
			</div>
		</form>
	);
}
