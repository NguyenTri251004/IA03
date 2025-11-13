import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRegister } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

// Validation schema with Zod
const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ').min(1, 'Email bắt buộc'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu bắt buộc'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không trùng khớp",
  path: ["confirmPassword"],
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const registerMutation = useRegister();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword: _, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Đăng ký thất bại';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <div className="hidden md:block px-8">
            <h1 className="text-4xl font-extrabold mb-4">Tạo tài khoản mới</h1>
            <p className="text-lg text-muted-foreground">Đăng ký để truy cập các tính năng và quản lý tài khoản của bạn. Giao diện tối ưu cho máy tính để bàn.</p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Đăng ký</CardTitle>
              <CardDescription>Nhập email và mật khẩu để tạo tài khoản.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Tên</Label>
                  <Input {...register('name')} placeholder="Nhập tên của bạn" />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label className="mb-2 block">Email</Label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Nhập email của bạn"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label className="mb-2 block">Mật khẩu</Label>
                  <Input
                    type="password"
                    {...register('password')}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Label className="mb-2 block">Xác nhận mật khẩu</Label>
                  <Input
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="Xác nhận mật khẩu"
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </div>

                {registerMutation.isError && <p className="text-red-600 mt-3">{registerMutation.error?.response?.data?.message || 'Lỗi'}</p>}
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center text-sm text-muted-foreground">Đã có tài khoản? <a href="/login" className="text-primary underline">Đăng nhập</a></div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
