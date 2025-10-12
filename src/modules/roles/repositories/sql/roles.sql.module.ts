import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./role.entity";
import { RolesSQLRepository } from "./roles.sql.repository";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [
    {
      provide: 'RolesRepository',
      useClass: RolesSQLRepository,
    },
  ],
  exports: ['RolesRepository'],
})
export class RolesSQLModule {}

