import { inject, Injectable, NgZone } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { ToastService } from '@/pages/service/toast.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';



@Injectable({providedIn: 'root'})
export class NotificationService {

    toastService = inject(ToastService);
    private client!: Client;
    private zone= inject(NgZone)

    connect(token: string) {
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => console.log(str),
            reconnectDelay: 5000
        });

        this.client.onConnect = () => {
            console.log('✅ STOMP CONNECTED');

            this.client.subscribe('/user/queue/notifications', message => {
                this.zone.run(() => {
                    console.log('📩 WS MESSAGE:', message.body);
                    this.toastService.info(message.body);
                });
            });

            console.log('✅ SUBSCRIBED /user/queue/notifications');
        };


        this.client.onStompError = frame => {
            console.error('❌ STOMP ERROR', frame);
        };

        this.client.activate();
    }

    disconnect() {
        this.client?.deactivate();
    }


    // private stompClient!: Client;
    // private connected = false;
    // notifications$ = new BehaviorSubject<any>(null);
    // toastService = inject(ToastService);
    //
    // connect() {
    //     console.log(localStorage.getItem('token'));
    //     this.stompClient = new Client({
    //         webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    //         reconnectDelay: 5000,
    //         connectHeaders: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         },
    //         debug: msg => console.log(msg),
    //     });
    //
    //     this.stompClient.onConnect = () => {
    //         // subscribe thông báo theo user
    //         this.stompClient.subscribe(
    //             '/user/totruongchinh@gmail.com/queue/notifications',
    //             message => {
    //                 this.toastService.info(JSON.parse(message.body));
    //                 this.notifications$.next(JSON.parse(message.body));
    //                 console.log('Notification:', message);
    //             }
    //         );
    //     };
    //
    //     this.stompClient.activate();
    // }
    //
    // disconnect() {
    //     if (this.stompClient && this.connected) {
    //         this.stompClient.deactivate();
    //         this.connected = false;
    //         console.log('WebSocket disconnected');
    //     }
    // }
}
