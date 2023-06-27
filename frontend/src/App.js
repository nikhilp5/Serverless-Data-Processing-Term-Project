import Navbar from './components/miscelleneous/Navbar';
import Routes from './services/Routes'
import { AuthProvider } from './services/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes />
    </AuthProvider>
  );
}

export default App;
