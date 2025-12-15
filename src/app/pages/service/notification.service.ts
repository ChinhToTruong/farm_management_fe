import { inject, Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { ToastService } from '@/pages/service/toast.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';



@Injectable({providedIn: 'root'})
export class NotificationService {


    private socket$!: WebSocketSubject<any>;

    connect() {
        const token = localStorage.getItem('token');
        console.log(token);
        debugger
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = webSocket({
                url: `ws://localhost:8080/ws?token=${token}`,
                deserializer: e => JSON.parse(e.data),
                openObserver: {
                    next: () => {
                        console.log('✅ WebSocket CONNECTED');
                        // 👉 ở đây bạn có thể:
                        // - set flag connected = true
                        // - gửi message AUTH
                        // - hiện toast "Đã kết nối realtime"
                    }
                },

                closeObserver: {
                    next: () => {
                        console.log('❌ WebSocket DISCONNECTED');
                    }
                }
            })
        }
    }

    listen() {
        return this.socket$;
    }

    send(message: any) {
        this.socket$.next(message);
    }

    close() {
        this.socket$.complete();
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
