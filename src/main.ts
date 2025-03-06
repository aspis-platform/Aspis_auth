import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //AppModule을 사용해 NestJS 애플리케이션을 생성하는 코드야.
  await app.listen(3000);
}
bootstrap();
