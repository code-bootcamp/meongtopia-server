import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Storage } from '@google-cloud/storage';
import { getToday } from 'src/commons/utils/utils';
import coolsms from 'coolsms-node-sdk';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async findAll({ email, name }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user.role !== 'ADMIN') {
      throw new ConflictException('관리자 권한이 아닙니다.');
    }
    return this.userRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  findUserOne({ email }) {
    return this.userRepository.findOne({
      where: { email },
      relations: [
        'pick',
        'pick.store',
        'pick.store.storeImg',
        'pick.store.storeTag',
        'review',
        'review.store',
        'review.reviewRes',
      ],
    });
  }

  async create({ hashedPassword: password, role, access, ...createUserInput }) {
    const { name, email, phone, ...rest } = createUserInput;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) {
      throw new ConflictException('이미 등록된 이메일입니다');
    }

    // throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);
    // const template = await this.createTemplate({ name, email, phone });
    await this.sendEmail({ email, name });

    const userData = await this.userRepository.save({
      ...createUserInput,
      password,
      role,
      access,
    });

    return userData;
  }

  // createTemplate({ name, email, phone }) {
  //   //템플릿 만드는 과정
  //   const mytemplate = `
  //   <html>
  //       <body>
  //           <div style="display: flex; flex-direction: column; align-items: center;">
  //           <div style="width: 500px;">
  //               <h1>${name}님 가입을 환영합니다!!!</h1>
  //               <hr />
  //               <div style="color: red;">이름: ${name}</div>
  //               <div>email: ${email}살</div
  //               <div>personal: ${phone}</div>
  //               <div>가입일: ${getToday()}</div>
  //           </div>
  //           </div>
  //       </body>
  //   </html>
  //   `;
  //   return mytemplate;
  // }

  async update({ email, updateUserInput }) {
    /*this.productRepository.update(
            { id: productId },
            { ...updateProductInput },
          );*/
    const myuser = await this.userRepository.findOne({
      where: { email: email },
    });

    const result = this.userRepository.save({
      ...myuser,
      email: email,
      ...updateUserInput,
    });
    return result;
  }

  async updatePwd({ email, hashedPassword: newhashedPassword }) {
    console.log('service========', email);
    try {
      const myuser = await this.userRepository.findOne({
        where: { email: email },
      });
      //const에 담을 필요가 있는가?
      const result = await this.userRepository.save({
        ...myuser,
        password: newhashedPassword,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async upload({ files, email }) {
    // 파일을 클라우드 스토리지에 저장하는 로직

    //스토리지 저장 필요 yarn add google-cloud/storage
    // const aaa = await files[0];
    const waitedfiles = await Promise.all(files);

    //console.log(aaa);
    const bucket = process.env.BUCKET;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_PROJECT_KEY_FILENAME,
    }).bucket(bucket);

    const imagefileurl = await Promise.all(
      waitedfiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () =>
                resolve(`${bucket}/profileURL/${el.filename}`),
              )
              .on('error', () => reject('실패'));
          }),
      ),
    );
    const imgUrl: any = imagefileurl[0];

    const myuser = await this.userRepository.findOne({
      where: { email: email },
    });

    await this.userRepository.save({
      ...myuser,
      email: email,
      profileImgUrl: imgUrl,
    });
    return imgUrl;
  }

  async deleteprofile({ email }) {
    const bucket = process.env.bucket;
    const user = await this.userRepository.findOne({ where: { email: email } });
    const prevImg = user.profileImgUrl.split(`${bucket}/${getToday()}`);
    const prevImgName = prevImg[prevImg.length - 1];
    console.log(prevImg, '======');

    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_PROJECT_KEY_FILENAME,
    });
    const result = await storage.bucket(bucket).file(prevImgName).delete();

    const { profileImgUrl, ...userrest } = user;
    const deleteProfileUrl = { ...userrest, profileImgUrl: null };
    await this.userRepository.save(deleteProfileUrl);

    if (result) {
      return true;
    }
  }
  async delete({ email }) {
    const result1 = await this.userRepository.delete({ email: email }); //다른 것으로도 삭제
    return result1.affected ? true : false;
  }

  async sendTokenSMS({ phone }) {
    const isValid = this.checkValidationPhone({ phone });
    if (isValid) {
      // try {
      const digit = await this.userRepository.findOne({
        where: { phone: phone },
      });
      if (digit) {
        throw new ConflictException('이미 등록된 번호입니다.');
      }
      const count = 6;
      const token = String(Math.floor(Math.random() * 10 ** count)).padStart(
        count,
        '0',
      );

      const SMS_KEY = process.env.SMS_KEY;
      const SMS_SECRET = process.env.SMS_SECRET;
      const SMS_SENDER = process.env.SMS_SENDER;

      const messageService = new coolsms(SMS_KEY, SMS_SECRET);
      await messageService.sendOne({
        to: phone,
        from: SMS_SENDER,
        text: `안녕하세요! [ 멍토피아 ] 가입 인증번호는 [${token}] 입니다.`,
        type: 'SMS',
        autoTypeDetect: false,
      });
      const myToken = await this.cacheManager.get(phone);
      if (myToken) {
        await this.cacheManager.del(phone);
      }
      await this.cacheManager.set(phone, token, {
        ttl: 180,
      });
      return token;
      // } catch (error) {
      //   throw new error();
      // }
    }
  }

  async sendTokenEmail({ email }) {
    const EMAIL_USER = process.env.EMAIL_USER;
    const count = 6;
    const token = String(Math.floor(Math.random() * 10 ** count)).padStart(
      count,
      '0',
    );
    const aaa = await this.mailerService
      .sendMail({
        to: email,
        from: EMAIL_USER,
        subject: '인증 번호입니다.',
        html: '6자리 인증 코드 : ' + `<b> ${token}</b>`, // The `.pug` or `.hbs` extension is appended automatically.
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(aaa);
    return token;
  }

  async sendEmail({ email, name }) {
    const EMAIL_USER = process.env.EMAIL_USER;

    const mytemplate = `
    <html>
        <body>
            <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 500px;">
                <img class="LogoImg" src="https://cdn.discordapp.com/attachments/1012196150989828097/1019146948638425098/Group_57.png" />
                <h1>${name}님 가입을 환영합니다!</h1>
                <hr />
                <div style="color: black;">이름: ${name}</div>
                <div>email: ${email}</div>
                <div>가입일: ${getToday()}</div>
            </div>
            </div>
        </body>
    </html>
    `;

    const aaa = await this.mailerService
      .sendMail({
        to: email,
        from: EMAIL_USER,
        subject: '멍토피아 가입을 환영합니다.',
        html: mytemplate,
        // html: `<b> ${name}님 가입을 환영합니다.</b>`, // The `.pug` or `.hbs` extension is appended automatically.
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(aaa);
    return true;
  }

  checkValidationPhone({ phone }) {
    if (phone.length !== 10 && phone.length !== 11) {
      console.log('에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요!!!');
      return false;
    } else {
      return true;
    }
  }

  async checkNickname({ nickname }) {
    const user = await this.userRepository.find({
      where: { nickname },
    });
    return user.length !== 0 ? true : false;
  }

  async matchToken({ phone, token }) {
    const myToken = await this.cacheManager.get(phone);

    if (myToken === token) {
      return true;
    }
    throw new UnprocessableEntityException('토큰이 잘못되었습니다');
  }
}
