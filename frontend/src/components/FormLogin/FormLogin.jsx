// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from 'react';
// import { Link } from "react-router-dom";
// import styles from './FormLogin.module.css'

// export default function FormLogin(){
// 	const pronouns = ["o", "a", "e"];
//   const [index, setIndex] = useState(0); 
	
// 	useEffect(() => {
//     const intervalo = setInterval(() => {
//       setIndex((i) => (i + 1) % pronouns.length);
//     }, 1000);

//     return () => clearInterval(intervalo);
//   }, []);

// 	return(
 
// <form className={styles.form}>
	
//       <h2 className="text-[36px] font-medium text-gray-800 flex items-center">
// 					Bem vind
// 					<AnimatePresence mode="wait">
// 						<motion.span
// 							key={pronouns[index]}
// 							initial={{ opacity: 0.9, y: 0 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							exit={{ opacity: 0.9, y: 0 }}

// 							transition={{ duration: 0.6, ease: "easeInOut" }}
// 							className="inline-block"
// 						>
// 							{pronouns[index]}
// 						</motion.span>
// 					</AnimatePresence>
// 					!
// 				</h2>
// 			<p className={styles.subtitle}>Insira sua informações para acessar a conta.</p>

// 			<div>
// 					<p>E-mail ou CPF <b>*</b></p>
// 					<input type="text" placeholder='Digite seu e-mail ou CPF' />
// 			</div>
			
// 			<div>
// 					<p>Senha <b>*</b></p>
// 					<input type="password" placeholder='Digite sua senha'/>
// 			</div>
// 			<Link to="/">
// 				<button type="submit">Entrar</button>
// 			</Link>
// 			<div style={{textAlign:"center"}}>
// 					<p>Não tem uma conta?</p>
// 					<a href="/cadastro" style={{color: "#1926DB"}}>Inscreva-se</a>
// 			</div>
// 		</form>
// 	)
// }

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import FormEntry from "../../components/FormEntry";
import styles from './FormLogin.module.css';

export default function FormLogin() {
	const pronouns = ["o", "a", "e"];
	const [index, setIndex] = useState(0);
	const [emailCpf, setEmailCpf] = useState("");
	const [senha, setSenha] = useState("");

	useEffect(() => {
		const intervalo = setInterval(() => {
			setIndex((i) => (i + 1) % pronouns.length);
		}, 1000);

		return () => clearInterval(intervalo);
	}, []);

	return (
		<form className={styles.form}>
			<h2 className="text-[36px] font-medium text-gray-800 flex items-center">
				Bem vind
				<AnimatePresence mode="wait">
					<motion.span
						key={pronouns[index]}
						initial={{ opacity: 0.9, y: 0 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0.9, y: 0 }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="inline-block"
					>
						{pronouns[index]}
					</motion.span>
				</AnimatePresence>
				!
			</h2>

			<p className={styles.subtitle}>Insira suas informações para acessar a conta.</p>

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

			<Link to="/">
				<button type="submit">Entrar</button>
			</Link>

			<div style={{ textAlign: "center" }}>
				<p>Não tem uma conta?</p>
				<a href="/cadastro" className={styles.link}>Inscreva-se</a>
			</div>
		</form>
	);
}
