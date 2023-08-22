import { TwilioClient } from 'nestjs-twilio/dist/utils';

export const sendSMS = async (
  fromNumber: string,
  phoneNumber: string,
  message: string,
  client: TwilioClient,
) => {
  try {
    const smsResponse = await client.messages.create({
      from: fromNumber,
      to: phoneNumber,
      body: message,
    });
    console.log(smsResponse.sid);
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
};
