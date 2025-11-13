import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLogin } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

// Validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email bắt buộc'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          {/* Left panel - illustration / marketing copy (desktop-first) */}
          <div className="hidden md:flex flex-col justify-center px-8">
            <h1 className="text-4xl font-extrabold mb-4">Chào mừng trở lại</h1>
            <p className="text-lg text-muted-foreground">Đăng nhập để tiếp tục sử dụng các tính năng nâng cao của ứng dụng. Trải nghiệm tốt nhất trên máy tính để bàn.</p>
          </div>

          {/* Right panel - form card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>Vui lòng nhập email và mật khẩu của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Email</Label>
                  <Input {...register('email', { required: 'Email bắt buộc' })} />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label className="mb-2 block">Mật khẩu</Label>
                  <Input type="password" {...register('password', { required: 'Mật khẩu bắt buộc' })} />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center text-sm text-muted-foreground">Chưa có tài khoản? <a href="/register" className="text-primary underline">Đăng ký</a></div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
