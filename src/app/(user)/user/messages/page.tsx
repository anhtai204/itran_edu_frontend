import { DollarOutlined } from "@ant-design/icons";
import { Divider } from "antd";

const Message = () => {
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>Tin nhắn của tôi</h1>
                <span>
                    <DollarOutlined style={{ fontSize: "20px", paddingRight: "5px" }} /><span>Lịch sử thu thập</span>
                </span>
            </div>
            <Divider />
            <span>Chưa có tin nhắn nào</span>
        </>
    )
}

export default Message;