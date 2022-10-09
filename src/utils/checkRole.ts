import User, { RoleType } from "../models/user";

export const accessAllowed = async (data: any, role: RoleType | RoleType[]) => {
  const result = await User.findById(data.id);
  if(typeof role === "string"){
    return result?.role === role;
  }
  else{
    return role.includes(result?.role as RoleType);
  }
}
