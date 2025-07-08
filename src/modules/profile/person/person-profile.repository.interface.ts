import { CreatePersonProfileDto, PersonProfileFilterDto, UpdatePersonProfileDto, PersonProfileResponseDto } from "./dto";

export interface PersonProfileRepository {
  create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfileResponseDto>;
  
  findById(id: string): Promise<PersonProfileResponseDto>;
  
  findByUserId(userId: string): Promise<PersonProfileResponseDto>;
  
  findAll(params: PersonProfileFilterDto): Promise<PersonProfileResponseDto[]>;

  count(params: Partial<PersonProfileFilterDto>): Promise<number>;
  
  update(id: string, personProfileDto: Partial<UpdatePersonProfileDto>): Promise<PersonProfileResponseDto>;
  
  delete(id: string): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;
}