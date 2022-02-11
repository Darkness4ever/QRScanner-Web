
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { LoginScreen } from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import Test from './pages/Test';

function App() {
  return (
    // <LoginScreen />
    // <HomeScreen/>
    // <Test/>
    <Routes>
      <Route path='/'  element={<LoginScreen/>}/>
      <Route path='/home' element={<HomeScreen/>} />
    </Routes>
  );
}

export default App;
