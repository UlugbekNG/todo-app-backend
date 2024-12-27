import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from "./dto/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { HashingService } from "../hashing/hashing.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
    ) {}

    async register(body: RegisterDto) {
        try {
            const user = new User()
            user.email = body.email;
            user.password = await this.hashingService.hash(body.password)
            user.firstName = body.firstName
            user.lastName = body.lastName
            user.username = body.username
            await this.userRepository.save(user)
        } catch (error) {
            const pgValidationErrorCode = '23505'
            if(error.code === pgValidationErrorCode) {
                throw new ConflictException()
            }
            throw error
        }
    }

    async login(body: LoginDto) {
        const user = await this.userRepository.findOneBy({
            email: body.email
        })
        if(!user) {
            throw new UnauthorizedException("User not found")
        }
        const isEqualPassword = await this.hashingService.compare(
            body.password,
            user.password
        )
        if (!isEqualPassword) {
            throw new UnauthorizedException('Incorrect password')
        }

        return true
    }
}
