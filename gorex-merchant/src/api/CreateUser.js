import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";


const CreateUser = async () => {
  const body = {
    name: "Api",
    last_name: "User123",
    phone: "+9214345609123",
    email: "ast.mm103@gmail.com",
    date_of_birth: "2021-01-01",
    gender: "male",
    password: "Pass@1122",
    confirm_password: "Pass@1122",
    type: "driver",
  };

  return axiosInstance.post(`/register/api/action`, body).then((response) => {
      return {
        success: response?.data?.result,
        response: response?.data?.result
          ? response?.data?.result
          : response?.data?.error?.data?.message,
      };
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default CreateUser;
