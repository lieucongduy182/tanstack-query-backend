import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const isSocketConnection = dbHost?.startsWith('/cloudsql/');
        return {
          type: 'mysql',
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
          ...(isSocketConnection
            ? {
                extra: {
                  socketPath: dbHost,
                },
              }
            : {
                host: dbHost,
                port: configService.get<number>('DB_PORT'),
              }),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
