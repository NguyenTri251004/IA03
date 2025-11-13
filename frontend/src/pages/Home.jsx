import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth, useUser, useLogout } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: user, isLoading: userLoading } = useUser();
  const logoutMutation = useLogout();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Đã đăng xuất');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Lỗi khi đăng xuất');
    }
  };

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Xin chào, {user?.name || user?.email}!</CardTitle>
            <CardDescription>Bạn đã đăng nhập thành công vào hệ thống</CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tên</p>
              <p className="text-lg font-semibold">{user?.name}</p>
            </div>
            {user?.createdAt && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tạo tài khoản vào</p>
                <p className="text-lg font-semibold">{new Date(user.createdAt).toLocaleString('vi-VN')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleLogout} disabled={logoutMutation.isPending} className="w-full">
            {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </Button>
        </div>
      </div>
    </div>
  );
}
