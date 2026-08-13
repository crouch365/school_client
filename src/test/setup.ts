import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

// jsdom/env Jest не всегда предоставляет TextEncoder/TextDecoder
// (нужны react-router и мок-токенам).
globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;

// RTL автоматически очищает DOM после каждого теста в Jest
// (благодаря глобальному afterEach). Этот setup-файл подключает matchers.