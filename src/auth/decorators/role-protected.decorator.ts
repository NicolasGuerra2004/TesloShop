import { Reflector } from '@nestjs/core';
import { ValidRoles } from '../interfaces';


export const RoleProtected = Reflector.createDecorator<ValidRoles[]>();