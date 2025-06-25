#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server/server.js";
import { yapiConfigManager } from "./config/yapi-config.js";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * 解析命令行参数
 */
function parseArgs() {
  return yargs(hideBin(process.argv))
    .option('email', {
      type: 'string',
      description: 'YAPI登录邮箱'
    })
    .option('password', {
      type: 'string',
      description: 'YAPI登录密码'
    })
    .option('url', {
      type: 'string',
      description: 'YAPI服务器地址'
    })
    .help()
    .parseSync();
}

// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const args = parseArgs();
  
  // 如果提供了YAPI配置参数，则初始化YAPI
  if (args.email && args.password && args.url) {
    try {
      await yapiConfigManager.initialize({
        email: args.email,
        password: args.password,
        url: args.url
      });
    } catch (error) {
      console.error('YAPI配置失败，服务器将在没有YAPI功能的情况下启动');
    }
  } else if (args.email || args.password || args.url) {
    console.error('⚠️  YAPI配置不完整，需要提供所有参数：--email, --password, --url');
    console.error('示例：npm start -- --email user@example.com --password mypass --url https://yapi.example.com');
  }

  const transport = new StdioServerTransport();
  const { server, cleanup } = createServer();

  await server.connect(transport);
  console.error("MCP Server running on stdio.");

  // Cleanup on exit
  process.on("SIGINT", async () => {
    await cleanup();
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
