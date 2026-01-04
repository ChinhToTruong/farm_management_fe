import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private readonly API_URL = 'http://localhost:8080/ai-chat/stream';

    async streamChat(
        message: string,
        onToken: (token: string) => void,
        onDone: () => void,
        onError?: (err: any) => void
    ): Promise<void> {

        try {
            const url = `${this.API_URL}?message=${encodeURIComponent(message)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream'
                }
            });

            if (!response.ok || !response.body) {
                throw new Error('Cannot connect to stream API');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Spring SSE thường xuống dòng
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (let line of lines) {
                    // line = line.trim();
                    // if (!line) continue;

                    // Trường hợp chuẩn SSE: data: xxx
                    if (line.startsWith('data:')) {
                        // GIỮ NGUYÊN payload (kể cả " ")
                        const data = line.slice(5); // bỏ "data:"
                        onToken(data);
                    } else {
                        // Trường hợp Flux<String> text thường
                        onToken(line);
                    }
                }
            }

            // stream kết thúc
            onDone();

        } catch (error) {
            console.error('Stream chat error:', error);
            onError?.(error);
        }
    }
}
