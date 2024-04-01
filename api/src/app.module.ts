import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { EventsGateway } from './gateways/events.gateway';

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
