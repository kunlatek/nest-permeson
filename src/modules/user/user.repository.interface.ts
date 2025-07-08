import { CreateUserDto, UserResponseDto, UpdateUserDto, UserFilterDto } from "./dto";

export interface UserRepository {
  create(userDto: CreateUserDto): Promise<UserResponseDto>;
  
  findById(id: string): Promise<UserResponseDto | null>;
  
  findByEmail(email: string): Promise<UserResponseDto | null>;
  
  findAll(params: UserFilterDto): Promise<UserResponseDto[]>;

  count(params: Partial<UserFilterDto>): Promise<number>;
  
  update(id: string, userDto: Partial<UpdateUserDto>): Promise<UserResponseDto>;
  
  delete(id: string): Promise<void>;
}