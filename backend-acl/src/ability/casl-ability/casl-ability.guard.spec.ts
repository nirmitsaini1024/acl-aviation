import { Test, TestingModule } from '@nestjs/testing';
import { CaslAbilityGuard } from './casl-ability.guard';
import { AbilityFactory } from '../ability.factory/ability.factory';
import { Reflector } from '@nestjs/core';

describe('CaslAbilityGuard', () => {
  let guard: CaslAbilityGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaslAbilityGuard,
        {
          provide: AbilityFactory,
          useValue: {},
        },
        {
          provide: Reflector,
          useValue: {},
        },
      ],
    }).compile();

    guard = module.get<CaslAbilityGuard>(CaslAbilityGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
