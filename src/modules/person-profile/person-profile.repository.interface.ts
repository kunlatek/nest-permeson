import { CreatePersonProfileDto, UpdatePersonProfileDto, PersonProfileResponseDto } from "./dto";

export interface PersonProfileRepository {
  create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfileResponseDto>;
  
  findById(id: string): Promise<PersonProfileResponseDto>;
  
  findByUserId(userId: string): Promise<PersonProfileResponseDto>;
  
  update(id: string, personProfileDto: Partial<UpdatePersonProfileDto>): Promise<PersonProfileResponseDto>;
  
  delete(id: string): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;

  findByUserIds(userIds: string[]): Promise<PersonProfileResponseDto[]>;
  
  findByUsernameLike(username: string, page: number, limit: number): Promise<{ profiles: PersonProfileResponseDto[], total: number }>;
}