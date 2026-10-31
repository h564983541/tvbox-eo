// EdgeOne Makers 边缘函数入口（由 esbuild 打包为 edge-functions/[[path]].js）
// 与 cf-entry.ts 的区别：
// 1. 导出 onRequest(context) 而不是 fetch/scheduled 对象
// 2. KV 通过全局变量 TVBOX_KV 访问（控制台绑定命名空间时设定的变量名）
// 3. 环境变量从 context.env 读
// 4. 定时聚合不走平台 cron，由外部定时任务调用 POST /refresh
// 5. 给 caches 做空垫片：routes.ts 里 CF Cache 的调用点会自动回源到 KV/远程

import { createApp } from './routes';
import { EOKVStorage } from './storage/eo-kv';
import { runAggregation } from './aggregator';
import { DEFAULT_SPEED_TIMEOUT_MS, DEFAULT_SITE_TIMEOUT_MS, DEFAULT_FETCH_TIMEOUT_MS } from './core/config';
import type { AppConfig } from './core/types';

if (typeof (globalThis as any).caches === 'undefined') {
  (globalThis as any).caches = {
    default: {
      match: async () => undefined,
      put: async () => undefined,
      delete: async () => false,
    },
  };
}

interface EoEnv {
  ADMIN_TOKEN?: string;
  REFRESH_TOKEN?: string;
  SPEED_TIMEOUT_MS?: string;
  SITE_TIMEOUT_MS?: string;
  FETCH_TIMEOUT_MS?: string;
  WORKER_BASE_URL?: string;
}

function buildConfig(env: EoEnv): AppConfig {
  return {
    adminToken: env.ADMIN_TOKEN,
    refreshToken: env.REFRESH_TOKEN,
    speedTimeoutMs: parseInt(env.SPEED_TIMEOUT_MS || '') || DEFAULT_SPEED_TIMEOUT_MS,
    siteTimeoutMs: parseInt(env.SITE_TIMEOUT_MS || '') || DEFAULT_SITE_TIMEOUT_MS,
    fetchTimeoutMs: parseInt(env.FETCH_TIMEOUT_MS || '') || DEFAULT_FETCH_TIMEOUT_MS,
    workerBaseUrl: env.WORKER_BASE_URL || undefined,
  };
}

export async function onRequest(context: any): Promise<Response> {
  const kv = (globalThis as any).TVBOX_KV;
  if (!kv) {
    return new Response('KV binding TVBOX_KV is not configured', { status: 500 });
  }
  const env: EoEnv = context.env || {};
  const storage = new EOKVStorage(kv);
  const config = buildConfig(env);

  const app = createApp({
    storage,
    config,
    triggerRefresh: () => runAggregation(storage, config),
  });

  const executionCtx = {
    waitUntil: (p: Promise<unknown>) => {
      if (typeof context.waitUntil === 'function') {
        context.waitUntil(p);
      } else {
        Promise.resolve(p).catch(() => {});
      }
    },
    passThroughOnException: () => {},
  };

  return app.fetch(context.request, env, executionCtx as any);
}
