import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Payload } from "../../../domain/types/payload.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access') {

    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('SECRET'),
        })
    }

    async validate(payload: Payload): Promise<Payload> {
        return {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role
        };
    }
}