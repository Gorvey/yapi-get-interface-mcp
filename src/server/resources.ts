import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerResources = (server: McpServer) => {


  /**
   * YAPI接口数据资源
   */
  server.resource(
    "YAPI接口数据资源，通过yapi-id://接口ID 访问",
    new ResourceTemplate("yapi-id://{id}", { list: undefined }),
    async (uri, { id }) => {
      try {
        // 这里可以添加获取YAPI接口数据的逻辑
        // 由于需要配置信息，实际获取会在工具中处理
        return {
          contents: [{
            uri: uri.href,
            text: `YAPI接口资源：${id}\n请使用 yapi-get-interface 工具获取详细数据`,
            mimeType: "text/plain",
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri: uri.href,
            text: `获取YAPI接口数据失败: ${error instanceof Error ? error.message : '未知错误'}`,
            mimeType: "text/plain",
          }]
        };
      }
    }
  );


};