import { dbConnect } from "@/app/db/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/app/helpers/mailer";

dbConnect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = await reqBody;

    console.log(reqBody);

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "user is already created" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // send verification
    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "user registered successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
