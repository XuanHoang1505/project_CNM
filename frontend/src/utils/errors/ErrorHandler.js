import { toast } from "react-toastify";

function handleErrorResponse(error) {
  const { response } = error;

  if (!response) {
    toast.error(
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
    );
    return;
  }

  const { status, data } = response;
  const { message, errorCode } = data;

  if (errorCode) {
    console.log(errorCode);
  } else if (message) {
    toast.error(message);
  } else if (status >= 500) {
    toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
  } else if (status == 400) {
    toast.error("Yêu cầu không hợp lệ!");
  } else if (status == 403) {
    toast.error("Không đủ quyền truy cập tài nguyên này!");
  } 
  console.error(error);
}

export default handleErrorResponse;
