import mongoose from "mongoose";

export async function dbConnect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("db is connectd");
    });

    connection.on("error", (error) => {
      console.log("db is failed to connect", error);
      process.exit()
    });
  } catch (error) {
    console.log("something want wrong whlie connect the db");
    console.log(error);
  }
}
