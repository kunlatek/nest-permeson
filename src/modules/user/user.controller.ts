import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UnauthorizedException, UseGuards, BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserByInvitationDto, CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiSecurity } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/enums/user-role.enum";
import { AuthGuard } from "@nestjs/passport";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { IUserHttpResponse, IUserHttpResponsePaginated } from "./interfaces";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUserDto, description: "Email and password, password must have min length = 8" })
  @ApiResponse({ status: 201, description: "User created successfully", type: IUserHttpResponse })
  @ApiResponse({ status: 409, description: "Email already exists" })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUserHttpResponse> {
    const user = await this.userService.createUser(createUserDto);
    return new IUserHttpResponse(201, "User created successfully", user);
  }

  @Post("invitation")
  @ApiOperation({ summary: "Create a new user from invitation" })
  @ApiBody({ type: CreateUserByInvitationDto })
  @ApiResponse({ status: 201, description: "User created successfully", type: IUserHttpResponse })
  @ApiResponse({ status: 409, description: "Email already exists" })
  @ApiResponse({ status: 404, description: "Invitation not found" })
  @ApiResponse({ status: 400, description: "Invitation already accepted" })
  async createUserByInvitation(@Body() createUserByInvitationDto: CreateUserByInvitationDto): Promise<IUserHttpResponse> {
    try {
      const user = await this.userService.createUserByInvitation(createUserByInvitationDto);
      return new IUserHttpResponse(201, "User created successfully", user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  async findAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
  ): Promise<IUserHttpResponsePaginated> {
    try {
      const users = await this.userService.findAll();
      return new IUserHttpResponsePaginated(users, users.length, page, limit);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get("me")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN, UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Get my user" })
  async findMe(@Req() req): Promise<IUserHttpResponse> {
    const userId = req.user?.sub ?? req.user?.userId; // Corrigido: pega ID do JWT
    if (!userId) throw new UnauthorizedException('Invalid token');
    try {
      const user = await this.userService.findMe(userId);
      return new IUserHttpResponse(200, 'User fetched successfully', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get("has-profile")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Check if user has a profile" })
  async userHasProfile(@Req() req): Promise<IUserHttpResponse> {
    const userId = req.user?.sub ?? req.user?.userId; // Corrigido: pega ID do JWT
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const user = await this.userService.userHasProfile(userId);
      return new IUserHttpResponse(200, 'User has profile', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(":id")
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get a user by ID" })
  async findOne(@Param("id") id: string): Promise<IUserHttpResponse> {
    try {
      const user = await this.userService.findOne(id);
      return new IUserHttpResponse(200, 'User fetched successfully', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch("restore")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Restore own soft-deleted profile" })
  async restoreOwnProfile(@Req() req): Promise<IUserHttpResponse> {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      await this.userService.restoreUser(req.user.userId);
      return new IUserHttpResponse(200, 'User restored successfully', null);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch("change-password")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  @ApiResponse({ status: 404, description: "User not found" })
  async changePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<IUserHttpResponse> {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const { oldPassword, newPassword } = updatePasswordDto;

    try {
      await this.userService.updatePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );

      return new IUserHttpResponse(200, 'Password changed successfully', null);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(":id")
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update a user by ID" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<IUserHttpResponse> {
    try {
      const user = await this.userService.updateUser(id, updateUserDto);
      return new IUserHttpResponse(200, 'User updated successfully', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Soft delete a user by ID" })
  async softDeleteUser(@Param("id") id: string): Promise<IUserHttpResponse> {
    try {
      await this.userService.softDeleteUser(id);
      return new IUserHttpResponse(200, 'User soft deleted successfully', null);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Soft delete own profile" })
  async softDeleteOwnProfile(@Req() req): Promise<IUserHttpResponse> {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      await this.userService.softDeleteUser(req.user.userId);
      return new IUserHttpResponse(200, 'User soft deleted successfully', null);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
