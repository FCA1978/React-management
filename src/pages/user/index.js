import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Table,
  Popconfirm,
  Modal,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import "./user.css";
import { getUser, addUser, editUser, deleteUser } from "../../api";
import dayjs from "dayjs";

const User = () => {
  const [listData, setListData] = useState({
    name: "",
  });

  const [tableData, setTableData] = useState([]);

  const [modalType, setModalType] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 创建form实例
  const [form] = Form.useForm();
  const getTableData = () => {
    getUser(listData).then(({ data }) => {
      setTableData(data.list);
    });
  };

  // 提交
  const handleFinish = (e, rowData) => {
    setListData({
      name: e.keyword,
    });
  };

  useEffect(() => {
    getTableData();
  }, [listData]);
  // 新增/编辑
  const handleClick = (type, rowData) => {
    setIsModalOpen(!isModalOpen);
    if (type === "add") {
      setModalType(0);
    } else {
      setModalType(1);
      const cloneData = JSON.parse(JSON.stringify(rowData));
      cloneData.birth = dayjs(cloneData.birth);
      // 表单数据回填
      form.setFieldsValue(cloneData);
    }
  };

  // 删除
  const handleDelete = ({ id }) => {
    deleteUser({ id }).then((res) => {
      getTableData();
    });
  };

  // 弹窗确定
  const handleOk = () => {
    // 表单校验
    form
      .validateFields()
      .then((val) => {
        // 日期参数处理
        val.birth = dayjs(val.birth).format("YYYY-MM-DD");
        console.log(val, "val~");

        // 调接口
        if (modalType) {
          // 编辑
          editUser(val).then((res) => {
            handleCancel();
            getTableData();
          });
        } else {
          // 新增
          addUser(val).then((res) => {
            handleCancel();
            getTableData();
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
    {
      title: "性别",
      dataIndex: "sex",
      render: (val) => {
        return val === 1 ? "男" : "女";
      },
    },
    {
      title: "出生日期",
      dataIndex: "birth",
    },
    {
      title: "地址",
      dataIndex: "addr",
    },
    {
      title: "操作",
      render: (rowData) => {
        return (
          <div className="flex-box">
            <Button
              style={{ marginRight: "5px" }}
              onClick={() => handleClick("edit", rowData)}
            >
              编辑
            </Button>
            <Popconfirm
              title="提示"
              description="此操作将删除该用户，是否继续？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDelete(rowData)}
            >
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    // 调用后端接口获取用户列表数据
    getTableData();
  }, []);

  return (
    <div className="user">
      <div className="flex-box space-between">
        <Button type="primary" onClick={() => handleClick("add")}>
          新增
        </Button>
        <Form layout="inline" onFinish={handleFinish}>
          <Form.Item name="keyword">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        style={{ marginTop: "10px" }}
        columns={columns}
        dataSource={tableData}
        rowKey={"id"}
      ></Table>
      {/* 弹窗 */}
      <Modal
        open={isModalOpen}
        title={modalType ? "编辑用户" : "新增用户"}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          labelAlign="left"
        >
          {modalType === 1 && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item
            label="年龄"
            name="age"
            rules={[
              { required: true, message: "请输入年龄" },
              {
                type: "number",
                message: "年龄必须是数字",
              },
            ]}
          >
            <InputNumber placeholder="请输入年龄"></InputNumber>
          </Form.Item>
          <Form.Item
            label="性别"
            name="sex"
            rules={[{ required: true, message: "性别是必选的" }]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: "0", label: "男" },
                { value: "1", label: "女" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="出生日期"
            name="birth"
            rules={[{ required: true, message: "请选择出生日期" }]}
          >
            <DatePicker placeholder="请选择" format="YYYY / MM / DD" />
          </Form.Item>
          <Form.Item
            label="地址"
            name="addr"
            rules={[{ required: true, message: "请填写地址" }]}
          >
            <Input placeholder="请填写地址"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
