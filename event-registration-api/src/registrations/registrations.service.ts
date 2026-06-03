import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto, attendeeId: string) {
    // Find the event
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.status !== 'PUBLISHED') throw new BadRequestException('Event is not available for registration');

    // Check registration deadline
    if (new Date() > event.registrationDeadline) {
      throw new BadRequestException('Registration deadline has passed');
    }

    // Check if already registered
    const existing = await this.prisma.registration.findUnique({
      where: { eventId_attendeeId: { eventId: dto.eventId, attendeeId } }
    });
    if (existing) throw new ConflictException('You are already registered for this event');

    // Check capacity — add to waitlist if full
    const registrationCount = event._count.registrations;
    const isFull = registrationCount >= event.capacity;

    const registration = await this.prisma.registration.create({
      data: {
        eventId: dto.eventId,
        attendeeId,
        status: isFull ? 'WAITLISTED' : 'CONFIRMED',
      },
      include: {
        event: {
          select: {
            title: true,
            startDate: true,
            venue: true,
            city: true,
          }
        },
        attendee: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    return {
      ...registration,
      message: isFull
        ? 'Event is full — you have been added to the waitlist'
        : 'Registration confirmed successfully',
    };
  }

  async findMyRegistrations(attendeeId: string) {
    return this.prisma.registration.findMany({
      where: { attendeeId },
      include: {
        event: {
          include: {
            category: true,
            organizer: {
              select: { id: true, fullName: true, email: true }
            },
            _count: { select: { registrations: true } }
          }
        }
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async findEventRegistrations(eventId: string, organizerId: string) {
    // Verify the organizer owns this event
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only view registrations for your own events');
    }

    return this.prisma.registration.findMany({
      where: { eventId },
      include: {
        attendee: {
          select: { id: true, fullName: true, email: true, phoneNumber: true }
        }
      },
      orderBy: { registeredAt: 'asc' },
    });
  }

  async cancel(id: string, attendeeId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id }
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.attendeeId !== attendeeId) {
      throw new ForbiddenException('You can only cancel your own registrations');
    }
    if (registration.status === 'CANCELLED') {
      throw new BadRequestException('Registration is already cancelled');
    }

    return this.prisma.registration.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      }
    });
  }

  async markAttendance(id: string, organizerId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
      include: { event: true }
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only mark attendance for your own events');
    }

    return this.prisma.registration.update({
      where: { id },
      data: { attendanceConfirmed: true },
      include: {
        attendee: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });
  }
}