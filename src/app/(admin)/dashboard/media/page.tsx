// const MediaManage = () => {
//     return (
//         <div>
//             Media Page
//         </div>
//     )
// }

// export default MediaManage;
"use client";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function XuHuongNhanSu() {
  const [data] = useState([
    { name: 'Tự động hóa', value: 85, fill: '#8884d8' },
    { name: 'Trải nghiệm ứng viên', value: 78, fill: '#83a6ed' },
    { name: 'Phân tích dữ liệu', value: 72, fill: '#8dd1e1' },
    { name: 'Làm việc từ xa', value: 90, fill: '#82ca9d' },
    { name: 'Đào tạo liên tục', value: 68, fill: '#a4de6c' }
  ]);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-xl font-bold mb-4">Xu hướng quy trình nhân sự hiện đại</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Mức độ ưu tiên (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Mức độ ưu tiên" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm mt-2 text-gray-600">Dựa trên phân tích xu hướng từ tài liệu</p>
    </div>
  );
}