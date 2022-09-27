
<div align=center > 
  <img src="https://cdn.discordapp.com/attachments/1012196150989828097/1019146948638425098/Group_57.png"> 
  <br>
</div>

--------

## 기획의도


최근 펫팸족(pet+family)은 600만 가구를 넘는 등 반려동물 시장은 매년 커지고 있습니다.

이에 따라 다양한 반려동물 산업이 증가하고 있는데, 특히 애견 카페에 대한 수요가 증가하면서 좀 더 쉽고 편리하게 정보를 얻고 예약할 수 있도록 하기 위해 **멍토피아**를 기획하였습니다.

애견카페에 대한 정보를 찾으려면 블로그, 인스타그램 등 각 애견카페의 정보를 찾는 번거로움이 있는데, 멍토피아는 이를 해소하기 위해 애견 카페에 대한 정보를 집중하였습니다.

이용자에겐 애견카페의 위치와 가격 같은 기본정보를 쉽게 알  수 있고, 강아지의 정보를 정확하게 알 수 있습니다.

애견카페의 운영자들에겐 카페 정보를 더 편리하게 등록하고 홍보를 할 수 있는 플랫폼입니다.

<div><h2>📚 기술스택</h2></div>
<img src="https://cdn.discordapp.com/attachments/1010070894116347905/1022393027530076260/c0b04cd060d35d9b.jpg">

## Flow Chart
<img src="https://cdn.discordapp.com/attachments/1010070894116347905/1022120847336546324/4743432624aeeb32.jpg">

## ERD
<img src="https://cdn.discordapp.com/attachments/1010070894116347905/1022393120488439868/erd.jpg">

## Directory Structure

```
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── README.md
│   ├── cloudbuild.yaml
│   ├── docker-compose.dev.yaml
│   ├── docker-compose.prod.yaml
│   ├── docker-compose.stage.yaml
│   ├── docker-compose.yaml
│   ├── elk
│   │   └── logstash
│   │       ├── logstash-dev.conf
│   │       ├── logstash.conf
│   │       ├── mysql-connector-java-8.0.28.jar
│   │       └── template.json
│   ├── gcp-file-storage.json
│   ├── nest-cli.json
│   ├── package.json
│   ├── src
│   │   ├── apis
│   │   │   ├── auths
│   │   │   │   ├── auths.controller.ts
│   │   │   │   ├── auths.module.ts
│   │   │   │   ├── auths.resolver.ts
│   │   │   │   └── auths.service.ts
│   │   │   ├── boards
│   │   │   │   ├── boards.module.ts
│   │   │   │   ├── boards.resolver.ts
│   │   │   │   ├── boards.service.ts
│   │   │   │   ├── dto
│   │   │   │   │   ├── createBoard.input.ts
│   │   │   │   │   └── updateBoard.input.ts
│   │   │   │   └── entities
│   │   │   │       └── board.entity.ts
│   │   │   ├── boardsImgs
│   │   │   │   └── entities
│   │   │   │       └── boardImg.entity.ts
│   │   │   ├── captcha
│   │   │   │   ├── captcha.controller.ts
│   │   │   │   └── captcha.module.ts
│   │   │   ├── files
│   │   │   │   ├── files.module.ts
│   │   │   │   ├── files.resolver.ts
│   │   │   │   └── files.service.ts
│   │   │   ├── iamport
│   │   │   │   └── iamport.service.ts
│   │   │   ├── incomes
│   │   │   │   ├── entities
│   │   │   │   │   └── incomes.entity.ts
│   │   │   │   ├── incomes.module.ts
│   │   │   │   ├── incomes.resolver.ts
│   │   │   │   └── incomes.service.ts
│   │   │   ├── payments
│   │   │   │   ├── entities
│   │   │   │   │   └── payment.entity.ts
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.resolver.ts
│   │   │   │   └── payments.service.ts
│   │   │   ├── pets
│   │   │   │   ├── dto
│   │   │   │   │   ├── createPet.input.ts
│   │   │   │   │   └── updatePet.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── pet.entity.ts
│   │   │   │   ├── pets.module.ts
│   │   │   │   ├── pets.resolver.ts
│   │   │   │   └── pets.service.ts
│   │   │   ├── reservations
│   │   │   │   ├── dto
│   │   │   │   │   └── createReservation.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── reservation.entity.ts
│   │   │   │   ├── reservations.module.ts
│   │   │   │   ├── reservations.resolver.ts
│   │   │   │   └── reservations.service.ts
│   │   │   ├── reviewes
│   │   │   │   ├── dto
│   │   │   │   │   ├── createReview.input.ts
│   │   │   │   │   └── updateReview.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── review.entity.ts
│   │   │   │   ├── reviewes.module.ts
│   │   │   │   ├── reviewes.resolver.ts
│   │   │   │   └── reviewes.service.ts
│   │   │   ├── reviewesResponses
│   │   │   │   ├── entities
│   │   │   │   │   └── reviewResponse.entity.ts
│   │   │   │   ├── reviewesResponses.module.ts
│   │   │   │   ├── reviewesResponses.resolver.ts
│   │   │   │   └── reviewesResponses.service.ts
│   │   │   ├── stores
│   │   │   │   ├── dto
│   │   │   │   │   ├── createStore.input.ts
│   │   │   │   │   └── updateStore.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── store.entity.ts
│   │   │   │   ├── stores.module.ts
│   │   │   │   ├── stores.resolver.ts
│   │   │   │   └── stores.service.ts
│   │   │   ├── storesImgs
│   │   │   │   └── entities
│   │   │   │       └── storeImg.entity.ts
│   │   │   ├── storesPicks
│   │   │   │   ├── entities
│   │   │   │   │   └── storePick.entity.ts
│   │   │   │   ├── storesPicks.module.ts
│   │   │   │   ├── storesPicks.resolver.ts
│   │   │   │   └── storesPicks.service.ts
│   │   │   ├── storesTags
│   │   │   │   ├── entities
│   │   │   │   │   └── storeTag.entity.ts
│   │   │   │   ├── storesTags.module.ts
│   │   │   │   ├── storesTags.resolver.ts
│   │   │   │   └── storesTags.service.ts
│   │   │   ├── strLocationsTags
│   │   │   │   ├── entities
│   │   │   │   │   └── strLocationTag.entity.ts
│   │   │   │   ├── strLocationsTags.module.ts
│   │   │   │   ├── strLocationsTags.resolver.ts
│   │   │   │   └── strLocationsTags.service.ts
│   │   │   └── users
│   │   │       ├── dto
│   │   │       │   ├── createUser.input.ts
│   │   │       │   └── updateUser.input.ts
│   │   │       ├── entities
│   │   │       │   └── user.entity.ts
│   │   │       ├── img
│   │   │       │   └── meongtopialogo.png
│   │   │       ├── users.module.ts
│   │   │       ├── users.resolver.ts
│   │   │       └── users.service.ts
│   │   ├── app.controller.spec.ts
│   │   ├── app.module.ts
│   │   ├── commons
│   │   │   ├── auth
│   │   │   │   ├── gql-auth.guard.ts
│   │   │   │   ├── jwt-access.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   ├── jwt-social-google.strategy.ts
│   │   │   │   ├── jwt-social-kakao.strategy.ts
│   │   │   │   └── jwt-social-naver.strategy.ts
│   │   │   ├── filter
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── graphql
│   │   │   │   └── schema.gql
│   │   │   ├── type
│   │   │   │   └── context.ts
│   │   │   └── utils
│   │   │       └── utils.ts
│   │   └── main.ts
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   └── yarn.lock
├── demo.tree
└── frontend
    ├── img
    │   ├── back-ground.jpg
    │   ├── facebook.png
    │   ├── google.png
    │   ├── kakao.png
    │   ├── menu-back-ground.jpg
    │   ├── naver.png
    │   ├── starbucks.png
    │   └── user-back-ground.jpg
    └── login
        ├── index.css
        └── index.html

54 directories, 118 files
```

## .env 

- DATABASE_TYPE
- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USERNAME
- DATABASE_PASSWORD
- DATABASE_DATABASE
- KAKAO_CLIENT_ID
- NAVER_CLIENT_ID
- NAVER_CLIENT_SECRET
- BUCKET
- GCP_PROJECT_ID
- GCP_PROJECT_KEY_FILENAME
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- SMS_KEY
- SMS_SECRET
- SMS_SENDER
- EMAIL_USER
- EMAIL_PASS
- EMAIL_SENDER
- GOOGLE_CALL_BACK_URL
- KAKAO_CALL_BACK_URL
- NAVER_CALL_BACK_URL
- SOCIAL_LOGIN_PW
- SOCIAL_LOGIN_PHONE

## Backend 역할<h3>박성운</h3>
<div>
  <li>Git 관리</li>
  <li>ERD 설계</li>
  <li>API 생성 및 구성</li>
  <li>사용자 CRUD API 생성 및 구성</li>
  <li>로그인 API 생성 및 구성</li>
  <li>소셜로그인 API 생성 및 구성</li>
  <li>인증번호 전송 API 생성 및 구성</li>
  <li>이메일 전송 API 생성 및 구성</li>
  <li>테스트 코드 작성</li>
</div>

<h3 style="margin-top: 30px;">설하나</h3>
<div>
  <li>ERD 설계</li>
  <li>매장 CRUD API 생성 및 구성</li>
  <li>커뮤니티 CRUD API 생성 및 구성</li>
  <li>포인트 결제 API 생성 및 구성</li>
  <li>예약 API 생성 및 구성</li>
  <li>수입내역 관리 API 생성 및 구성</li>
  <li>파일 업로드 API 생성 및 구성</li>
  <li>리뷰/리뷰 답글 CRUD API 생성 및 구성</li>
  <li>애견 테이블 구성</li>
  <li>API DOCS 작업</li>
  <li>Cron Tap</li>
  <li>테스트 코드 작성</li>
  <li>배포</li>
  <li>발표자료 제작</li>
</div>
