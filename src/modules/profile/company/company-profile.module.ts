import { DatabaseEnum } from "src/enums/database.enum";

// MongoDB
import { CompanyProfileModule as CompanyProfileModuleMongoDB } from "./repositories/mongodb/company-profile.module";

export const CompanyProfileModule = (database: DatabaseEnum) => {
    if (database === DatabaseEnum.MONGODB) {
        return [CompanyProfileModuleMongoDB];
    }
    return [];
};