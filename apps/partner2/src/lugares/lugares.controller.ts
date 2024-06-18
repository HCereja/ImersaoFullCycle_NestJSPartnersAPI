import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots.service';
import { CriarLugarRequest } from './request/criar-lugar.request';
import { AtualizarLugarRequest } from './request/atualizar-lugar.request';

@Controller('eventos/:eventId/lugares')
export class LugaresController {
  constructor(private readonly lugaresService: SpotsService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() criarLugarRequest: CriarLugarRequest,
  ) {
    return this.lugaresService.create({
      ...criarLugarRequest,
      eventId,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.lugaresService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('id') spotId: string) {
    return this.lugaresService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(
    @Param('eventId') eventId: string,
    @Param('id') spotId: string,
    @Body() updateSpotRequest: AtualizarLugarRequest,
  ) {
    return this.lugaresService.update(eventId, spotId, updateSpotRequest);
  }

  @Delete(':spotId')
  remove(@Param('eventId') eventId: string, @Param('id') spotId: string) {
    return this.lugaresService.remove(eventId, spotId);
  }
}
