import { inject, Injectable, NgZone } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { ToastService } from '@/pages/service/toast.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { enviroment } from '../../../enviroments/enviroment';



@Injectable({providedIn: 'root'})
export class NotificationService {

    private client?: Client;

    constructor(
        private toast: ToastService,
        private zone: NgZone
    ) {}

    connect(userId: number) {

        if (this.client?.connected) return;
        const token = localStorage.getItem('token');

        this.client = new Client({
            webSocketFactory: () => new SockJS(`${enviroment.baseUrl}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            onConnect: () => {
                this.client!.subscribe(
                    `/topic/notification.${userId}`,
                    msg => {
                        this.zone.run(() => {
                            const data = JSON.parse(msg.body);
                            this.toast.info(data.message || 'Bạn có thông báo mới');
                        });
                    }
                );
            },
            onStompError: frame => {
                console.error('STOMP error', frame);
            }
        });

        this.client.activate();
    }

    disconnect() {
        this.client?.deactivate();
    }
}
