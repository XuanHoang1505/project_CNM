import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

const AUTH_URL = "/auth";


export const googleLogin = async (credential) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/social-login`, {
      provider: 'google',
      access_token: credential,
    });

    console.log(">>> check res", response);
    
    let token = response.data.access_token;

    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userDetail", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};


export const facebookLogin = async (accessToken) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/social-login`, {
      provider: 'facebook',
      access_token: accessToken,
    });

    let token = response.data.access_token;

    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userDetail", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};