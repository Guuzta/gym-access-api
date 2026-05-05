import { Request, Response } from "express";

const index = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: "Hello World!",
  });
};

export { index };
