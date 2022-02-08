import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
//const cookieSession = require('cookie-session'); //it doesn't work well if import with import statement in typescript

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieSession({
  //   keys: ['abcdefggg']
  // }))
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true
  //   })
 // )
  await app.listen(3000);
}
bootstrap();
