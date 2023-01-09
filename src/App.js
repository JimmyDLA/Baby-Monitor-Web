import { Home } from './routes/Home'
import { CreateFreq } from './routes/CreateFreq'
import { EnterFreq } from './routes/EnterFreq'
import { JoinFreq } from './routes/JoinFreq'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="create-freq" element={<CreateFreq />} />
        <Route path="join-freq" element={<JoinFreq />} />
        <Route path="enter-freq" element={<EnterFreq />} />
      </Routes>
    </Router>
  );
}

export default App;
