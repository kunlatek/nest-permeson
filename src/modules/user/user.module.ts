import { DatabaseEnum } from "src/enums/database.enum";

// MongoDB
import { UserModule as UserModuleMongoDB } from "./repositories/mongodb/user.module";

export const UserModule = (database: DatabaseEnum) => {
  if (database === DatabaseEnum.MONGODB) {
    return [UserModuleMongoDB];
  }
  return [];
};