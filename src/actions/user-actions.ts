import { updateMyProfile } from "@/lib/firebase/user";
import { IFormUserProfileData } from "@/types";
import { revalidatePath } from "next/cache";

export const editProfile = async (
  id: string,
  updatedFields: { username?: string; profilePhoto?: string | null }
) => {
  try {
    await updateMyProfile(id, updatedFields);
    revalidatePath("/user/${id}", "page");
  } catch (error) {
    throw new Error("Failed to update profile");
  }
};
