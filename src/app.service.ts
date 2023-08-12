import { Inject, Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@enums/twilio';

@Injectable()
export class AppService {
  public constructor(
    private readonly twilioService: TwilioService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  sendSMS() {
    return this.twilioService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: this.configService.get(EnvVariables.TwilioSenderPhoneNumber),
      to: '+972505822445',
    });
  }
}
