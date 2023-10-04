import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // add middleware HERE!
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Planned Irrigation System API')
    .setDescription('by Nguyễn Minh Hiếu MSE#11')
    .setVersion('1.0.3')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Lấy thông tin commit date từ route git-info/commit-date
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const git = require('git-last-commit');

  git.getLastCommit(function (err, commit) {
    // read commit object properties
    // console.log(commit['committedOn']);

    const unixTimestamp = commit['committedOn']; // Replace with your timestamp
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert to milliseconds

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;

    console.log(formattedDate);

    document.info.description += ` - Last Commit Date: ${formattedDate}`;
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(3003);
}
bootstrap();
