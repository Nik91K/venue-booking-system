import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { UserRole } from "../../users/entities/user.entity";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty({example: 'Name', description: 'User name'})
    name: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example: "test@example.com", description: "Email"})
    email: string

    @IsString()
    @MinLength(8)
    @ApiProperty({example: "Password123", description: "Password"})
    password: string

    @IsNotEmpty()
    @IsPhoneNumber()
    @ApiProperty({example: '+380966243760', description: 'Phone number'})
    phoneNumber:string
}
