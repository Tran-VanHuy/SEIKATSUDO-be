import { Transform, TransformFnParams, TransformOptions } from 'class-transformer';

export interface TrimOptions {
  strategy?: 'start' | 'end' | 'both';
}

export function Trim(options?: TrimOptions, transformOptions?: TransformOptions) {
  return Transform((params: TransformFnParams) => {
    if ('string' !== typeof params.value) {
      return params.value;
    }
    switch (options?.strategy) {
      case 'start':
        return params.value.replace(/^\s+/, '');
      case 'end':
        return params.value.replace(/\s+$/, '');
      default:
        return params.value.replace(/^\s+|\s+$/g, '');
    }
  }, transformOptions);
}
