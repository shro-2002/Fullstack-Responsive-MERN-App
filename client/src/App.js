import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Homepage from 'scenes/homepage';
import Loginpage from 'scenes/loginpage';
import Profilepage from 'scenes/profile page';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Loginpage />} />
          <Route path="/home" element={<Homepage />} />
          
          <Route path="/profile/:userId" element={<Profilepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
