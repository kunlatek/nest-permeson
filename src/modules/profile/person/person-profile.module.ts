import { DatabaseEnum } from "src/enums/database.enum";

// MongoDB
import { PersonProfileModule as PersonProfileModuleMongoDB } from "./repositories/mongodb/person-profile.module";

export const PersonProfileModule = (database: DatabaseEnum) => {
    if (database === DatabaseEnum.MONGODB) {
        return [PersonProfileModuleMongoDB];
    }
    return [];
};