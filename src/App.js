import { Home } from './routes/Home'
import { CreateFreq } from './routes/CreateFreq'
import { EnterFreq } from './routes/EnterFreq'
import { JoinFreq } from './routes/JoinFreq'
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "create-freq",
    element: <CreateFreq />
  },
  {
    path: "join-freq",
    element: <JoinFreq />
  },
  {
    path: "enter-freq",
    element: <EnterFreq />
  }
])
function App() {
  return (
    <RouterProvider router={router} />
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="create-freq" element={<CreateFreq />} />
    //     <Route path="join-freq" element={<JoinFreq />} />
    //     <Route path="enter-freq" element={<EnterFreq />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
