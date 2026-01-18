import { inject, Injectable, NgZone } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { ToastService } from '@/pages/service/toast.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';



@Injectable({providedIn: 'root'})
export class NotificationService {

    // private toastService = inject(ToastService);
    // private zone = inject(NgZone);
    //
    // private notification$ = new ReplaySubject<any>(1);
    // private es?: EventSource;
    // private currentUserId?: number;
    //
    // connect(userId: number): Observable<any> {
    //     if (this.es) {
    //         return this.notification$.asObservable();
    //     }
    //
    //     this.currentUserId = userId;
    //
    //     this.es = new EventSource(
    //         `http://localhost:8080/notifications/stream?userId=${userId}`
    //     );
    //
    //     this.es.onmessage = (event) => {
    //         this.zone.run(() => {
    //             const data = JSON.parse(event.data);
    //
    //             // 🔔 toast global
    //             this.toastService.info(data.message ?? 'Bạn có thông báo mới');
    //
    //             this.notification$.next(data);
    //         });
    //     };
    //
    //     this.es.onerror = () => {
    //         this.disconnect();
    //         setTimeout(() => this.reconnect(), 3000);
    //     };
    //
    //     return this.notification$.asObservable();
    // }
    //
    // reconnect() {
    //     if (this.currentUserId) {
    //         this.connect(this.currentUserId);
    //     }
    // }
    //
    // disconnect() {
    //     this.es?.close();
    //     this.es = undefined;
    // }

    private client?: Client;

    constructor(
        private toast: ToastService,
        private zone: NgZone
    ) {}

    connect(userId: number) {

        if (this.client?.connected) return;
        const token = localStorage.getItem('token');

        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
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
