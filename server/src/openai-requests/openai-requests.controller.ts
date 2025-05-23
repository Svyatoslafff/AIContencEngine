import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    OpenaiRequest,
    OpenaiRequestDocument,
} from '../db/openai-request.schema';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SessionDocument, Session } from 'src/db/session.schema';
import { log } from 'console';
@Controller('openai-requests')
// @UseGuards(AuthGuard('jwt'))
export class OpenaiRequestsController {
    constructor(
        private readonly openaiService: OpenaiService,
        @InjectModel(OpenaiRequest.name)
        private openaiRequestModel: Model<OpenaiRequestDocument>,
        @InjectModel(Session.name)
        private sessionModel: Model<SessionDocument>
    ) {}

    @Post()
    async create(
        @Body('prompt') prompt: string,
        @Req() req: Request
    ): Promise<OpenaiRequest> {
        const [bearer, token] = req.headers.authorization.split(' ');
        console.log(token);
        const data = await this.sessionModel
            .findOne({ accessToken: token })
            .exec();

        const { userId } = data;
        const response = await this.openaiService.generateText(prompt);

        const newRequest = new this.openaiRequestModel({
            userId,
            prompt,
            response,
            timestamp: new Date(),
        });

        return newRequest.save();
        // return;
    }

    @Get('user/:userId')
    async findAllByUserId(
        @Param('userId') userId: string
    ): Promise<OpenaiRequest[]> {
        return this.openaiRequestModel.find({ userId }).exec();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<OpenaiRequest> {
        return this.openaiRequestModel.findById(id).exec();
    }
}
