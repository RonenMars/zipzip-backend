import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find a user by phone number.
   *
   * @returns {Promise<User | null>} The user object if found, otherwise null.
   * @param userData
   */
  async user(userData: isUserExists): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            phone: userData.phone,
          },
          { email: userData.email },
        ],
      },
    });
  }

  /**
   * Retrieve a list of users based on provided parameters.
   *
   * @param {object} params - Parameters for filtering, pagination, and sorting.
   * @returns {Promise<User[]>} An array of user objects.
   */
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  /**
   * Create a new user.
   *
   * @param {Prisma.UserCreateInput} data - The data for creating the user.
   * @returns {Promise<User>} The created user object.
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Update a user's information.
   *
   * @param {object} params - Parameters for specifying the user to update and the updated data.
   * @returns {Promise<User>} The updated user object.
   */
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  /**
   * Delete a user.
   *
   * @param {Prisma.UserWhereUniqueInput} where - The unique identifier for the user to delete.
   * @returns {Promise<User>} The deleted user object.
   */
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
