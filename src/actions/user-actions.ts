import { updateMyProfile } from "@/lib/firebase/user";
import { IFormUserProfileData } from "@/types";
import { revalidatePath } from "next/cache";

export const editProfile = async (
  id: string,
  data: IFormUserProfileData,
  currentProfilePhoto?: string
) => {
  try {
    await updateMyProfile(id, data, currentProfilePhoto);
    revalidatePath("/user/${id}", "page");
  } catch (error) {
    throw new Error("Failed to update profile");
  }
};
