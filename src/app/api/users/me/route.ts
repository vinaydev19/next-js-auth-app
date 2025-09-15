import { dbConnect } from "@/app/db/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";

dbConnect();

export async function GET(request: NextRequest) {
  const userid = await getDataFromToken(request);

  const user = await User.findOne({ _id: userid }).select("-password");

  return NextResponse.json({
    message: "user found",
    data: user,
    success: true,
  });
}
