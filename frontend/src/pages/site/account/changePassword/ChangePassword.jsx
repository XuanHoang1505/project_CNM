import { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import UserService from "@/services/admin/UserService";
import { toast } from "react-toastify";

function ChangePassword({ user }) {
  const [form] = Form.useForm();
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async (values) => {
    try {
      setChanging(true);
      await UserService.changePassword(
        user.email,
        values.currentPassword,
        values.newPassword
      );
      toast.success("Your password was changed successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Password change failed! Please check again.");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="w-full">
      {/* Title */}
      <div className="border-b border-gray-300 pb-3 mb-6">
        <h3 className="text-2xl font-bold text-blue-900">Change Password</h3>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleChangePassword}
        autoComplete="off"
      >
        {/* Mật khẩu hiện tại */}
        <Form.Item
          label={
            <span className="font-bold">
              Current password <span className="text-red-600">*</span>
            </span>
          }
          name="currentPassword"
          rules={[
            {
              required: true,
              message: "Mật khẩu hiện tại không được để trống.",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu hiện tại"
            size="large"
          />
        </Form.Item>

        {/* Mật khẩu mới */}
        <Form.Item
          label={
            <span className="font-bold">
              New password <span className="text-red-600">*</span>
            </span>
          }
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Mật khẩu mới không được để trống.",
            },
            {
              min: 6,
              message: "Mật khẩu mới phải ít nhất 6 ký tự.",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu mới"
            size="large"
          />
        </Form.Item>

        {/* Nhập lại mật khẩu mới */}
        <Form.Item
          label={
            <span className="font-bold">
              Confirm Password <span className="text-red-600">*</span>
            </span>
          }
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lại mật khẩu mới.",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp.")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Nhập lại mật khẩu mới"
            size="large"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="text-center mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={changing}
            size="large"
            className="px-8 mt-3"
          >
            {changing ? "Đang đổi..." : "Cập nhật mật khẩu"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;