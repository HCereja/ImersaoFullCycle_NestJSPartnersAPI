import { Test, TestingModule } from '@nestjs/testing';
import { EventosController } from './eventos.controller';
import { EventsService } from '@app/core/events/events.service';

describe('EventsController', () => {
  let controller: EventosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventosController],
      providers: [EventsService],
    }).compile();

    controller = module.get<EventosController>(EventosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
