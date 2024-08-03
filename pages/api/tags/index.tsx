import connectDBV2 from "@/app/Utils/db/connection";
import { errorHandle } from "@/app/Utils/errorHandler/error";
import Tags from "@/app/Utils/models/tags.model";

import User from "@/app/Utils/models/user.model";
import { NextApiRequest, NextApiResponse } from "next";

connectDBV2();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token;
  if (!token) {
    return;
  }
  const userId = errorHandle(token || "", req, res, "GET");
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Böyle Bir Kullanıcı Bulunamıyor" });
    }

    const tags = await Tags.find({});
    return res.status(200).json({
      data: tags,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
export default handler;
