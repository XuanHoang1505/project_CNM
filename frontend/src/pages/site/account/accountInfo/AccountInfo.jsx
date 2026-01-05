import { useEffect, useRef, useState, useContext } from "react";
import { Form, Input, Radio, Button, Upload, Alert, Spin } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import UserService from "@/services/admin/UserService";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "@/utils/formatDate";
import { UserContext } from "@/contexts/UserContext";
import { toast } from "react-toastify";

const { TextArea } = Input;

function AccountInfo() {
  const { user, updateUser } = useContext(UserContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [fileList, setFileList] = useState([]);
  console.log(user);
  

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user?.id]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const data = await UserService.getUserById(userId);
      setProfile(data);

            
      
      form.setFieldsValue({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        gender: data.gender === null ? undefined : data.gender ? "Nam" : "Nữ",
        additionalInfo: data.additionalInfo || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Không thể tải thông tin người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      setSelectedAvatar(file);
    } else {
      setSelectedAvatar(null);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Vui lòng chọn một tệp ảnh hợp lệ!");
      return Upload.LIST_IGNORE;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.error("Kích thước ảnh không được vượt quá 10MB!");
      return Upload.LIST_IGNORE;
    }

    return false; // Prevent auto upload
  };

  const handleFormSubmit = async (values) => {
    try {
      setUpdating(true);

      const updatedData = {
        ...profile,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        gender: values.gender === "Nam" ? true : false,
      };

      const updatedProfile = await UserService.updateUser(
        profile.id,
        updatedData,
        selectedAvatar
      );

      setProfile({
        ...updatedProfile,
        gender: updatedProfile.gender ? "Nam" : "Nữ",
      });

      const updatedUser = {
        userId: updatedProfile.id,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        role: user.role,
      };
      updateUser(updatedUser);

      toast.success("Cập nhật hồ sơ của bạn thành công!");
      setSelectedAvatar(null);
      setFileList([]);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Cập nhật thất bại! Vui lòng thử lại.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Thông tin tài khoản</h3>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        autoComplete="off"
        className="bg-white p-6"
      >
        {/* Row 1: Họ tên, Email, Ảnh đại diện */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              { required: true, message: "Họ và tên không được để trống." },
              {
                pattern: /^[^0-9]*$/,
                message: "Tên không được chứa chữ số.",
              },
            ]}
          >
            <Input placeholder="Họ tên" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống." },
              { type: "email", message: "Email không hợp lệ." },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item label="Ảnh đại diện" name="avatar">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleAvatarChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} size="large">
                Chọn ảnh
              </Button>
            </Upload>
          </Form.Item>
        </div>

        {/* Row 2: Điện thoại, Giới tính */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Form.Item
            label="Điện thoại"
            name="phoneNumber"
            rules={[
              {
                pattern: /^[0-9]{10,15}$/,
                message: "Số điện thoại không hợp lệ.",
              },
            ]}
          >
            <Input placeholder="Điện thoại" size="large" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Radio.Group size="large">
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
              <Radio value="Khác">Khác</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Row 3: Thông tin thêm */}
        <Form.Item label="Thông tin thêm" name="additionalInfo">
          <TextArea rows={3} placeholder="Thông tin thêm" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="text-center mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={updating}
            size="large"
            className="px-8"
          >
            {updating ? "Đang cập nhật..." : "Lưu thay đổi"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AccountInfo;