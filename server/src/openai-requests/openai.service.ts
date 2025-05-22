import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_KEY'),
        });
    }

    async generateText(prompt: string): Promise<string> {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-3.5-turbo',
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error generating text with OpenAI:', error);
            throw new Error('Failed to generate text with OpenAI.');
        }
    }
}
