import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriesModule,
    EventsModule,
    RegistrationsModule,
  ],
})
export class AppModule {}