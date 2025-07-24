import { DatabaseEnum } from "src/enums/database.enum";

// MongoDB
import { WorkspaceModule as WorkspaceModuleMongoDB } from "./repositories/mongodb/workspace.module";

export const WorkspaceModule = (database: DatabaseEnum) => {
  if (database === DatabaseEnum.MONGODB) {
    return [WorkspaceModuleMongoDB];
  }
  return [];
};