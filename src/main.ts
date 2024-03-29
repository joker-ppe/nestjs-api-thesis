import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DateTime } from 'luxon';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // add middleware HERE!
  app.useGlobalPipes(new ValidationPipe());

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept',
  //   );
  //   next();
  // });

  app.enableCors({
    origin: '*', // replace with your origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization', // Added 'Authorization'
    credentials: true,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Planned Irrigation System API')
    .setDescription('by Nguyễn Minh Hiếu MSE#11')
    .setVersion('1.0.7')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Lấy thông tin commit date từ route git-info/commit-date
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const git = require('git-last-commit');

  git.getLastCommit(function (err, commit) {
    // read commit object properties
    // console.log(err);
    // console.log(commit);

    const unixTimestamp = commit['committedOn']; // Replace with your timestamp
    const date = DateTime.fromMillis(unixTimestamp * 1000, {
      zone: 'Asia/Ho_Chi_Minh',
    });

    const formattedDate = date.toFormat('dd/MM/yyyy, HH:mm:ss');

    console.log(formattedDate);

    document.info.description += ` - Last Commit Date: ${formattedDate}`;
    document.info.version += ` - ${commit['shortHash']}`;
  });

  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(3003);
}
bootstrap();
