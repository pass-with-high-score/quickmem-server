import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthRepository } from '../auth.repository';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken library

interface JwtPayload {
  userId: string;
  email: string;
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly resourceService: AuthRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      throw new ForbiddenException('No token provided');
    }

    const token = bearerToken.split(' ')[1]; // Extract the token from the Bearer string
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // Verify and decode the token
    } catch (err) {
      console.log('err', err);
      throw new ForbiddenException('Invalid token');
    }

    const userId = decoded.userId; // Extract user ID from the decoded token
    const id = request.params.id; // Extract the resource ID from the request params

    const resourceId = request.body.userId; // Extract the resource ID from the request body
    const userEmail = request.body.email; // Extract the email from the request body

    let resource: any; // User or any other resource

    if (resourceId) {
      resource = await this.resourceService.findOne({
        where: { id: resourceId },
      });
    } else if (userEmail) {
      resource = await this.resourceService.findOne({
        where: { email: userEmail },
      });
    } else if (id) {
      resource = await this.resourceService.findOne({
        where: { id },
      });
    } else {
      throw new ForbiddenException('Resource not found');
    }

    if (!resource) {
      throw new ForbiddenException('Resource not found');
    }

    console.log('resource.id', resource.id);
    console.log('userId', userId);
    console.log('userEmail', userEmail);

    return true; // Allow if the user owns the resource
  }
}
