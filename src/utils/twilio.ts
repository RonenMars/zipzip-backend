import { TwilioClient } from 'nestjs-twilio/dist/utils';

/**
 * Sends an SMS message using the Twilio client.
 *
 * @param {string} fromNumber - The Twilio phone number sending the message.
 * @param {string} phoneNumber - The recipient's phone number.
 * @param {string} message - The message content to be sent.
 * @param {TwilioClient} client - The Twilio client for sending the message.
 * @throws {Error} Throws an error with a status code of 400 if there's an issue sending the SMS.
 */
export const sendSMS = async (fromNumber: string, phoneNumber: string, message: string, client: TwilioClient) => {
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
  return;
};
