import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as admin from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as serviceAccount from '../../key/firebase-key.json';

@Injectable()
export class NotificationService {
  private readonly firebaseApp: admin.app.App;

  constructor(private prismaService: PrismaService) {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async sendNotification(
    apiKey: string,
    userId: number,
    type: number,
    title: string,
    body: string,
  ) {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey !== apiKeyOnSystem.key) {
      throw new NotFoundException('Wrong API key');
    }

    /////
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // send notification to topic
    const topic = `user.${user.email.replaceAll('@', '.')}`;

    const message: admin.messaging.Message = {
      notification: { title, body },
      topic,
      data: {
        title: String(title),
        body: String(body),
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message to topic:', response);

      // save to database
      await this.prismaService.notification.create({
        data: {
          title: title,
          body: body,
          type: type,
          userId: userId,
        },
      });

      return `Successfully sent message to user ${user.email} with topic ${topic}`;
    } catch (error) {
      console.error('Error sending message to topic:', error);
      throw error;
    }
  }

  async getNotification(userId: number) {
    return this.prismaService.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}
