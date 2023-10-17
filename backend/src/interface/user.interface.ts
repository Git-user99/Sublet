import { IsString } from 'class-validator';

export class UserBase {
  @IsString()
  user_id: string;

  @IsString()
  username: string;
}

export class UserExportInterface extends UserBase {
  id: string;
  email: string;
}

export class UserInterface extends UserExportInterface {
  phone: string;
  password: string;
  delete: boolean;
}

export interface customRequest extends Express.Request {
  user: UserInterface;
}