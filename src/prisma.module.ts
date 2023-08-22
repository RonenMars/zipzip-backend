import { Module } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
