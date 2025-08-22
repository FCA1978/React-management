import React from "react";
import { Form, Input, Button, message } from "antd";
import "./login.css";
import { getMenu } from "../../api";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  //   在登陆状态下，需要跳转到home
  if (localStorage.getItem("token")) {
    return <Navigate to="/home" />;
  }
  const handleSubmit = (val) => {
    if (!val.password || !val.userName) {
      return message.open({
        type: "warning",
        content: "请输入账号和密码",
      });
    }

    getMenu(val).then(({ data }) => {
      localStorage.setItem("token", JSON.stringify(data.data.token));
      navigate("/home");
    });
  };

  return (
    <Form className="login-container" onFinish={handleSubmit}>
      <div className="login-title">系统登陆</div>
      <Form.Item label="账号" name="userName">
        <Input placeholder="请输入账号"></Input>
      </Form.Item>
      <Form.Item label="密码" name="password">
        <Input.Password placeholder="请输入密码"></Input.Password>
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
