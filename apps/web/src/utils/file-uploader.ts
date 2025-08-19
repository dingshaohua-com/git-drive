
import toast from '$lib/toast';
import { parseCustomUrl } from '$/routes/all/helper';

export interface UploadOptions {
  path?: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

/**
 * 上传文件到指定路径
 * @param file 要上传的文件
 * @param options 上传选项
 * @returns Promise<any>
 */
export const uploadFile = async (file: File, options: UploadOptions = {}) => {
  const { path = '', onProgress, onSuccess, onError } = options;
  console.log(onProgress);
  

  try {
    const { repo, path: filePath } = parseCustomUrl(path);
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('repo', repo);
    // formData.append('path', filePath);

    const res = await api.repo.uploadFile({ repo, path: filePath, file });
    toast.success('上传成功');
    onSuccess?.(res);
    return res;
  } catch (error) {
    const errorMsg = error?.message || '上传出错';
    toast.error(errorMsg);
    onError?.(errorMsg);
    throw error;
  }
};

/**
 * 触发文件选择并上传
 * @param options 上传选项
 */
export const triggerFileUpload = (options: UploadOptions = {}) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  
  input.onchange = async (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    await uploadFile(file, options);
    
    // 清理临时元素
    document.body.removeChild(input);
  };
  
  document.body.appendChild(input);
  input.click();
};

