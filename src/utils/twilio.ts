import { TwilioClient } from 'nestjs-twilio/dist/utils';

export const sendSMS = async (
  fromNumber: string,
  phoneNumber: string,
  message: string,
  client: TwilioClient,
) => {
  try {
    await client.messages.create({
      from: fromNumber,
      to: phoneNumber,
      body: message,
    });
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
};
