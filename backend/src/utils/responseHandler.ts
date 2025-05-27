import { Response } from "express";

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  const response: ApiResponse = {
    success,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};
