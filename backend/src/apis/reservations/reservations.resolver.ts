import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateReservationInput } from './dto/createReservation.input';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

@Resolver()
export class ReservationsResolver {
  constructor(
    private readonly reservationsService: ReservationsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reservation])
  fetchReservation(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.reservationsService.find({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reservation)
  async createReservation(
    @Args('storeID') storeID: string,
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput, //
    @Context() context: any,
  ) {
    const email = context.req.user.email;
    await this.reservationsService.checkUserPoint({
      email,
      createReservationInput,
    });
    return this.reservationsService.create({
      createReservationInput,
      email,
      storeID,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reservation)
  cancelReservation(
    @Args('storeID') storeID: string, //
    @Context() context: any,
  ) {
    const email = context.req.user.email;
    return this.reservationsService.cancel({ email, storeID });
  }
}
