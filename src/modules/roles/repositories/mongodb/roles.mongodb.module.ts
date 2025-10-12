import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoDBRole, RoleSchema } from "./role.schema";
import { RolesMongoDBRepository } from "./roles.mongodb.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MongoDBRole.name, schema: RoleSchema }]),
  ],
  providers: [
    {
      provide: 'RolesRepository',
      useClass: RolesMongoDBRepository,
    },
  ],
  exports: ['RolesRepository'],
})
export class RolesMongoDBModule {}

