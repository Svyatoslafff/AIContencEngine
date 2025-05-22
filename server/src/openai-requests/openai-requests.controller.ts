import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenaiRequest } from '../db/openai-request.schema';