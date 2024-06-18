import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { EventsService } from '@app/core/events/events.service';
import { CriarEventoRequest } from './request/criar-evento.request';
import { AtualizarEventoRequest } from './request/atualizar-evento.request';
import { ReservarLugarRequest } from './request/reservar-lugar.request';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventsService) {}

  @Post()
  create(@Body() criarEventoRequest: CriarEventoRequest) {
    return this.eventosService.create(criarEventoRequest);
  }

  @Get()
  findAll() {
    return this.eventosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() atualizarEventoRequest: AtualizarEventoRequest,
  ) {
    return this.eventosService.update(id, atualizarEventoRequest);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventosService.remove(id);
  }

  @Post(':id/reserva')
  reserveSpots(
    @Param('id') eventId: string,
    @Body() reservarLugarRequest: ReservarLugarRequest,
  ) {
    return this.eventosService.reserveSpot({
      ...reservarLugarRequest,
      eventId,
    });
  }
}
