import {
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectedUserI } from 'src/chat/interface/connected-user.interface';
import { JoinedRoomI } from 'src/chat/interface/joined-room.interface';
import { MessageI } from 'src/chat/interface/message.interface';
import { RoomI } from 'src/chat/interface/room.interface';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { JoinedRoomService } from 'src/chat/service/joined-room/joined-room.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { RoomService } from 'src/chat/service/room-service/room.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'https://hoppscotch.io'],
  credentials: true,
};

@WebSocketGateway({
  cors: corsOptions,
})
export class ChatGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly roomService: RoomService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly joinedRoomService: JoinedRoomService,
    private readonly messageService: MessageService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

  async onModuleDestroy() {
    await this.connectedUserService.deleteAll();
  }

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.server.emit('message', 'subscribe test');
    // return 'Hello world!';
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    console.log('createRoom called');
    console.log('room', room);
    // return this.roomService.createRoom(room, socket.data.user);
    const createdRoom: RoomI = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: ConnectedUserI[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id);
      for (const connection of connections) {
        console.log('connection: ', connection);
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  // MESSAGE START
  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    console.log('join room called');
    console.log('data of onJoinRoom: ', room);
    const messages = await this.messageService.findMessagesForRoom(room);
    console.log('messages from db: ', messages);

    // save connection to room
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    // send last messagees from ROom to User
    await this.server.to(socket.id).emit('messages', messages);

    console.log('all completed');
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    console.log('leave room called');
    // remove connection from joinedRooms
    try {
      await this.joinedRoomService.deleteBySocketId(socket.id);
    } catch (error) {
      console.log('error leacing room: ', error);
    }
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const createdMessage: MessageI = await this.messageService.create({
      ...message,
      user: socket.data.user,
    });
    const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
    const joinedUsers: JoinedRoomI[] =
      await this.joinedRoomService.findByRoom(room);
    // TODO: send new message to all joined users of the room (currently online)
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  async handleConnection(socket: Socket) {
    try {
      // const token = socket.handshake.headers.cookie
      const token = socket.handshake.headers.cookie;
      const match = token.match(/jwt=([^;]+)/);
      const decodedToken = match ? match[1] : null;
      // console.log('token: ', token);
      // console.log('jwt: ', decodedToken);
      const data = await this.jwtService.verifyAsync(decodedToken);
      // console.log('jwt data', data);
      if (!data) throw new UnauthorizedException();

      const user: User = await this.userRepository.findOne({
        where: { id: data.id },
      });
      if (!user) {
        // disconnect
        console.log('disconnected by if(!user)');
        return this.disconnect(socket);
      } else {
        // console.log('On Connect');
        // console.log('user: ', user);
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id);

        // save connection to DB
        await this.connectedUserService.create({ socketId: socket.id, user });

        // only emit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
        // this.title.push('Value ' + Math.random().toString());
        // this.server.emit('message', this.title);
      }
    } catch (error) {
      // disconnect
      // console.log('disconnected by catch (error)');
      this.disconnect(socket);
      console.log('Error after catching: ', error);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
    console.log('On Disconnect');
  }

  private async disconnect(socket: Socket) {
    // await this.connectedUserService.deleteBySocketId(socket.id);
    // console.log('handle disconnect called');
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
