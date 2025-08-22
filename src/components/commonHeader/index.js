import React from "react";
import "./index.css";
import { Button, Layout, Avatar, Dropdown } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { collapseMenu } from "../../store/reducers/tab";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;

const CommonHeader = ({ collapsed }) => {
  const navigate = useNavigate();
  // 退出
  const logout = () => {
    // 清除token
    localStorage.removeItem("token");
    navigate("/login");
  };
  const items = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          个人中心
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a onClick={() => logout()} target="_blank" rel="noopener noreferrer">
          退出
        </a>
      ),
    },
  ];

  // 创建dispatch
  const dispatch = useDispatch();

  // 点击展开收起按钮
  const setCollapsed = () => {
    console.log(collapsed);
    dispatch(collapseMenu());
  };

  return (
    <Header className="header-container" style={{ padding: "0 50px 0 0" }}>
      <Button
        type="text"
        icon={<MenuFoldOutlined />}
        style={{
          fontSize: "16px",
          width: 32,
          height: 32,
          background: "#fff",
        }}
        onClick={() => {
          setCollapsed();
        }}
      />
      <Dropdown menu={{ items }}>
        <Avatar
          size={36}
          src={<img src={require("../../assets/images/images.jpg")} />}
        />
      </Dropdown>
    </Header>
  );
};

export default CommonHeader;
