"use client";
import { DeleteTwoTone, EditTwoTone, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  MenuProps,
  message,
  Popconfirm,
  Table,
} from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";
import {
  handleDeleteUserAction,
  handleGetRoles,
  handleUpdateUserAction,
} from "@/utils/action";
import { title } from "process";
import { MenuItemType } from "antd/es/menu/interface";
import UserCreateModal from "./user-create-modal";

interface IProps {
  users: any;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}
const UserTable = (props: IProps) => {
  const { users, meta } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);

  const [userRoles, setUserRoles] = useState<{ [key: string]: number }>({});
  const [rolesMap, setRolesMap] = useState<{ [key: number]: string }>({}); // Map từ role_id sang description

  // roles
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

  // useEffect(() => {
  //   handleGetRoles().then(setMenuItems);
  // }, []);

  // Lấy danh sách roles từ API
  useEffect(() => {
    const fetchRoles = async () => {
      const items = await handleGetRoles();
      setMenuItems(items);

      // Tạo map từ role_id sang description
      const roleMap = items.reduce(
        (acc: { [key: number]: string }, item: any) => {
          acc[Number(item.key)] = item.label;
          return acc;
        },
        {}
      );
      setRolesMap(roleMap);
    };
    fetchRoles();
  }, []);

  // console.log(">>>menuItems: ", menuItems);
  const handleMenuClick = async (userId: string, role_id: number) => {
    console.log(">>>userId: ", userId, " - ", "role_id: ", role_id);
    setUserRoles((prev) => ({
      ...prev,
      [userId]: role_id, // Cập nhật vai trò cho user tương ứng
    }));

    const res = await handleUpdateUserAction({
      id: userId,
      role_id: role_id,
    });

    if (res?.data) {
      const currentRoleId = res?.data?.role_id;
      // Lấy description từ rolesMap
      const currentRole = rolesMap[currentRoleId] || "";
      // console.log('>>>res: ', res);
      message.success(
        `Update role ${currentRole} for ${res?.data?.email} success`
      );
    } else {
      message.error("Error while update role");
    }
  };
  
  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
    },
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      render: (text: any, record: any) => {
        // Lấy role_id từ userRoles hoặc record.role_id
        const currentRoleId = userRoles[record.id] || record.role_id;
        // Lấy description từ rolesMap
        const currentRole = rolesMap[currentRoleId] || "";
        return (
          <Dropdown
            menu={{
              // Kiểm tra menuItems và item để tránh undefined/null
              items: menuItems
                ?.map(
                  (item) =>
                    item // Nếu item không null/undefined thì mới xử lý
                      ? {
                          ...item,
                          onClick: () =>
                            handleMenuClick(record.id, Number(item.key)),
                        }
                      : null // Trả về null nếu item là null
                )
                ?.filter(Boolean) as MenuItemType[], // Lọc bỏ các giá trị null và ép kiểu
            }}
            trigger={["click"]}
          >
            <Button icon={<UserOutlined />}>{currentRole}</Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Actions",

      render: (text: any, record: any, index: any) => {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", margin: "0 20px" }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataUpdate(record);
              }}
            />

            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này ?"}
              onConfirm={async () => await handleDeleteUserAction(record?.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (pagination && pagination.current) {
      const params = new URLSearchParams(searchParams);
      params.set("current", pagination.current);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Manager Users</span>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
      </div>
      <Table
        bordered
        dataSource={users}
        // dataSource={users.map((user: any) => ({ ...user, key: user.id }))}
        columns={columns}
        rowKey={"id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        onChange={onChange}
      />

      {/* <UserCreate
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UserUpdate
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      /> */}

      <UserCreateModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
    </>
  );
};

export default UserTable;
