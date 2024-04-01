import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('EventsGateway');
    private tableState: any[] = [];
    private lastUpdateTimestamp: number = 0; // Initialize with a default value

    @SubscribeMessage('message')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket,): string {
        this.logger.log(`Data received: ${JSON.stringify(data)}`);
        return data;
    }

    @SubscribeMessage('tableUpdate')
    handleTableUpdate(client: Socket, newData: any): void {
        console.log(newData.timestamp);
        if (this.isNewDataMoreRecent(newData.timestamp)) {
            this.tableState = newData.selectedCells;
            console.log('Received tableUpdate event', newData);
            client.broadcast.emit('tableUpdate', newData.selectedCells);
            // Update the lastUpdateTimestamp
            this.lastUpdateTimestamp = newData.timestamp;
        } else {
            console.log('Received outdated tableUpdate event. Ignoring.');
        }
    }

    @SubscribeMessage('requestTableState')
    handleRequestTableState(client: Socket): void {
        console.log('Received requestTableState event');
        client.emit('tableUpdate', this.tableState);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('tableUpdate', this.tableState);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    private isNewDataMoreRecent(newTimestamp: number): boolean {
        return newTimestamp > this.lastUpdateTimestamp;
    }
}
