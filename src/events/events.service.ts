import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findFirst({
      where: { id: id },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
      where: { id: id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id: id },
    });
  }

  async reserveSpot(reserveSpotDto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveSpotDto.eventId,
        name: {
          in: reserveSpotDto.spots,
        },
      },
    });

    if (spots.length !== reserveSpotDto.spots.length) {
      const foundSpots = spots.map((spot) => spot.name);
      const notFoundSpots = reserveSpotDto.spots.filter(
        (spotName) => !foundSpots.includes(spotName),
      );

      throw new Error(
        `Os lugares ${notFoundSpots.join(', ')} não foram encontrados`,
      );
    }

    try {
      const tickets = await this.prismaService.$transaction(async (prisma) => {
        await prisma.reservationHistory.createMany({
          data: spots.map((spot) => ({
            spotId: spot.id,
            ticketKind: reserveSpotDto.ticket_kind,
            email: reserveSpotDto.email,
            ticketStatus: TicketStatus.reserver,
          })),
        });

        await prisma.spot.updateMany({
          where: {
            id: {
              in: spots.map((spot) => spot.id),
            },
          },
          data: {
            status: SpotStatus.reserved,
          },
        });

        const tickets = await Promise.all(
          spots.map((spot) =>
            prisma.ticket.create({
              data: {
                spotId: spot.id,
                ticketKind: reserveSpotDto.ticket_kind,
                email: reserveSpotDto.email,
              },
            }),
          ),
        );

        return tickets;
      });
      return tickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
          case 'P2034':
            throw new Error('Lugar já foi reservado');
          default:
            throw new Error('Algum erro ocorreu');
        }
      } else {
        throw new Error('Algum erro ocorreu');
      }
    }
  }
}
