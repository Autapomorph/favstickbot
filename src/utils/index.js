import pkg from '../../package.json' assert { type: 'json' };

const { NODE_ENV } = process.env;

export const { name, version } = pkg;
export const isProd = NODE_ENV === 'production';
export const isDev = NODE_ENV === 'development';
