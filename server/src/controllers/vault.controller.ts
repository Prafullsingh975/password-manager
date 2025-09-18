import { Response } from "express";
import { Vault } from "../models/vault.model";
import { IAuthRequest } from "../middleware/auth.middleware";

export const getVault = async (req: IAuthRequest, res: Response) => {
  try {
    const vault = await Vault.findOne({ user: req.user!.id });
    if (!vault) {
      // If no vault exists, it's not an error. It just means the user is new.
      // Return null or an empty object to signal the frontend to create one.
      return res.json({ data: null });
    }
    res.json(vault);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const setVault = async (req: IAuthRequest, res: Response) => {
  const { data } = req.body;

  try {
    const vaultFields = {
      user: req.user!.id,
      data,
    };

    // Using findOneAndUpdate with upsert:true will create a new doc if one doesn't exist
    const vault = await Vault.findOneAndUpdate(
      { user: req.user!.id },
      { $set: vaultFields },
      { new: true, upsert: true }
    );
    res.json(vault);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
