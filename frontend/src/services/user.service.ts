import axios from "../lib/axios";
import { ApiResponse } from "../types/api";
import { User } from "../types/user";

export const userService = {
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axios.get("/users");
    return response.data;
  },
};
