import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {

    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('SECRET'),
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: unknown): Promise<unknown> {
        const refresh_token: string = req.headers['Authorization'].split(' ')[0];
        
        return { payload, refresh_token };
    }
}