import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

import { UserService } from "../../../../users/application/services/user.service";
import { GoogleUser } from "../../../domain/types/google-user.type";

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(private config: ConfigService, private userService: UserService) {
        super({
            clientID: config.get<string>('CLIENT_ID'),
            clientSecret: config.get<string>('CLIENT_SECRET'),
            callbackURL: config.get<string>('CB_URL'),
            scope: ['profile', 'email']
        });
    }

    public async validate(accesToken: string, refreshToken: string, profile: GoogleUser, done: Function): Promise<any> {
        const { id, given_name, family_name, email } = profile;
        const user = {
            id: id,
            email: email,
            name: `${given_name} ${family_name}`,
        };
    }
}