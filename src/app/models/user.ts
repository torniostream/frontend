import {Avatar} from './avatar';

export interface User{
    nickname: string;
    avatar: Avatar;
    isAdmin: boolean;
    isInhibited: boolean;
}