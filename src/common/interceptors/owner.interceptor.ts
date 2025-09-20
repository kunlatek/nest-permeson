import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class OwnerInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if ((request.method === 'POST' || request.method === 'DELETE') && user) {
      const body = request.body;

      // Sempre define createdBy como o userId do usuário logado
      body.createdBy = user.userId;
      
      // Por padrão, ownerId é o mesmo que createdBy
      // Se precisar de lógica específica para invitation, isso deve ser feito no controller
      body.ownerId = user.userId;
      
      // Adiciona workspaceId do token para uso nos controllers
      body.workspaceId = user.workspaceId;
    }

    return next.handle();
  }
} 