import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

import { Payload } from "../../../domain/types/payload.type";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'rts') {

    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('SECRET'),
            passReqToCallBack: true
        })
    }

    async validate(req: Request, payload: Payload): Promise<{ payload: Payload, refresh_token: string }> {
        return {
            payload: payload, 
            refresh_token: req.get['authorization'].replace('Bearer', '').trim()
        };
    }
}