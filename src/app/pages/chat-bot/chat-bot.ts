import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@/pages/service/chat-bot.service';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    time: string;
}
@Component({
    selector: 'app-chat-bot',
    standalone: true,
    imports: [ButtonModule, NgClass, NgForOf, FormsModule, NgIf, SelectButton],
    templateUrl: './chat-bot.html',
    styleUrl: './chat-bot.scss'
})
export class ChatBot {
    @ViewChild('scroll') scroll!: ElementRef<HTMLDivElement>;

    input = '';
    streaming = false;
    options = [
        { label: 'Nông dân', value: '1' },
        { label: 'Chủ nô', value: '2' },
        { label: 'Tư bản', value: '3' }
    ];
    selected: string = '3';
    private chatService = inject(ChatService);

    messages: ChatMessage[] = [];

    ngOnInit(): void {
        this.streaming = true;
        setTimeout(() => {
            this.messages.push({
                role: 'assistant',
                content: 'Xin chào 👋 Tôi có thể giúp gì cho bạn?',
                time: this.now()
            });
            this.streaming = false;
        }, 1000);
    }

    send() {
        if (!this.input.trim() || this.streaming) return;

        const userInput = this.input.trim();
        this.input = '';
        this.streaming = true;

        // 1️⃣ push user message
        this.messages.push({
            role: 'user',
            content: userInput,
            time: this.now()
        });

        // 2️⃣ tạo message AI rỗng
        const aiMsg: ChatMessage = {
            role: 'assistant',
            content: '',
            time: this.now()
        };
        this.messages.push(aiMsg);
        this.scrollBottom();

        this.chatService.streamChat(
            userInput,
            (token) => {
                // const last = aiMsg.content.slice(-1);
                // const first = token.charAt(0);
                //
                // if (last && /[a-zA-ZÀ-ỹ0-9]/.test(last) &&
                //     /[a-zA-ZÀ-ỹ0-9]/.test(first)) {
                //     aiMsg.content += ' ';
                // }

                aiMsg.content += token;
                this.scrollBottom();
            },
            () => {
                this.streaming = false;
            },
            (err) => {
                this.streaming = false;
            }
        );
    }

    now(): string {
        return new Date().toLocaleTimeString();
    }

    scrollBottom() {
        setTimeout(() => {
            if (this.scroll) {
                this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
            }
        });
    }

    formatToHtml(text: string): string {
        if (!text) return '';

        return (
            text
                // Xuống dòng trước 1. 2. 3.
                .replace(/(\d+)\.\s*/g, '<br><br><strong>$1.</strong> ')

                // Xuống dòng cho gạch đầu dòng
                .replace(/\s*-\s*/g, '<br>– ')

                // Gộp quá nhiều <br>
                .replace(/(<br>\s*){3,}/g, '<br><br>')
        );
    }
}
