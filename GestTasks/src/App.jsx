import {React} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ListTasks from '../src/Tasks/Tasks';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/tareas" element={<ListTasks />}/>
    </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
