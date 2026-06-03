import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto, organizerId: string) {
    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const deadline = new Date(dto.registrationDeadline);
    const now = new Date();

    if (startDate <= now) throw new BadRequestException('Start date must be in the future');
    if (endDate <= startDate) throw new BadRequestException('End date must be after start date');
    if (deadline >= startDate) throw new BadRequestException('Registration deadline must be before event start');

    return this.prisma.event.create({
      data: {
        ...dto,
        startDate,
        endDate,
        registrationDeadline: deadline,
        organizerId,
        status: 'DRAFT',
      },
      include: {
        category: true,
        organizer: {
          select: { id: true, fullName: true, email: true, organization: true }
        },
        _count: { select: { registrations: true } }
      }
    });
  }

  async findAll(filters: FilterEventsDto) {
    const where: any = { status: 'PUBLISHED' };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) where.startDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.startDate.lte = new Date(filters.endDate);
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: {
          select: { id: true, fullName: true, email: true, organization: true }
        },
        _count: { select: { registrations: true } }
      },
      orderBy: { startDate: 'asc' },
    });

    return events.map(event => ({
      ...event,
      availableSpots: event.capacity - event._count.registrations,
    }));
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: {
          select: { id: true, fullName: true, email: true, organization: true }
        },
        _count: { select: { registrations: true } }
      }
    });

    if (!event) throw new NotFoundException('Event not found');

    return {
      ...event,
      availableSpots: event.capacity - event._count.registrations,
    };
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) throw new ForbiddenException('You can only update your own events');

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        registrationDeadline: dto.registrationDeadline ? new Date(dto.registrationDeadline) : undefined,
      },
      include: {
        category: true,
        _count: { select: { registrations: true } }
      }
    });
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) throw new ForbiddenException('You can only delete your own events');

    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted successfully' };
  }

  async getMyEvents(organizerId: string) {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      include: {
        category: true,
        _count: { select: { registrations: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    return events.map(event => ({
      ...event,
      availableSpots: event.capacity - event._count.registrations,
    }));
  }
}