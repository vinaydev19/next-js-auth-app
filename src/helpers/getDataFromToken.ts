import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    const decodeToken:any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    return decodeToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
