import { Injectable, NestMiddleware, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { Action } from 'src/modules/roles/models';

/**
 * Middleware for Access Control List (ACL) verification.
 * Validates user permissions based on workspace, role, and requested resource.
 * 
 * This middleware:
 * 1. Extracts JWT token from Authorization header
 * 2. Gets userId and workspaceId from token
 * 3. Finds user's role in workspace ACL
 * 4. Checks if user has permission for the requested module and action
 */
@Injectable()
export class AclMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly workspaceService: WorkspaceService,
    private readonly rolesService: RolesService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract language from headers or use default
      const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';

      // Extract JWT token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(this.i18n.t('translation.auth.invalid-token', { lang }));
      }

      const token = authHeader.substring(7);
      
      // Decode and verify token
      let payload: any;
      try {
        payload = this.jwtService.verify(token);
      } catch (error) {
        throw new UnauthorizedException(this.i18n.t('translation.auth.invalid-token', { lang }));
      }

      const userId = payload.sub;
      const workspaceId = payload.workspaceId;

      if (!userId || !workspaceId) {
        throw new UnauthorizedException(this.i18n.t('translation.auth.invalid-token', { lang }));
      }

      // Get module name from route path
      const moduleName = this.extractModuleName(req.path);
      if (!moduleName) {
        // If no module name can be extracted, skip ACL check
        return next();
      }

      // Get workspace and find user's role in ACL
      const workspaceResponse = await this.workspaceService.findWorkspacesByOwner(userId, lang);
      let workspace = workspaceResponse.data;
      
      // If user is not the owner, try to find workspace by ID
      if (!workspace || workspace._id !== workspaceId) {
        try {
          // Try to get workspace by ID to check if user is in the team
          const allWorkspaces = await this.getAllWorkspacesForUser(userId, workspaceId, lang);
          workspace = allWorkspaces.find(w => w._id === workspaceId);
          
          if (!workspace) {
            throw new ForbiddenException(this.i18n.t('translation.workspace.workspace-not-found', { lang }));
          }
        } catch (error) {
          throw new ForbiddenException(this.i18n.t('translation.workspace.workspace-not-found', { lang }));
        }
      }

      // Check if user is workspace owner (owners have full access)
      if (workspace.owner === userId) {
        return next();
      }

      // Find user's role in ACL
      const userAcl = workspace.acl?.find(acl => acl.userId === userId);
      if (!userAcl) {
        throw new ForbiddenException(this.i18n.t('translation.roles.insufficient-permissions', { lang }));
      }

      // Get role and check permissions
      const roleResponse = await this.rolesService.findById(userAcl.roleId, workspaceId, lang);
      if (!roleResponse || !roleResponse.data || !roleResponse.data.role) {
        throw new ForbiddenException(this.i18n.t('translation.roles.role-not-found', { lang }));
      }
      
      const role = roleResponse.data.role;

      // Get required action based on HTTP method
      const requiredAction = this.getRequiredAction(req.method, req.path);

      // Find module permissions
      const modulePermissions = role.permissions.find(
        permission => permission.module.toLowerCase() === moduleName.toLowerCase()
      );

      if (!modulePermissions) {
        throw new ForbiddenException(
          this.i18n.t('translation.roles.insufficient-permissions', { lang })
        );
      }

      // Check if user has required action permission
      const hasPermission = modulePermissions.actionList.includes(requiredAction as Action);
      if (!hasPermission) {
        throw new ForbiddenException(
          this.i18n.t('translation.roles.insufficient-permissions', { lang })
        );
      }

      // User has permission, proceed
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      // Log unexpected errors but don't expose details to client
      console.error('ACL Middleware Error:', error);
      throw new ForbiddenException('Access denied');
    }
  }

  /**
   * Helper method to get all workspaces for a user
   */
  private async getAllWorkspacesForUser(userId: string, workspaceId: string, lang: string): Promise<any[]> {
    try {
      const myWorkspaces = await this.workspaceService.getMyWorkspaces(userId, lang);
      return myWorkspaces.data || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Extracts module name from request path
   * Example: /api/posts/123 -> posts
   * Example: /posts -> posts
   */
  private extractModuleName(path: string): string | null {
    // Remove leading slash and split by slash
    const segments = path.replace(/^\//, '').split('/');
    
    // Skip common prefixes like 'api', 'v1', etc.
    const skipPrefixes = ['api', 'v1', 'v2', 'v3'];
    let moduleSegment = segments[0];
    
    if (skipPrefixes.includes(moduleSegment.toLowerCase()) && segments.length > 1) {
      moduleSegment = segments[1];
    }

    // Return null if no valid module name
    if (!moduleSegment || moduleSegment.trim() === '') {
      return null;
    }

    return moduleSegment;
  }

  /**
   * Maps HTTP method to required action
   * Also considers if path has ID parameter for GET requests
   */
  private getRequiredAction(method: string, path: string): string {
    const upperMethod = method.toUpperCase();

    switch (upperMethod) {
      case 'GET':
        // Check if path ends with an ID (UUID or numeric)
        // Example: /posts/123 or /posts/507f1f77bcf86cd799439011
        const pathSegments = path.split('/').filter(s => s.trim() !== '');
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        // Check if last segment looks like an ID (UUID, MongoDB ObjectId, or number)
        const isId = /^[0-9a-f]{24}$/i.test(lastSegment) || // MongoDB ObjectId
                     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lastSegment) || // UUID
                     /^\d+$/.test(lastSegment); // Numeric ID
        
        return isId ? Action.FIND_ONE : Action.FIND_ALL;
      
      case 'POST':
        return Action.CREATE;
      
      case 'PUT':
      case 'PATCH':
        return Action.UPDATE;
      
      case 'DELETE':
        return Action.DELETE;
      
      default:
        return Action.FIND_ALL; // Default to read permission
    }
  }
}

