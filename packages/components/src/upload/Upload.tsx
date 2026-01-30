'use client';

import React, { useState, useRef, useCallback, ReactNode, DragEvent } from 'react';
import { classnames } from '@seven-design-ui/core';
import './upload.css';

// 上传文件状态
export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';

// 上传文件信息
export interface UploadFile {
  /** 文件唯一标识 */
  uid: string;
  /** 文件名 */
  name: string;
  /** 文件大小 */
  size: number;
  /** 文件类型 */
  type?: string;
  /** 上传状态 */
  status: UploadFileStatus;
  /** 上传进度百分比 */
  percent?: number;
  /** 原始File对象 */
  raw?: File;
  /** 上传成功后的URL */
  url?: string;
  /** 错误信息 */
  error?: string;
  /** 最后修改时间 */
  lastModified?: number;
}

// Upload组件的props接口
export interface UploadProps {
  /** 上传的地址 */
  action?: string;
  /** 设置上传的请求头部 */
  headers?: Record<string, string>;
  /** 上传的文件字段名 */
  name?: string;
  /** 上传时附带的额外参数 */
  data?: Record<string, any>;
  /** 接受上传的文件类型 */
  accept?: string;
  /** 是否支持多选文件 */
  multiple?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示文件列表 */
  showFileList?: boolean;
  /** 文件列表 */
  fileList?: UploadFile[];
  /** 是否支持拖拽上传 */
  drag?: boolean;
  /** 最大允许上传个数 */
  limit?: number;
  /** 文件大小限制，单位字节 */
  maxSize?: number;
  /** 自定义类名 */
  className?: string;
  /** 子元素，用于自定义上传区域 */
  children?: ReactNode;
  /** 上传文件之前的钩子 */
  beforeUpload?: (file: File, fileList: UploadFile[]) => boolean | Promise<boolean> | File;
  /** 文件移除之前的钩子 */
  beforeRemove?: (file: UploadFile, fileList: UploadFile[]) => boolean | Promise<boolean>;
  /** 超出限制时的回调 */
  onExceed?: (files: File[], uploadFiles: UploadFile[]) => void;
  /** 文件状态改变时的回调 */
  onChange?: (file: UploadFile, fileList: UploadFile[]) => void;
  /** 文件上传成功的回调 */
  onSuccess?: (response: any, file: UploadFile, fileList: UploadFile[]) => void;
  /** 文件上传失败的回调 */
  onError?: (error: any, file: UploadFile, fileList: UploadFile[]) => void;
  /** 文件移除的回调 */
  onRemove?: (file: UploadFile, fileList: UploadFile[]) => void;
  /** 点击文件列表中已上传的文件时的回调 */
  onPreview?: (file: UploadFile) => void;
}

// 默认的文件类型图标
const getFileIcon = (file: UploadFile) => {
  const type = file.type || '';
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📄';
};

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const Upload = React.forwardRef<HTMLDivElement, UploadProps>((props, ref) => {
  const {
    action,
    headers,
    name = 'file',
    data,
    accept,
    multiple = false,
    disabled = false,
    showFileList = true,
    fileList: propFileList = [],
    drag = false,
    limit,
    maxSize,
    className,
    children,
    beforeUpload,
    beforeRemove,
    onExceed,
    onChange,
    onSuccess,
    onError,
    onRemove,
    onPreview,
    ...rest
  } = props;

  // 内部文件列表状态
  const [internalFileList, setInternalFileList] = useState<UploadFile[]>([]);
  // 拖拽状态
  const [dragOver, setDragOver] = useState(false);

  // 实际使用的文件列表
  const fileList = propFileList.length > 0 ? propFileList : internalFileList;

  // 文件输入框引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 更新文件列表
  const updateFileList = useCallback((newFileList: UploadFile[]) => {
    if (propFileList.length === 0) {
      setInternalFileList(newFileList);
    }
    // 触发onChange回调
    onChange?.(newFileList[newFileList.length - 1], newFileList);
  }, [propFileList.length, onChange]);

  // 创建文件对象
  const createFileItem = useCallback((file: File): UploadFile => {
    return {
      uid: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready',
      raw: file,
      lastModified: file.lastModified,
    };
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // 检查文件数量限制
    if (limit && fileList.length + fileArray.length > limit) {
      if (fileList.length >= limit) {
        // 如果已达到限制，触发onExceed
        onExceed?.(fileArray, fileList);
        return;
      } else {
        // 如果会超出限制，只保留允许的数量
        const allowedCount = limit - fileList.length;
        fileArray.splice(allowedCount);
        onExceed?.(Array.from(files).slice(allowedCount), fileList);
      }
    }

    // 处理每个文件
    for (const file of fileArray) {
      let processedFile = file;

      // 执行beforeUpload钩子
      if (beforeUpload) {
        try {
          const result = await beforeUpload(file, fileList);
          if (result === false) continue; // 阻止上传
          if (result instanceof File) {
            processedFile = result; // 使用处理后的文件
          }
        } catch (error) {
          console.error('beforeUpload hook error:', error);
          continue;
        }
      }

      // 检查文件大小
      if (maxSize && processedFile.size > maxSize) {
        const fileItem = createFileItem(processedFile);
        fileItem.status = 'error';
        fileItem.error = `文件大小超过限制 ${maxSize} 字节`;
        updateFileList([...fileList, fileItem]);
        onError?.(new Error(fileItem.error), fileItem, [...fileList, fileItem]);
        continue;
      }

      // 创建文件项并添加到列表
      const fileItem = createFileItem(processedFile);
      updateFileList([...fileList, fileItem]);

      // 如果提供了action，开始上传
      if (action) {
        uploadFile(fileItem);
      }
    }
  }, [fileList, limit, beforeUpload, maxSize, onExceed, onError, createFileItem, updateFileList, action]);

  // 上传文件
  const uploadFile = useCallback(async (fileItem: UploadFile) => {
    if (!action || !fileItem.raw) return;

    // 更新状态为上传中
    const updateStatus = (status: UploadFileStatus, percent?: number, error?: string, url?: string) => {
      const newFileList = fileList.map(f =>
        f.uid === fileItem.uid
          ? { ...f, status, percent, error, url }
          : f
      );
      updateFileList(newFileList);
    };

    updateStatus('uploading', 0);

    try {
      const formData = new FormData();
      formData.append(name, fileItem.raw);

      // 添加额外数据
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
      }

      const response = await fetch(action, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      updateStatus('success', 100, undefined, result.url);

      onSuccess?.(result, fileItem, fileList.map(f =>
        f.uid === fileItem.uid ? { ...f, status: 'success', percent: 100, url: result.url } : f
      ));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败';
      updateStatus('error', undefined, errorMessage);

      onError?.(error, fileItem, fileList.map(f =>
        f.uid === fileItem.uid ? { ...f, status: 'error', error: errorMessage } : f
      ));
    }
  }, [action, name, data, headers, fileList, updateFileList, onSuccess, onError]);

  // 移除文件
  const handleRemove = useCallback(async (fileItem: UploadFile) => {
    // 执行beforeRemove钩子
    if (beforeRemove) {
      try {
        const result = await beforeRemove(fileItem, fileList);
        if (result === false) return; // 阻止移除
      } catch (error) {
        console.error('beforeRemove hook error:', error);
        return;
      }
    }

    // 从列表中移除文件
    const newFileList = fileList.filter(f => f.uid !== fileItem.uid);
    updateFileList(newFileList);
    onRemove?.(fileItem, newFileList);
  }, [beforeRemove, fileList, updateFileList, onRemove]);

  // 点击上传区域
  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  // 文件选择改变
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // 清空input值，允许选择相同文件
    e.target.value = '';
  }, [handleFileSelect]);

  // 拖拽事件处理
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files) {
      handleFileSelect(files);
    }
  }, [disabled, handleFileSelect]);

  // 渲染文件列表
  const renderFileList = () => {
    if (!showFileList || fileList.length === 0) return null;

    return (
      <ul className="upload-file-list">
        {fileList.map(file => (
          <li key={file.uid} className={`upload-file-item upload-file-item-${file.status}`}>
            <div className="upload-file-info">
              <span className="upload-file-icon">{getFileIcon(file)}</span>
              <span className="upload-file-name" onClick={() => onPreview?.(file)}>
                {file.name}
              </span>
              <span className="upload-file-size">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <div className="upload-file-actions">
              {file.status === 'uploading' && file.percent !== undefined && (
                <span className="upload-file-progress">{file.percent}%</span>
              )}
              {file.status === 'error' && file.error && (
                <span className="upload-file-error">{file.error}</span>
              )}
              <button
                type="button"
                className="upload-file-remove"
                onClick={() => handleRemove(file)}
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={classnames('upload', className)} ref={ref} {...rest}>
      <div
        className={classnames(
          'upload-trigger',
          {
            'upload-trigger-drag': drag,
            'upload-trigger-drag-over': drag && dragOver,
            'upload-trigger-disabled': disabled,
          }
        )}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="upload-input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
        />
        {children ? (
          children
        ) : (
          <div className="upload-default">
            {drag ? (
              <>
                <div className="upload-drag-icon">📁</div>
                <div className="upload-drag-text">
                  {dragOver ? '释放鼠标上传文件' : '将文件拖拽到此处，或点击上传'}
                </div>
              </>
            ) : (
              <>
                <div className="upload-click-icon">📎</div>
                <div className="upload-click-text">点击上传文件</div>
              </>
            )}
          </div>
        )}
      </div>
      {renderFileList()}
    </div>
  );
});

Upload.displayName = 'Upload';