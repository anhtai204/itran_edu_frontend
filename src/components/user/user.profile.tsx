// "use client";

// import "@ant-design/v5-patch-for-react-19";
// import { UploadOutlined } from "@ant-design/icons";
// import { Button, Form, Input, Radio, Select, Upload } from "antd";

// const { Option } = Select;
// const UserProfiles = () => {
//   const [form] = Form.useForm();

//   const onFinish = (values: any) => {
//     console.log("Received values:", values);
//   };

//   const normFile = (e: any) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };

//   return (
//     <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
//       <h1 style={{ textAlign: "center", marginBottom: "24px", fontSize: "24px" }}>
//         <b>Thông tin cá nhân</b>
//       </h1>
//       <p style={{ textAlign: "center", color: "#666", marginBottom: "24px" }}>
//         Cập nhật thông tin cá nhân của bạn. Thông tin sẽ được lưu và thông khai.
//       </p>

//       <Form form={form} name="profile" onFinish={onFinish} layout="vertical">
//         {/* Upload ảnh đại diện */}
//         <Form.Item
//           label="Ảnh đại diện"
//           name="avatar"
//           valuePropName="fileList"
//           getValueFromEvent={normFile}
//         >
//           <Upload
//             name="avatar"
//             listType="picture-circle"
//             maxCount={1}
//             beforeUpload={() => false} // Ngăn upload thực tế, chỉ hiển thị giao diện
//           >
//             <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
//           </Upload>
//         </Form.Item>

//         {/* Giới tính */}
//         <Form.Item label="Giới tính" name="gender" initialValue="Nam">
//           <Radio.Group>
//             <Radio value="Nam">Nam</Radio>
//             <Radio value="Nữ">Nữ</Radio>
//             <Radio value="Khác">Khác</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* Địa chỉ */}
//         <Form.Item
//           label="Địa chỉ"
//           name="address"
//           rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
//         >
//           <Input placeholder="Nhập địa chỉ của bạn" />
//         </Form.Item>

//         {/* Giới thiệu bản thân */}
//         <Form.Item
//           label="Giới thiệu bản thân"
//           name="introduction"
//           rules={[
//             { required: true, message: "Vui lòng viết vài dòng về bạn!" },
//           ]}
//         >
//           <Input.TextArea placeholder="Viết vài dòng về bạn" rows={4} />
//         </Form.Item>

//         {/* Số năm kinh nghiệm */}
//         <Form.Item
//           label="Số năm kinh nghiệm"
//           name="experience"
//           rules={[
//             { required: true, message: "Vui lòng nhập số năm kinh nghiệm!" },
//             {
//               validator: (_, value) => {
//                 if (!value || value >= 0) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject(
//                   new Error("Số năm kinh nghiệm không thể âm!")
//                 );
//               },
//             },
//           ]}
//         >
//           <Input
//             type="number"
//             placeholder="0"
//             addonAfter="năm"
//             min={0} // Thêm thuộc tính min để giới hạn giá trị trong input
//             onKeyPress={(e) => {
//               // Ngăn người dùng nhập dấu trừ (-)
//               if (e.key === "-") {
//                 e.preventDefault();
//               }
//             }}
//           />
//         </Form.Item>

//         {/* Trình độ học vấn */}
//         <Form.Item
//           label="Trình độ học vấn"
//           name="education"
//           rules={[
//             { required: true, message: "Vui lòng chọn trình độ học vấn!" },
//           ]}
//         >
//           <Select placeholder="Chọn trình độ học vấn">
//             <Option value="highSchool">Trung học phổ thông</Option>
//             <Option value="college">Cao đẳng</Option>
//             <Option value="university">Đại học</Option>
//             <Option value="master">Thạc sĩ</Option>
//             <Option value="doctor">Tiến sĩ</Option>
//           </Select>
//         </Form.Item>

//         {/* Chuyên môn */}
//         <Form.Item
//           label="Chuyên môn"
//           name="specialization"
//           rules={[
//             { required: true, message: "Vui lòng nhập chuyên môn của bạn!" },
//           ]}
//         >
//           <Input placeholder="Nhập lĩnh vực chuyên môn của bạn" />
//         </Form.Item>

//         {/* Nút lưu và xóa tài khoản */}
//         <Form.Item style={{ textAlign: "center", marginTop: "24px" }}>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             style={{ marginRight: "16px" }}
//           >
//             Lưu thay đổi
//           </Button>
//           <Button danger size="large">
//             Xóa tài khoản
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default UserProfiles;

const UserProfiles = () => {
  return (
    <>
      User Profiles
    </>
  )
}

export default UserProfiles;