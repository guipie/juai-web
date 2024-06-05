import { $t } from '@/locales';

/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

export function copyToClip(text: string, successTxt?: string) {
  return new Promise((resolve, reject) => {
    try {
      const input: HTMLTextAreaElement = document.createElement('textarea')
      input.setAttribute('readonly', 'readonly')
      input.value = text
      document.body.appendChild(input)
      input.select()
      try {
        navigator.clipboard.writeText(text);
      } catch (error) {
        if (document.execCommand('copy'))
          document.execCommand('copy')
      }
      document.body.removeChild(input)
      resolve(text)
      window.$message?.success(successTxt ?? '复制成功');
    }
    catch (error) {
      reject(error)
    }
  })
}

type CallbackFunc<T extends unknown[]> = (...args: T) => void

export function debounce<T extends unknown[]>(
  func: CallbackFunc<T>,
  wait: number,
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: T) => {
    const later = () => {
      clearTimeout(timeoutId)
      func(...args)
    }

    clearTimeout(timeoutId)
    timeoutId = setTimeout(later, wait)
  }
}

export function getFileName(url: string) {
  const imgname = url.split('/');//分割url
  return imgname[imgname.length - 1];
}
/**
 * 生成一个用不重复的ID
 * @param { Number } randomLength
 */
export function getGUID(randomLength?: number) {
  randomLength = randomLength ?? 10;
  return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
}

