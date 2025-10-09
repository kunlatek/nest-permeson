import { Inject, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserService } from "../user/user.service";
import { EmailService } from "../auth/services/email.service";

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly DAYS_UNTIL_HARD_DELETE = 90;
  private readonly WARNING_DAYS_BEFORE = 7;

  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
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

  @Cron('0 10 * * *', {
    timeZone: 'America/Sao_Paulo',
  })
  async handleDeletedUsersCleanup() {
    this.logger.log('Running deleted users cleanup job at 10:00 AM');

    try {
      const usersWithDeletedAt = await this.userService.findUsersWithDeletedAt();
      this.logger.log(`Found ${usersWithDeletedAt.length} users with deletedAt`);

      for (const user of usersWithDeletedAt) {
        const deletedAt = new Date(user.deletedAt);
        const now = new Date();
        const daysSinceDelete = Math.floor(
          (now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Se passou mais de DAYS_UNTIL_HARD_DELETE dias, fazer hard delete
        if (daysSinceDelete >= this.DAYS_UNTIL_HARD_DELETE) {
          this.logger.log(`Hard deleting user ${user.email} (${daysSinceDelete} days since soft delete)`);
          try {
            await this.userService.hardDeleteUser(user._id);
            this.logger.log(`Successfully hard deleted user ${user.email}`);
          } catch (error) {
            this.logger.error(`Error hard deleting user ${user.email}:`, error);
          }
        }
        // Se está a WARNING_DAYS_BEFORE dias de dar DAYS_UNTIL_HARD_DELETE, enviar email de aviso
        else if (daysSinceDelete === (this.DAYS_UNTIL_HARD_DELETE - this.WARNING_DAYS_BEFORE)) {
          this.logger.log(`Sending deletion warning to user ${user.email} (${this.WARNING_DAYS_BEFORE} days remaining)`);
          try {
            await this.emailService.sendAccountDeletionWarning(user.email, this.WARNING_DAYS_BEFORE);
            this.logger.log(`Successfully sent warning email to ${user.email}`);
          } catch (error) {
            this.logger.error(`Error sending warning email to ${user.email}:`, error);
          }
        }
      }

      this.logger.log('Deleted users cleanup job completed');
    } catch (error) {
      this.logger.error('Error during deleted users cleanup job:', error);
    }
  }
}
