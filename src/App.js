import './App.css';
//import Table from 'rc-table';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Overview from './screens/Overview/Overview';
import Details from './screens/Detail/Details';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Overview" element={<Overview />} />
        <Route path="/Details" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
