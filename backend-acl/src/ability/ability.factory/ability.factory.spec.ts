import { Test, TestingModule } from '@nestjs/testing';
import { AbilityFactory } from './ability.factory';

describe('AbilityFactory', () => {
  let provider: AbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbilityFactory],
    }).compile();

    provider = module.get<AbilityFactory>(AbilityFactory);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
