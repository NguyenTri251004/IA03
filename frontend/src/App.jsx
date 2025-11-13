import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth, useLogout } from './hooks/useAuth';
import { Key, UserPlus, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';

function NavBar() {
  const { isAuthenticated, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login', { replace: true });
    } catch {
      // Error already handled in hook
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">IA04 - JWT Auth</Link>

        <div className="space-x-4 flex items-center">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-blue-600 font-medium inline-flex items-center gap-2 hover:text-blue-800 transition-colors" aria-label="Login">
                <Key className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>

              <Link to="/register" className="text-sm text-green-600 font-medium inline-flex items-center gap-2 hover:text-green-800 transition-colors" aria-label="Sign up">
                <UserPlus className="h-4 w-4" />
                <span>Đăng ký</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="w-full">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><p>Page not found</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
