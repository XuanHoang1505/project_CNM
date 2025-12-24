import { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Avatar,
  Spin,
  message,
} from "antd";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
// import { Helmet } from "react-helmet-async";
import TableManagement from "@/components/admin/common/table/TableManagement";
import UserService from "@/services/admin/UserService";
import Page500 from "@/pages/page500/Page500";
import defaultAvatar from "@/assets/site/images/avatar-default-lg.png";
import { toast } from "react-toastify";

const { Option } = Select;

const UserManagement = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    phoneNumber: "",
    avatar: "",
    birthDate: "",
    gender: "",
    username: "",
    email: "",
    role: "USER",
    status: "ACTIVE",
    registeredDate: "",
    lastLogin: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: true,
    btnSetting: false,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const fileInputRef = useRef(null);

  const userColumns = [
    { key: "avatar", label: "Avatar" },
    { key: "id", label: "ID" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
  ];

  const keysToRemove = ["id"];
  const defaultColumns = userColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchUserData = async () => {
    setLoadingPage(true);
    try {
      const data = await UserService.getUsers();
      const formattedData = data.map((user) => ({
        ...user,
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
        gender: user.gender === null ? "" : user.gender ? "1" : "0",
      }));
      setUserData(formattedData);
    } catch (err) {
      setErrorServer(err.message);
      console.log(err);
      
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus,
      ...newStatus,
    }));
  };


  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Vui lòng chọn một tệp ảnh hợp lệ!");
        return;
      }

      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        message.error("Kích thước ảnh không được vượt quá 10MB!");
        return;
      }

      setSelectedAvatar(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      id: "",
      fullName: "",
      phoneNumber: "",
      avatar: "",
      gender: "",
      email: "",
      role: "USER",
      status: "ACTIVE",
    });
    form.resetFields();
    handleResetStatus();
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      gender: item.gender ?? "",
    });
    form.setFieldsValue({
      fullName: item.fullName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      gender: item.gender,
      role: item.role,
      status: item.status === "ACTIVE",
    });
    updateStatus({ isEditing: true });
  };

  const handleViewDetail = async (item) => {
    updateStatus({ isAdd: false, isEditing: false, isViewDetail: true });
    setFormData({
      ...item,
    });
  };

  const handleSaveItem = async () => {
    try {
      await form.validateFields();
      setIsLoading(true);

      if (statusFunction.isEditing) {
        const updatedFormData = {
          ...formData,
          gender:
            formData.gender === ""
              ? null
              : formData.gender === "1"
              ? true
              : false,
        };
        const updatedUser = await UserService.updateUser(
          formData.id,
          updatedFormData,
          selectedAvatar
        );
        console.log(updatedUser);
        
        const formattedUser = {
          ...updatedUser,
          gender: formData.gender === null ? "" : formData.gender ? "1" : "0",
        };

        const updatedUsers = userData.map((user) =>
          user.id === formattedUser.id ? formattedUser : user
        );

        setUserData(updatedUsers);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        const cleanString = (value) => (value?.trim() === "" ? null : value);

        const { id, ...rest } = formData;

        const newFormData = {
          ...rest,
          avatar: cleanString(rest.avatar),
          phoneNumber: cleanString(rest.phoneNumber),
          gender:
            rest.gender === "" ? null : rest.gender === "1" ? true : false,
          status: rest.status,
        };

        const newUser = await UserService.createUser(newFormData);
        const formattedUser = {
          ...newUser,
          gender:
            formData.gender === null
              ? ""
              : formData.gender === true
              ? "1"
              : "0",
        };

        setUserData([...userData, formattedUser]);
        message.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        console.error("Lỗi khi lưu user:", error);
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await UserService.deleteUser(deleteId);
      setUserData((prevData) =>
        prevData.filter((item) => item.id !== deleteId)
      );
      message.success("Xóa thành công!");
    } catch (error) {
      message.error("Xóa không thành công!");
      console.error("Lỗi khi xóa user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <>
      {formData && statusFunction.isEditing ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-start w-full md:w-1/3">
            <div onClick={handleAvatarClick} className="cursor-pointer mb-3">
              <Avatar
                size={150}
                src={formData.avatar || defaultAvatar}
                icon={!formData.avatar && <UserOutlined />}
                className="border-4 border-black"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <small className="text-blue-600 italic text-center">
              Nhấp vào ảnh để thay đổi!
            </small>
          </div>

          {/* Form Section */}
          <div className="flex-1">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                gender: formData.gender,
                role: formData.role,
                status: formData.status === "ACTIVE",
              }}
            >
              {/* <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Tên không được để trống." },
                  {
                    pattern: /^[^\d]*$/,
                    message: "Tên không được chứa số.",
                  },
                ]}
              >
                <Input
                  placeholder="VD: Nguyễn Văn A"
                  maxLength={100}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full"
                />
              </Form.Item> */}

              {/* <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống." },
                  { type: "email", message: "Email không hợp lệ." },
                ]}
              >
                <Input
                  placeholder="Nhập email"
                  maxLength={100}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full"
                />
              </Form.Item> */}

              {/* <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    pattern: /^[0-9]{10,15}$/,
                    message: "Số điện thoại không hợp lệ.",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  maxLength={15}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="w-full"
                />
              </Form.Item> */}

              {/* <Form.Item label="Giới tính" name="gender">
                <Select
                  placeholder="Chọn giới tính"
                  onChange={(value) => handleInputChange("gender", value)}
                  className="w-full"
                >
                  <Option value="">Chưa có</Option>
                  <Option value="1">Nam</Option>
                  <Option value="0">Nữ</Option>
                </Select>
              </Form.Item> */}

              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò." }]}
              >
                <Select
                  onChange={(value) => handleInputChange("role", value)}
                  className="w-full"
                >
                  <Option value="ADMIN">Quản Trị</Option>
                  <Option value="USER">Người dùng</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Vô hiệu hóa"
                  onChange={(checked) =>
                    handleInputChange("status", checked ? "ACTIVE" : "DISABLED")
                  }
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            status: formData.status === "ACTIVE",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: "Tên không được để trống." },
                {
                  pattern: /^[^\d]*$/,
                  message: "Tên không được chứa số.",
                },
              ]}
            >
              <Input
                placeholder="VD: Nguyen Van A"
                maxLength={100}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống." },
                { type: "email", message: "Email không hợp lệ." },
              ]}
            >
              <Input
                placeholder="Nhập email"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò." }]}
            >
              <Select onChange={(value) => handleInputChange("role", value)}>
                <Option value="ADMIN">Quản Trị</Option>
                <Option value="USER">Người dùng</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Trạng thái" name="status" valuePropName="checked">
              <Switch
                checkedChildren="Hoạt động"
                unCheckedChildren="Vô hiệu hóa"
                onChange={(checked) =>
                  handleInputChange("status", checked ? "ACTIVE" : "DISABLED")
                }
              />
            </Form.Item>
          </div>
        </Form>
      )}
    </>
  );

  return (
    <>
      {/* <Helmet>
        <title>Quản lý người dùng - Star Movie</title>
      </Helmet> */}
      {loadingPage ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="m-0 p-0">
          <TableManagement
            columns={userColumns}
            data={userData}
            title={"Quản lý người dùng"}
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
            buttonCustom={button}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};

export default UserManagement;
