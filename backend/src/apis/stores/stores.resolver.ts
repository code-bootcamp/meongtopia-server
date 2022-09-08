import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateStoreInput } from './dto/createStore.input';
import { UpdateStoreInput } from './dto/updateStore.input';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';

@Resolver()
export class StoresResolver {
  constructor(
    private readonly storesService: StoresService, //
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [Store])
  async fetchStores(
    @Args({ name: 'search', nullable: true }) search: string, //
  ) {
    // 상품검색,
    //redis에 먼저 들려서 이전에 다른 사용자가 이미 검색한 결과가 있다면, redis에서 먼저가져오기
    //가게 이름으로 검색
    const storeCache = await this.cacheManager.get(`store:${search}`);
    if (storeCache) return storeCache;

    const storeES = await this.elasticsearchService.search({
      query: {
        term: { name: search },
      },
    });
    const searchData = storeES.hits.hits.map((row) => {
      console.log(row);
      return 'storeES console 찍어보고 알아서 넣기';
    });

    await this.cacheManager.set(`store:${search}`, searchData, { ttl: 30 });
    return searchData;
  }

  @Query(() => Store)
  fetchStore(@Args('storeID') storeID: string) {
    return this.storesService.findOne({ storeID });
  }

  @Query(() => [Store])
  fetchStoresTag(
    @Args('name') name: string, //
  ) {
    return this.storesService.findTag({ name });
  }

  @Query(() => [Store])
  fetchStoresLocation(
    @Args('name') name: string, //
  ) {
    return this.storesService.findLocation({ name });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Store)
  createStore(
    @Args('createStoreInput') createStoreInput: CreateStoreInput, //
    @Context() context: any,
  ) {
    const email = context.req.user.email;
    return this.storesService.create({ email, createStoreInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Store)
  updateStore(
    @Args('updateStoreInput') updateStoreInput: UpdateStoreInput, //
    @Context() context: any,
  ) {
    const email = context.req.user.email;
    return this.storesService.update({ email, updateStoreInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteStore(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.storesService.delete({ email });
  }
}
