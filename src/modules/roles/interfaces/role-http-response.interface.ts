import { ApiProperty } from '@nestjs/swagger';
import { IHttpResponse } from 'src/interfaces/http-response.interface';
import { RoleResponseDto } from '../dto';

export class IRoleHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: RoleResponseDto,
    description: 'Role data',
  })
  data?: RoleResponseDto;

  constructor(statusCode: number, message: string, data?: RoleResponseDto) {
    super(statusCode, message);
    this.data = data;
  }
}

export class IRolesHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [RoleResponseDto],
    description: 'List of roles',
  })
  data?: RoleResponseDto[];

  constructor(statusCode: number, message: string, data?: RoleResponseDto[]) {
    super(statusCode, message);
    this.data = data;
  }
}

export class IRolesPaginatedHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [RoleResponseDto],
    description: 'List of roles',
  })
  data?: RoleResponseDto[];

  @ApiProperty({
    example: 100,
    description: 'Total number of roles',
  })
  total?: number;

  @ApiProperty({
    example: 1,
    description: 'Current page',
  })
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Items per page',
  })
  limit?: number;

  constructor(
    statusCode: number,
    message: string,
    data?: RoleResponseDto[],
    total?: number,
    page?: number,
    limit?: number,
  ) {
    super(statusCode, message);
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

