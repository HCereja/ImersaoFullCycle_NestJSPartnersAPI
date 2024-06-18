import { Test, TestingModule } from '@nestjs/testing';
import { LugaresController } from './lugares.controller';
import { SpotsService } from '@app/core/spots/spots.service';

describe('SpotsController', () => {
  let controller: LugaresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LugaresController],
      providers: [SpotsService],
    }).compile();

    controller = module.get<LugaresController>(LugaresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
