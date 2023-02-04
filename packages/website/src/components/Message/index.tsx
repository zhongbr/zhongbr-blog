import React, { createContext, useRef, useState, Fragment, useContext } from 'react';
import ReactDom from 'react-dom';
import { useEvent } from '@zhongbr/react-hooks';

import Message, { IProps as MessageProps } from './Message';
import Icon from '../Icon';

type IMessage = MessageProps & { duration?: number; id?: number; close?: () => void; };
type IMessageMain = Omit<MessageProps, 'icon'>;
type PresetMessageFn = (payload: IMessageMain) => Promise<void>;

export interface IMessageContext {
    maxMessageCount?: number;
    message?: (message: IMessage) => Promise<void>;
}
export const MessageContext = createContext<IMessageContext>({});

const ToastMessageElement = document.getElementById('toast-message') as HTMLDivElement;
let messageId = 0;

/**
 * 显示toast的工具函数
 */
export const useMessage = () => {
    const { message } = useContext(MessageContext);

    const preset = async (icon: string, payload: IMessageMain) => {
        return message?.({
            ...payload,
            icon: <Icon className={icon}/>
        });
    };

    const success = useEvent(preset.bind(null, 'rp-xuanxiang')) as PresetMessageFn;
    const fail = useEvent(preset.bind(null, 'rp-shenheshibai')) as PresetMessageFn;
    const warning = useEvent(preset.bind(null, 'rp-yaoqing')) as PresetMessageFn;

    return { success, fail, warning, message };
};

const MessageProvider: React.FC<IMessageContext & { children: React.ReactNode; }> = (props) => {
    const { children, ...context } = props;
    const { maxMessageCount = 2 } = context;

    // 等待显示的消息的队列
    const messagesQueue = useRef<Array<IMessage>>([]);
    // 正在显示的消息
    const [messages, setMessages] = useState<Array<IMessage>>([]);
    const showMessages = useRef<Array<IMessage>>([]);

    // 通知消息显示
    const onNextMessage = () => {
        while (showMessages.current.length < maxMessageCount && messagesQueue.current.length) {
            // 从消息队列取出一个消息
            const message = messagesQueue.current.shift();
            if (message) {
                const { duration = 2000 } = message;
                showMessages.current.push(message);
                setTimeout(() => {
                    // 关闭当前的消息
                    message.close?.();
                    // 通知显示下一个消息
                    onNextMessage();
                }, duration);
                setMessages([...showMessages.current]);
            }
        }
    };

    const message: IMessageContext['message'] = useEvent( (message) => {
        return new Promise<void>(resolve => {
            const id = messageId++;
            messagesQueue.current.push({
                ...message,
                id,
                close: () => {
                    // 隐藏并删除当前的消息
                    showMessages.current = showMessages.current.filter(message => message.id !== id);
                    setMessages(showMessages.current);
                    resolve();
                }
            });
            onNextMessage();
        })
    });

    return (
        <MessageContext.Provider value={{ ...context, message }}>
            {children}
            {ReactDom.createPortal(
                <>
                    {messages?.map(message => (
                        <Message
                            key={message.id}
                            onClose={message.close}
                            {...message}
                        />
                    ))}
                </>,
                ToastMessageElement
            )}
        </MessageContext.Provider>
    );
};

export default MessageProvider;
