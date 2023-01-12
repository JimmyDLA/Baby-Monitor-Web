import React from 'react'
import { Home } from './routes/Home'
import { CreateFreq } from './routes/CreateFreq'
import { EnterFreq } from './routes/EnterFreq'
import { JoinFreq } from './routes/JoinFreq'
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
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
    path: "join-freq/:room",
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
  );
}

export default App;
