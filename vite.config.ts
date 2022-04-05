/*
 * @Author: hzzly
 * @Date: 2022-02-14 10:53:28
 * @LastEditTime: 2022-04-02 15:54:39
 * @LastEditors: hzzly
 * @Description: 
 * @FilePath: /json2ts/vite.config.ts
 */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      entry: './src/index.ts',
      name: 'Json2Ts',
      fileName: (format) => `json2ts.${format}.js`,
    },
    // rollupOptions: {
    //   // 确保外部化处理那些你不想打包进库的依赖
    //   external: ['vue'],
    //   output: {
    //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //     globals: {
    //       vue: 'Vue',
    //     },
    //   },
    // },
  },
});
