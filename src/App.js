import React from 'react'
import { Home } from './Routes/Home'
import { CreateFreq } from './Routes/CreateFreq'
import { EnterFreq } from './Routes/EnterFreq'
import { JoinFreq } from './Routes/JoinFreq'
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
