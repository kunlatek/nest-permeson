import { DatabaseEnum } from "src/enums/database.enum";

// MongoDB
import { CompanyProfileModule } from "./company/repositories/mongodb/company-profile.module";
import { PersonProfileModule } from "./person/repositories/mongodb/person-profile.module";

export const ProfileModule = (database: DatabaseEnum) => {
  if (database === DatabaseEnum.MONGODB) {
    return [PersonProfileModule, CompanyProfileModule];
  }
  return [];
};