import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class CleanupService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async removeTestUser(email: string) {
    // Find the user with the specified email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const userId = user._id.toString();

    // Delete all related person profiles
    // await this.personProfileService.deleteByUserId(userId);

    // Delete all related company profiles
    // await this.companyProfileService.deleteByUserId(userId);

    // Delete the user
    await this.userService.softDeleteUser(userId);

    return {
      message: `User ${email} removed successfully`,
      details: {
        userId,
        deletedPersonProfiles: 1,
        deletedCompanyProfiles: 1,
      },
    };
  }
}
