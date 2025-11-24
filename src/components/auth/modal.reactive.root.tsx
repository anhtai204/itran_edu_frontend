"use client";
import "@ant-design/v5-patch-for-react-19";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";

import { useHasMounted } from "@/utils/customHook";
import { Modal } from "antd";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

const ModalReactive = (props: any) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");

  const hasMounted = useHasMounted();

  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail]);

  if (!hasMounted) return <></>;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      body: {
        email,
      },
    });

    if (res?.data) {
      setUserId(res?.data?.id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Call APIs login",
        description: res?.error,
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code } = values;
    console.log('>>> check values:', values);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        id: userId, code
      },
    });

    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Call APIs login",
        description: res?.error,
      });
    }
  };

  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        footer={null}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Login",
              //   status: "finish",
              icon: <UserOutlined />,
            },
            {
              title: "Verification",
              //   status: "finish",
              icon: <SolutionOutlined />,
            },
            {
              title: "Done",
              // status: "wait",
              icon: <SmileOutlined />,
            },
          ]}
        />
        {current === 0 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Tài khoản của bạn chưa được kích hoạt</p>
            </div>

            <Form
              name="verify1"
              onFinish={onFinishStep0}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item label="" name="email">
                <Input placeholder="Email" disabled />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Resend
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 1 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Vui lòng nhập mã xác nhận</p>
            </div>

            <Form
              name="verify2"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label=""
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input placeholder="Code" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Active
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 2 && (
          <div style={{ margin: "20px 0" }}>
            <p>
              Tài khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập
              lại!
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
