import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Params } from "nestjs-pino";

export const loggerFactory = (config: ConfigService): Params => ({
    pinoHttp: {
     transport: config.get<string>('NODE_ENV') === 'development' ? {
       target: 'pino-pretty',
       options: { messageKey: 'message' }
     } : undefined,
     messageKey: 'message',
     autoLogging: false,
     customProps: (req: Request) => {
       return { correlation: req['CORRELATION_ID_HEADER'] }
     },
     serializers: {
       req: () => {
         return 'undefined';
       },
       res: () => {
         return undefined;
       },
     },
   }
 })