import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('AccountController', () => {
  let accountController: AccountController;

  const mockAccountService = {
    createUser: jest.fn(),
    user: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockTwilioService = {
    client: {},
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
        {
          provide: TwilioService,
          useValue: mockTwilioService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = {
        phone: '1234567891',
        name: 'boris',
        email: 'boris@gmail.com',
      };

      await accountController.createUser(user);

      expect(mockAccountService.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('loginUser', () => {
    it('should login a user with a valid phone number', async () => {
      const phone = '1234567890'; // Replace with a valid phone number
      const user = {
        id: undefined,
        phone: undefined,
      }; // Create a mock user object here

      mockAccountService.user.mockResolvedValue(user);

      const result = await accountController.loginUser(phone);

      expect(result).toEqual({ userId: user.id });
      expect(mockAccountService.updateUser).toHaveBeenCalledWith({
        where: { phone: user.phone },
        data: expect.any(Object), // Validate the data being passed here
      });
      // Add more expectations for Twilio and ConfigService if needed
    });

    it('should throw an HttpException for an invalid phone number', async () => {
      const phone = '123456789%';

      mockAccountService.user.mockResolvedValue(null);

      try {
        await accountController.loginUser(phone);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('user.login.noUsersFound');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
