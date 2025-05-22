import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { OpenaiService } from './openai.service'; // Corrected import path
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    OpenaiRequest,
    OpenaiRequestDocument,
} from '../db/openai-request.schema';
import { AuthGuard } from '@nestjs/passport'; // Assuming you have an AuthGuard
;
@Controller('openai-requests') // Added controller path
@UseGuards(AuthGuard('jwt')) // Assuming you are using JWT authentication
export class OpenaiRequestsController{

    constructor(
        private readonly openaiService: OpenaiService,
        @InjectModel(OpenaiRequest.name)
        private openaiRequestModel: Model<OpenaiRequestDocument>
    ) {}

    @Post()
    async create(
        @Body('prompt') prompt: string,
        @Req() req
    ): Promise<OpenaiRequest> {
        const userId = req.user.userId; // Assuming userId is available in the request user object
        const response = await this.openaiService.generateText(prompt);

        const newRequest = new this.openaiRequestModel({
            userId,
            prompt,
            response,
            timestamp: new Date(),
        });

        return newRequest.save();
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
