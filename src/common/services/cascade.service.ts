import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CascadeService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async findEntitiesWithCreatedBy(): Promise<string[]> {
    const entities = this.dataSource.entityMetadatas;
    const entitiesWithCreatedBy: string[] = [];

    for (const entity of entities) {
      const hasCreatedBy = entity.columns.some(column => column.propertyName === 'createdBy');
      if (hasCreatedBy) {
        entitiesWithCreatedBy.push(entity.tableName);
      }
    }

    return entitiesWithCreatedBy;
  }

  async cascadeSoftDeleteByEntity(userId: string): Promise<void> {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const hasCreatedBy = entity.columns.some(column => column.propertyName === 'createdBy');
      if (!hasCreatedBy) continue;

      const hasDeletedAt = entity.columns.some(column => column.propertyName === 'deletedAt');
      const repository = this.dataSource.getRepository(entity.target);

      try {
        if (hasDeletedAt) {
          // Soft delete
          await repository.update(
            { createdBy: userId },
            { deletedAt: new Date() }
          );
        } else {
          // Hard delete
          await repository.delete({ createdBy: userId });
        }
      } catch (error) {
        console.warn(`Failed to cascade delete for entity ${entity.tableName}:`, error.message);
      }
    }
  }

  async cascadeHardDeleteByEntity(userId: string): Promise<void> {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const hasCreatedBy = entity.columns.some(column => column.propertyName === 'createdBy');
      if (!hasCreatedBy) continue;

      const repository = this.dataSource.getRepository(entity.target);

      try {
        await repository.delete({ createdBy: userId });
      } catch (error) {
        console.warn(`Failed to cascade hard delete for entity ${entity.tableName}:`, error.message);
      }
    }
  }

  async cascadeRestoreByEntity(userId: string): Promise<void> {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const hasCreatedBy = entity.columns.some(column => column.propertyName === 'createdBy');
      const hasDeletedAt = entity.columns.some(column => column.propertyName === 'deletedAt');
      
      if (!hasCreatedBy || !hasDeletedAt) continue;

      const repository = this.dataSource.getRepository(entity.target);

      try {
        await repository.update(
          { createdBy: userId },
          { deletedAt: null }
        );
      } catch (error) {
        console.warn(`Failed to cascade restore for entity ${entity.tableName}:`, error.message);
      }
    }
  }

  // Legacy methods for backward compatibility
  async findTablesWithCreatedBy(): Promise<string[]> {
    return this.findEntitiesWithCreatedBy();
  }

  async cascadeSoftDelete(userId: string): Promise<void> {
    return this.cascadeSoftDeleteByEntity(userId);
  }

  async cascadeHardDelete(userId: string): Promise<void> {
    return this.cascadeHardDeleteByEntity(userId);
  }

  async cascadeRestore(userId: string): Promise<void> {
    return this.cascadeRestoreByEntity(userId);
  }
} 