import { Test, TestingModule } from '@nestjs/testing';
import { AbilityFactory } from './ability.factory';
import { RoleService } from 'src/roles/roles.service';


describe('AbilityFactory', () => {
  let factory: AbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbilityFactory,
        {
          provide: RoleService,
          useValue: {},
        },
      ],
    }).compile();

    factory = module.get<AbilityFactory>(AbilityFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });
});
