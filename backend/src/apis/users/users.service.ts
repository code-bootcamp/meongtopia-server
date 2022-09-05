import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Storage } from '@google-cloud/storage';
import { CreateUserInput } from './dto/createUser.input';
import { getToday } from 'src/commons/utils/utils';
import { resolve } from 'path';
import { rejects } from 'assert';
import nodemailer from 'nodemailer';
import * as coolsms from 'coolsms-node-sdk';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Mutation } from '@nestjs/graphql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  findAll() {
    return this.userRepository.find({});
  }

  findUserOne({ email }) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create({ hashedPassword: password, role, ...createUserInput }) {
    const user = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (user) {
      throw new ConflictException('이미 등록된 이메일입니다');
    }

    const { name, email, phone, ...aaa } = createUserInput;
    // throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);
    // const template = await this.createTemplate({ name, email, phone });
    // await this.sendtoEmail({ email, template });

    const userData = await this.userRepository.save({
      ...createUserInput,
      password,
      role,
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

  // async sendtoEmail({ email, template }) {
  //   const EMAIL_USER = email;
  //   const EMAIL_PASS = process.env.EMAIL_PASS;
  //   const EMAIL_SENDER = process.env.EMAIL_SENDER;

  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: EMAIL_USER,
  //       pass: EMAIL_PASS,
  //     },
  //   });
  //   const response = await transporter.sendMail({
  //     from: EMAIL_SENDER,
  //     to: email,
  //     subject: '가입을 축하합니다!!!',
  //     html: template,
  //   });
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
      const result = this.userRepository.save({
        ...myuser,
        password: newhashedPassword,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async upload({ files }) {
    // 파일을 클라우드 스토리지에 저장하는 로직

    //스토리지 저장 필요 yarn add google-cloud/storage
    // const aaa = await files[0];
    const waitedfiles = await Promise.all(files);

    //console.log(aaa);
    const bucket = process.env.BUCKET;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    const imagefileurl = await Promise.all(
      waitedfiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${el.filename}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );
    // const myuser = await this.userRepository.findOne({
    //   where: { email: email },
    // });
    // console.log(imagefileurl);
    // console.log(myuser);
    // const profileImgUrl = imagefileurl[0];
    // await this.userRepository.save({
    //   ...myuser,
    //   email: email,
    //   profileImgUrl: profileImgUrl,
    // });

    return imagefileurl[0];
  }

  async deleteprofile({ email }) {
    const bucket = process.env.bucket;
    const user = await this.userRepository.findOne({ where: { email: email } });
    const prevImg = user.profileImgUrl.split(
      `${bucket}/profile/${getToday()}/`,
    );
    const prevImgName = prevImg[prevImg.length - 1];
    console.log(prevImg, '======');

    const storage = new Storage({
      projectId: process.env.projectID,
      keyFilename: process.env.keyFileName,
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
    const result1 = await this.userRepository.softDelete({ email: email }); //다른 것으로도 삭제
    return result1.affected ? true : false;
  }

  async sendTokenSMS({ phone }) {
    const isValid = this.checkValidationPhone({ phone });
    if (isValid) {
      try {
        const digit = await this.userRepository.findOne({
          where: { phone: phone },
        });
        // if (digit) {
        //   throw new ConflictException('이미 등록된 번호입니다.');
        // }
        const count = 6;
        const token = String(Math.floor(Math.random() * 10 ** count)).padStart(
          count,
          '0',
        );
        //
        const SMS_KEY = process.env.SMS_KEY;
        const SMS_SECRET = process.env.SMS_SECRET;
        const SMS_sender = process.env.SMS_SENDER;
        const mysms = coolsms.default;

        const messageService = new mysms(SMS_KEY, SMS_SECRET);
        await messageService.sendOne({
          to: phone,
          from: SMS_sender,
          text: `[${digit.name}님]안녕하세요! 요청하신 인증번호는 [${token}] 입니다.`,
          autoTypeDetect: true,
        });

        const myToken = await this.cacheManager.get(phone);
        if (myToken) {
          await this.cacheManager.del(phone);
        }
        await this.cacheManager.set(phone, token, {
          ttl: 180,
        });
        return token;
      } catch (error) {
        throw new UnprocessableEntityException('토큰 발급 중 에러발생');
      }
    }
  }
  checkValidationPhone({ phone }) {
    if (phone.length !== 10 && phone.length !== 11) {
      console.log('에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요!!!');
      return false;
    } else {
      return true;
    }
  }

  async matchToken({ phone, token }) {
    const myToken = await this.cacheManager.get(phone);

    if (myToken === token) {
      return true;
    }
    throw new UnprocessableEntityException('토큰이 잘못되었습니다');
  }
}
