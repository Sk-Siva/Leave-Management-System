import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './userContext';
import Login from './pages/Login';
import Home from './pages/Home'; 
import RequestLeave from './components/RequestLeave';
import AddUser from './components/AddUser';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request-leave" element={<RequestLeave />} />
          <Route path="/add-user" element={<AddUser />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;