import {
  // Args, //
  // Mutation,
  Resolver,
} from '@nestjs/graphql';
import { PetsService } from './pets.service';

@Resolver()
export class PetsResolver {
  constructor(
    private readonly imagesService: PetsService, //
  ) {}
}
