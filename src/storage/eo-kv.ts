// EdgeOne KV 适配：EdgeOne 的 KV 绑定是全局变量，API 与 CF KV 基本一致（get/put）

import type { Storage } from './interface';

export class EOKVStorage implements Storage {
  constructor(private kv: any) {}

  async get(key: string): Promise<string | null> {
    const v = await this.kv.get(key);
    return v ?? null;
  }

  async put(key: string, value: string): Promise<void> {
    await this.kv.put(key, value);
  }
}
