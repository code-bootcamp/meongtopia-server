import { Resolver } from '@nestjs/graphql';
import { StoresPicksService } from './storesPicks.service';

@Resolver()
export class StoresPicksResolver {
  constructor(
    private readonly storesPicksService: StoresPicksService, //
  ) {}
}
