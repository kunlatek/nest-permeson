import { DatabaseEnum } from "src/enums/database.enum";

// MongoDB
import { InvitationModule as InvitationModuleMongoDB } from "./repositories/mongodb/invitation.module";

export const InvitationModule = (database: DatabaseEnum) => {
  if (database === DatabaseEnum.MONGODB) {
    return [InvitationModuleMongoDB];
  }
  return [];
};