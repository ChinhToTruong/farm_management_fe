import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, EventEmitter, HostListener, inject, Input, OnInit, Output, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { PrimeNG } from 'primeng/config';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LayoutService } from '../../service/layout.service';

export interface NotificationItem {
    id: number;
    avatar?: string;
    icon?: string;
    title: string;
    content: string;
    time: string;
    read: boolean;
    link?: string;
}

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule],
    templateUrl: './app.notification.html',
    host: {
        class: 'hidden absolute top-13 right-0 w-100 h-130 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]',
        '(click)': '$event.stopPropagation()'
    }
})
export class AppNotification implements OnInit {
    private router = inject(Router);
    @Input() open = false;
    data: NotificationItem[] = [];
    isShowAll = false;
    notifications: NotificationItem[] = [
        {
            id: 1,
            title: 'Nguyễn Văn A',
            content: 'đã bình luận bài viết của bạn.',
            time: '2 phút trước',
            read: false,
            link: '/posts/1'
        },
        {
            id: 2,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 4,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 5,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 6,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 7,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 8,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 9,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 10,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 11,
            title: 'Trần Thị B',
            content: 'đã thích ảnh của bạn.',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 3,
            title: 'Nhóm Angular',
            content: 'có bài viết mới.',
            time: 'Hôm qua',
            read: true
        }
    ];

    ngOnInit(): void {
        this.data = [...this.notifications.slice(0, 6)];
    }

    markAsRead(item: NotificationItem) {
        item.read = true;
        if (item.link) {
            this.router.navigateByUrl(item.link);
        }
    }

    markAllAsRead() {
        this.notifications.forEach((n) => (n.read = true));
    }
    loadAll() {
        this.data = [...this.notifications];
        this.isShowAll = !this.isShowAll;
    }
    hiddenData() {
        this.data = [];
        this.data = [...this.notifications.slice(0, 6)];
        this.isShowAll = !this.isShowAll;
    }
}
