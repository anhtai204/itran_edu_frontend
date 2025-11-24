import { DollarOutlined } from "@ant-design/icons";
import { Divider } from "antd";

const WishList = () => {
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>Danh sách mong muốn</h1>
                <span>
                    <DollarOutlined style={{ fontSize: "20px", paddingRight: "5px" }} /><span>Lịch sử thu thập</span>
                </span>
            </div>
            <Divider />
            <span>Danh sách mong muốn đang trống</span>
        </>
    )
}

export default WishList;