import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        AuthService
    ],
    controllers: [AuthController]
})
export class IamModule {
}
