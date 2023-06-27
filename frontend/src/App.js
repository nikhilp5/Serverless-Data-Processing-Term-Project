import Navbar from './components/Navbar';
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
