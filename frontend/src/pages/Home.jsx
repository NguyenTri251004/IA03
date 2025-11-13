import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <div className="px-6 md:px-12">
            <h1 className="text-5xl font-extrabold mb-4">IA03 — Demo đăng ký & đăng nhập</h1>
            <p className="text-lg text-muted-foreground">Ứng dụng minh họa việc tạo tài khoản, xác thực bằng mật khẩu mã hóa và lưu trữ người dùng trong MongoDB. Thiết kế tối ưu cho desktop nhưng vẫn hiển thị tốt trên điện thoại.</p>
          </div>

          <div className="px-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Bắt đầu</CardTitle>
                <CardDescription>Đăng ký để tạo tài khoản mới hoặc đăng nhập nếu bạn đã có tài khoản.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 items-center">
                  <Link to="/register">
                    <Button className="w-44">Đăng ký</Button>
                  </Link>
                  <Link to="/login">
                    <Button className="w-44">Đăng nhập</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
