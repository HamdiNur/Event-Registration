import { Controller, Post, Get, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('registrations')
@UseGuards(JwtAuthGuard)
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ATTENDEE')
  create(@Body() dto: CreateRegistrationDto, @CurrentUser() user: any) {
    return this.registrationsService.create(dto, user.id);
  }

  @Get()
  getMyRegistrations(@CurrentUser() user: any) {
    return this.registrationsService.findMyRegistrations(user.id);
  }

  @Get('event/:eventId')
  @UseGuards(RolesGuard)
  @Roles('ORGANIZER', 'ADMIN')
  getEventRegistrations(@Param('eventId') eventId: string, @CurrentUser() user: any) {
    return this.registrationsService.findEventRegistrations(eventId, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ATTENDEE')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.registrationsService.cancel(id, user.id);
  }

  @Patch(':id/attendance')
  @UseGuards(RolesGuard)
  @Roles('ORGANIZER', 'ADMIN')
  markAttendance(@Param('id') id: string, @CurrentUser() user: any) {
    return this.registrationsService.markAttendance(id, user.id);
  }
}