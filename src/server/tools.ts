import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { yapiConfigManager } from "../config/yapi-config.js";

export const registerTools = (server: McpServer) => {

  /**
   * 获取YAPI接口数据
   */
  server.tool("yapi-get-interface",
    "根据接口ID获取YAPI接口详情，支持格式：数字ID",
    {
      id: z.string().describe("接口ID，格式：数字ID")
    },
    async ({ id }) => {
      try {
        if (!yapiConfigManager.isConfigured()) {
          return {
            content: [{ 
              type: "text", 
              text: "❌ 请先通过命令行参数配置YAPI：--email, --password, --url" 
            }]
          };
        }
        const apiID = parseInt(id);
        if (isNaN(apiID)) {
          return {
            content: [{ 
              type: "text", 
              text: "❌ 无效的接口ID格式，请使用正确的ID" 
            }]
          };
        }

        const yapiClient = yapiConfigManager.getClient();
        const interfaceData = await yapiClient.getInterfaceById(apiID);
        // http://api.seevin.com/project/831/interface/api/36839
        const url = `http://${yapiConfigManager.getConfig().url}/project/${interfaceData.project_id}/interface/api/${interfaceData._id}`;
        interfaceData.url = url;
        const fieldDescriptions = {
          "_id": "接口唯一标识符",
          "title": "接口名称/标题",
          "path": "接口路径/URL",
          "method": "HTTP请求方法(GET/POST/PUT/DELETE等)",
          "desc": "接口描述信息",
          "markdown": "接口Markdown格式描述",
          "req_params": "请求路径参数列表",
          "req_query": "请求查询参数列表", 
          "req_headers": "请求头参数列表",
          "req_body_type": "请求体类型(form/json/raw等)",
          "req_body_other": "请求体内容/示例",
          "req_body_form": "表单类型请求体参数",
          "req_body_is_json_schema": "请求体是否为JSON Schema格式",
          "res_body": "响应体内容/示例",
          "res_body_type": "响应体类型",
          "res_body_is_json_schema": "响应体是否为JSON Schema格式",
          "status": "接口状态(undone/done)",
          "add_time": "创建时间(Unix时间戳)",
          "up_time": "更新时间(Unix时间戳)",
          "project_id": "所属项目ID",
          "catid": "所属分类ID",
          "uid": "创建者用户ID",
          "username": "创建者用户名",
          "edit_uid": "编辑者用户ID",
          "api_opened": "接口是否开放",
          "index": "接口排序索引",
          "query_path": "查询路径信息(包含path和params)",
          "tag": "接口标签列表",
          "type": "接口类型(static/dynamic)",
          "__v": "文档版本号(MongoDB字段)",
          "url": "接口URL地址"
        };

        return {
          content: [{ 
            type: "text", 
            text: `✅ 获取接口数据成功！

## 字段说明
${Object.entries(fieldDescriptions).map(([key, desc]) => `- **${key}**: ${desc}`).join('\n')}

## 原始数据
${JSON.stringify(interfaceData, null, 2)}` 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `❌ 获取接口数据失败：${error instanceof Error ? error.message : '未知错误'}` 
          }]
        };
      }
    }
  );

  // /**
  //  * 获取项目所有接口列表
  //  */
  // server.tool("yapi-list-interfaces",
  //   "获取当前项目的所有接口列表",
  //   {
  //     projectID: z.number().describe("项目ID")
  //   },
  //   async ({ projectID }) => {
  //     try {
  //       if (!yapiConfigManager.isConfigured()) {
  //         return {
  //           content: [{ 
  //             type: "text", 
  //             text: "❌ 请先通过命令行参数配置YAPI：--email, --password, --url" 
  //           }]
  //         };
  //       }

  //       const yapiClient = yapiConfigManager.getClient();
  //       const interfaces = await yapiClient.getProjectInterfaces(projectID);
        
  //       const interfaceList = interfaces.map((item: any) => ({
  //         id: item._id,
  //         title: item.title,
  //         path: item.path,
  //         method: item.method,
  //         yapiId: `yapi-id-${item._id}`
  //       }));

  //       return {
  //         content: [{ 
  //           type: "text", 
  //           text: `✅ 项目接口列表（共${interfaces.length}个）：\n\n${JSON.stringify(interfaceList, null, 2)}` 
  //         }]
  //       };
  //     } catch (error) {
  //       return {
  //         content: [{ 
  //           type: "text", 
  //           text: `❌ 获取接口列表失败：${error instanceof Error ? error.message : '未知错误'}` 
  //         }]
  //       };
  //     }
  //   }
  // );
};