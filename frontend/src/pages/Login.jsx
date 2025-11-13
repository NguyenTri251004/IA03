import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; // ✅ thêm Link ở đây
import { useMutation } from '@tanstack/react-query';
import client from '../api/client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => client.post('/user/login', data),
  });

  const onSubmit = async (data) => {
    try {
      const res = await mutation.mutateAsync(data);
      // success
      alert(res?.data?.message || 'Đăng nhập thành công');
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Đăng nhập thất bại';
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          {/* Left panel - illustration / marketing copy (desktop-first) */}
          <div className="hidden md:flex flex-col justify-center px-8">
            <h1 className="text-4xl font-extrabold mb-4">Chào mừng trở lại</h1>
            <p className="text-lg text-muted-foreground">
              Đăng nhập để tiếp tục sử dụng các tính năng nâng cao của ứng dụng. 
              Trải nghiệm tốt nhất trên máy tính để bàn.
            </p>
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
                  <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-primary underline">
                  Đăng ký
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
