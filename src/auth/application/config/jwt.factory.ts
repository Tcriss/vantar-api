import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtFactory = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get<string>('HASH'),
    signOptions: {
        expiresIn: '24h', 
        algorithm: "HS256"
    },
    
});