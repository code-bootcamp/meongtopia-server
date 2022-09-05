import { Resolver } from '@nestjs/graphql';
import { StoresImgsService } from './storesImgs.service';

@Resolver()
export class StoresImgsResolver {
  constructor(
    private readonly storesImgsService: StoresImgsService, //
  ) {}
}
