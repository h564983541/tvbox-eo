// Node 内置模块的空垫片：routes.ts 里 require('fs')/require('path') 只在 Node/Docker 模式的
// JAR 磁盘缓存分支里用，EdgeOne 边缘运行时永远不会走到那个分支（workerBaseUrl 已设置时走 KV 分支）。
// 这里只保证打包和加载不报错，真被调用时抛出明确错误。
function unavailable(name) {
  return function () {
    throw new Error(`node builtin "${name}" is not available in EdgeOne edge runtime`);
  };
}
export const readFileSync = unavailable('fs');
export const writeFileSync = unavailable('fs');
export const existsSync = () => false;
export const mkdirSync = unavailable('fs');
export const createReadStream = unavailable('fs');
export const createWriteStream = unavailable('fs');
export const promises = {};
export default {};
