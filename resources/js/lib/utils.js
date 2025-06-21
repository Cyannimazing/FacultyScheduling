import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { winCheck } from './windows-util';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function en(inputs){
    return inputs >= 8;
}

export function add(){
    return winCheck()
}

export function whileAdding(inputs){
    return en(inputs)
}
