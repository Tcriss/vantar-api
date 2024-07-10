import { Resend } from "resend";

export abstract class ResendProviderEntity extends Resend {
    constructor(apiKey: string) {
        super(apiKey)
    }
}