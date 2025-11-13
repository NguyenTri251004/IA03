import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom'; // ✅ thêm Link ở đây

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => client.post('/user/register', data),
  });

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
      alert('Đăng ký thành công! Bạn có thể đăng nhập.');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Có lỗi xảy ra';
      alert('Đăng ký thất bại: ' + msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <div className="hidden md:block px-8">
            <h1 className="text-4xl font-extrabold mb-4">Tạo tài khoản mới</h1>
            <p className="text-lg text-muted-foreground">
              Đăng ký để truy cập các tính năng và quản lý tài khoản của bạn. 
              Giao diện tối ưu cho máy tính để bàn.
            </p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Đăng ký</CardTitle>
              <CardDescription>Nhập email và mật khẩu để tạo tài khoản.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Email</Label>
                  <Input
                    {...register('email', { 
                      required: 'Email là bắt buộc', 
                      pattern: { value: /^\S+@\S+$/i, message: 'Email không đúng định dạng' } 
                    })}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label className="mb-2 block">Mật khẩu</Label>
                  <Input
                    type="password"
                    {...register('password', { 
                      required: 'Mật khẩu là bắt buộc', 
                      minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' } 
                    })}
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </div>

                {mutation.isError && (
                  <p className="text-red-600 mt-3">
                    {mutation.error?.response?.data?.message || 'Lỗi'}
                  </p>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                {/* ✅ đổi a -> Link */}
                <Link to="/login" className="text-primary underline">
                  Đăng nhập
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
