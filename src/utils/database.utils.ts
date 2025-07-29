import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseEnum } from "src/enums/database.enum";

export const getDatabaseConfig = (database: DatabaseEnum) => {
  switch (database) {
    case DatabaseEnum.MONGODB:
      return MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/rapida-quickstart');
    case DatabaseEnum.SQLITE:
      return TypeOrmModule.forRoot({ type: 'sqlite', database: 'db.sqlite', synchronize: true, autoLoadEntities: true });
    case DatabaseEnum.POSTGRES:
      return TypeOrmModule.forRoot({ type: 'postgres', url: process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost:5432/rapida-quickstart', synchronize: true, autoLoadEntities: true });
  }
};

export const getDatabaseModule = (database: DatabaseEnum, modules: { database: DatabaseEnum, module: any }[]) => {
  switch (database) {
    case DatabaseEnum.MONGODB:
      return modules.find((module) => module.database === DatabaseEnum.MONGODB);
    case DatabaseEnum.SQLITE:
      return modules.find((module) => module.database === DatabaseEnum.SQLITE);
    case DatabaseEnum.POSTGRES:
      return modules.find((module) => module.database === DatabaseEnum.POSTGRES);
  }
};