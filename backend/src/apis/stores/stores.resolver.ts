import { Resolver } from '@nestjs/graphql';
import { StoresService } from './stores.service';

@Resolver()
export class StoresResolver {
  constructor(
    private readonly storesService: StoresService, //
  ) {}
}
