'use client';

import React, { useState, useEffect, useCallback, ReactNode, createContext, useContext } from 'react';
import { classnames } from '@seven-design-ui/core';
import './message.css';

// 消息类型定义
export type MessageType = 'success' | 'warning' | 'error' | 'info' | 'primary';

// 消息位置定义
export type MessagePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

// 单个消息的配置选项
export interface MessageOptions {
  /** 消息内容 */
  message?: string | ReactNode;
  /** 消息类型 */
  type?: MessageType;
  /** 消息位置 */
  placement?: MessagePlacement;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 显示时长，单位毫秒，0表示不自动关闭 */
  duration?: number;
  /** 是否为纯色背景 */
  plain?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 关闭时的回调函数 */
  onClose?: () => void;
}

// 消息实例的接口
interface MessageInstance extends MessageOptions {
  /** 消息唯一标识 */
  id: string;
  /** 消息创建时间戳 */
  timestamp: number;
}

// 消息列表上下文类型
interface MessageListContextType {
  messages: MessageInstance[];
  addMessage: (options: MessageOptions) => string;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, options: Partial<MessageOptions>) => void;
}

// 创建消息列表上下文
const MessageListContext = createContext<MessageListContextType | null>(null);


// 使用消息列表的hook
const useMessageList = (): MessageListContextType => {
  const context = useContext(MessageListContext);
  if (!context) {
    throw new Error('useMessageList must be used within a MessageProvider');
  }
  return context;
};

// 单个消息组件
const MessageItem: React.FC<MessageInstance> = ({
  id,
  message,
  type = 'info',
  showClose = false,
  plain = false,
  className,
  onClose,
}) => {
  const { removeMessage } = useMessageList();

  // 处理关闭消息
  const handleClose = useCallback(() => {
    removeMessage(id);
    if (onClose) {
      onClose();
    }
  }, [id, removeMessage, onClose]);

  // 根据类型获取图标
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'primary':
        return 'ℹ';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={classnames(
        'seven-message',
        `seven-message--${type}`,
        {
          'seven-message--plain': plain,
        },
        className
      )}
    >
      <div className="seven-message__content">
        <span className="seven-message__icon">{getIcon()}</span>
        <span className="seven-message__text">{message}</span>
        {showClose && (
          <button
            className="seven-message__close"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// 消息容器组件
const MessageContainer: React.FC = () => {
  const { messages } = useMessageList();

  // 按位置分组消息
  const groupedMessages = messages.reduce((acc, message) => {
    const placement = message.placement || 'top';
    if (!acc[placement]) {
      acc[placement] = [];
    }
    acc[placement].push(message);
    return acc;
  }, {} as Record<string, MessageInstance[]>);

  return (
    <>
      {Object.entries(groupedMessages).map(([placement, placementMessages]) => (
        <div
          key={placement}
          className={classnames(
            'seven-message-container',
            `seven-message-container--${placement}`
          )}
        >
          {placementMessages.map((message) => (
            <MessageItem key={message.id} {...message} />
          ))}
        </div>
      ))}
    </>
  );
};

// 消息API类
class MessageApi {
  private addMessage: (options: MessageOptions) => string;

  constructor(addMessage: (options: MessageOptions) => string) {
    this.addMessage = addMessage;
  }

  // 基础消息方法
  info(message: string | ReactNode, options?: Omit<MessageOptions, 'message' | 'type'>) {
    return this.addMessage({ message, type: 'info', ...options });
  }

  success(message: string | ReactNode, options?: Omit<MessageOptions, 'message' | 'type'>) {
    return this.addMessage({ message, type: 'success', ...options });
  }

  warning(message: string | ReactNode, options?: Omit<MessageOptions, 'message' | 'type'>) {
    return this.addMessage({ message, type: 'warning', ...options });
  }

  error(message: string | ReactNode, options?: Omit<MessageOptions, 'message' | 'type'>) {
    return this.addMessage({ message, type: 'error', ...options });
  }

  primary(message: string | ReactNode, options?: Omit<MessageOptions, 'message' | 'type'>) {
    return this.addMessage({ message, type: 'primary', ...options });
  }

  // 通用消息方法
  open(options: MessageOptions) {
    return this.addMessage(options);
  }
}

// 创建全局消息API
let globalMessageApi: MessageApi | null = null;

// 获取消息API的hook
export const useMessage = (): MessageApi => {
  const { addMessage } = useMessageList();

  if (!globalMessageApi) {
    globalMessageApi = new MessageApi(addMessage);
  }

  return globalMessageApi;
};

// 全局消息API实例存储
let globalMessageInstance: MessageApi | null = null;

// 获取全局消息API的函数
const getGlobalMessageApi = (): MessageApi => {
  if (!globalMessageInstance) {
    throw new Error('Message API must be used within a MessageProvider. Please wrap your app with MessageProvider.');
  }
  return globalMessageInstance;
};

// 设置全局消息API（在MessageProvider内部调用）
const setGlobalMessageApi = (addMessage: (options: MessageOptions) => string) => {
  globalMessageInstance = new MessageApi(addMessage);
};

// 全局$message对象，类似Element Plus的API
// 使用懒初始化的方式，只有在调用时才会检查API是否可用
export const $message = new Proxy({} as MessageApi, {
  get(_target, prop) {
    const api = getGlobalMessageApi();
    return (api as any)[prop];
  }
});

// 修改MessageProvider以设置全局API
export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageInstance[]>([]);

  // 添加消息
  const addMessage = useCallback((options: MessageOptions): string => {
    const id = `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageInstance: MessageInstance = {
      id,
      timestamp: Date.now(),
      duration: 3000,
      placement: 'top',
      type: 'info',
      ...options,
    };

    setMessages(prev => [...prev, messageInstance]);

    // 如果设置了duration且大于0，自动关闭消息
    if (messageInstance.duration && messageInstance.duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, messageInstance.duration);
    }

    return id;
  }, []);

  // 移除消息
  const removeMessage = useCallback((id: string) => {
    setMessages(prev => {
      const message = prev.find(msg => msg.id === id);
      if (message?.onClose) {
        message.onClose();
      }
      return prev.filter(msg => msg.id !== id);
    });
  }, []);

  // 更新消息
  const updateMessage = useCallback((id: string, options: Partial<MessageOptions>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, ...options } : msg
      )
    );
  }, []);

  // 设置全局API
  useEffect(() => {
    setGlobalMessageApi(addMessage);
  }, [addMessage]);

  const contextValue: MessageListContextType = {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
  };

  return (
    <MessageListContext.Provider value={contextValue}>
      {children}
    </MessageListContext.Provider>
  );
};

// 导出组件
export { MessageContainer, MessageApi };