"use client";

import "@ant-design/v5-patch-for-react-19";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authenticate } from "@/utils/action";
import ModalReactive from "./modal.reactive.root";
import ModalChangePassword from "./modal.change.pasword";
import { auth } from "@/auth";
import { getSession } from "next-auth/react";

const Login = () => {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const [changePassword, setChangePassword] = useState(false);  

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setUserEmail("");
        // trigger sign-in
        const res = await authenticate(username, password);
    
        if (res?.error) {
          if (res?.code === 2) {
            // router.push('/verify');
            setIsModalOpen(true);
            setUserEmail(username);
            return;
          }
          // error
          notification.error({
            message: "Error login",
            description: res?.error,
          });
        } else {
          const session = await getSession();
          const role_id = session?.user?.role_id;

          if(Number(role_id) === 2){
            // console.log('admin');
            // redirect to dashboard
            router.push("/dashboard");
          } else {
            router.push("/user");
          }

          // redirect to dashboard
          // router.push("/dashboard");
        }
      };

  return (
    <>
      <Row justify={"center"} style={{ marginTop: "30px" }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{
              padding: "15px",
              margin: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <legend>Đăng Nhập</legend>
            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
                <Button type="link" onClick={() => setChangePassword(true)}>
                  Quên mật khẩu ?
                </Button>
              </Form.Item>
            </Form>
            <Link href={"/"}>
              <ArrowLeftOutlined /> Quay lại trang chủ
            </Link>
            <Divider />
            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <Link href={"/auth/register"}>Đăng ký tại đây</Link>
            </div>
          </fieldset>
        </Col>
      </Row>

      <ModalReactive
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userEmail={userEmail}
      />
      <ModalChangePassword
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
      />
    </>
  );
};

export default Login;
