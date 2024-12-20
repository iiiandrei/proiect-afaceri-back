import { UserEntity } from "src/typeorm/entities/user.entity";

export interface RegisterResponse {
    status: number;
    error: string[];
    data: number | undefined;
    token: string;
    refreshToken: string;
}

export interface LoginResponse {
    status: number;
    error: string[];
    data: number | undefined;
    token: string;
    refreshToken: string;
}

export interface ValidateTokenResponse {
    status: number;
    error: string[];
    data: UserEntity;
}
