import { Storage } from '@google-cloud/storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    const bucket = process.env.BUCKET;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_PROJECT_KEY_FILENAME,
    }).bucket(bucket);

    //파일 올리기
    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${el.filename}`))
              .on('error', () => reject('false'));
          }),
      ),
    );
    if (results.includes('false')) {
      throw new HttpException('이미지 업로드 오류', HttpStatus.CONFLICT);
    }
    return results; //성공하면 url, 실패하면 "실패"
  }
}
