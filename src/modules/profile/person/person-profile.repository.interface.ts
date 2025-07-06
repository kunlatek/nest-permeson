import { CreatePersonProfileDto, PersonProfileFilterDto, UpdatePersonProfileDto } from "./dto";
import { PersonProfile } from "./models";

export interface PersonProfileRepository {
  create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfile>;
  
  findById(id: string): Promise<PersonProfile>;
  
  findByUserId(userId: string): Promise<PersonProfile>;
  
  findAll(params: PersonProfileFilterDto): Promise<PersonProfile[]>;

  count(params: Partial<PersonProfileFilterDto>): Promise<number>;
  
  update(id: string, personProfileDto: UpdatePersonProfileDto): Promise<PersonProfile>;
  
  delete(id: string): Promise<void>;
}