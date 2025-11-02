import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import TaskEditing from './pages/TaskEditing'
import Sidebar from './components/Sidebar'

function App() {

  const [userName, setUserName] = useState("Caio");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <div className={isAuthenticated ? "app-container" : "auth-page"}>
      {isAuthenticated ? (
        <div>
          <Sidebar userName={userName}/>
        </div>
      ) : (
        // Páginas de autenticação (login, cadastro)
        <div></div>
      )}
    </div>
  )
}

export default App
