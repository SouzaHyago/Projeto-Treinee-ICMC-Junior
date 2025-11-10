import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppContent from "./appContent"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <ToastContainer autoClose={3000} /> 
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;