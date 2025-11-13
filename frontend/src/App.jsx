import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { Key, UserPlus } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold">IA03</Link>

          <div className="space-x-4 flex items-center">
            <Link to="/login" className="text-sm inline-flex items-center gap-2" aria-label="Login">
              <Key className="h-4 w-4" />
              <span>Login</span>
            </Link>

            <Link to="/register" className="text-sm font-medium inline-flex items-center gap-2" aria-label="Sign up">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </nav>

  <main className="w-full p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
