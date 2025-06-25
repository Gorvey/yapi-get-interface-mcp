# YAPI MCP 使用说明

这是一个用于连接YAPI并自动生成前端API调用代码的MCP服务器。

## 功能特性

- 🔗 通过命令行参数连接YAPI
- 📋 获取YAPI接口详情
- 🚀 自动生成前端调用代码（支持axios、fetch、uni-request）
- 📦 批量生成项目所有接口代码
- 🔍 列出项目所有接口

## 安装依赖

```bash
pnpm install
```

## 启动服务器

### 基础启动（无YAPI功能）
```bash
npm start
```

### 带YAPI配置启动
```bash
npm start  --email your@email.com --password yourpassword --url https://yapi.yourcompany.com --project-id 123
```

### 开发模式（示例配置）
```bash
npm run dev
```

## 可用工具

### 1. yapi-get-interface
获取YAPI接口详情

**参数：**
- `id`: 接口ID，支持格式：`yapi-id-123` 或 `123`

**示例：**
```
用户：yapi-id-456
```

### 2. yapi-generate-code
生成接口调用代码

**参数：**
- `id`: 接口ID
- `framework`: 前端框架（axios/fetch/uni-request）
- `typescript`: 是否生成TypeScript代码（默认：true）
- `outputDir`: 输出目录（默认：./src/api）
- `baseURL`: API基础URL（可选）
- `saveToFile`: 是否保存到文件（默认：false）

**示例：**
```
生成接口123的axios代码，保存到文件
```

### 3. yapi-list-interfaces
列出项目所有接口

**示例：**
```
获取项目所有接口列表
```

### 4. yapi-batch-generate
批量生成项目所有接口代码

**参数：**
- `framework`: 前端框架
- `typescript`: 是否生成TypeScript代码
- `outputDir`: 输出目录
- `baseURL`: API基础URL（可选）
- `createIndex`: 是否创建index文件统一导出（默认：true）

**示例：**
```
批量生成所有接口的axios TypeScript代码
```

## 生成的代码示例

### Axios代码
```typescript
/**
 * 用户登录
 * 用户登录接口
 * @path /api/user/login
 * @method POST
 */
export const userLogin = async (data: any): Promise<any> => {
  return await axios({ 
    url: '/api/user/login', 
    method: 'post', 
    data 
  });
};
```

### Fetch代码
```typescript
/**
 * 用户登录
 * 用户登录接口
 * @path /api/user/login
 * @method POST
 */
export const userLogin = async (data: any): Promise<any> => {
  const response = await fetch('/api/user/login', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  });
  return await response.json();
};
```

### uni-request代码
```typescript
/**
 * 用户登录
 * 用户登录接口
 * @path /api/user/login
 * @method POST
 */
export const userLogin = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/api/user/login',
      method: 'POST',
      data,
      success: (res) => resolve(res.data),
      fail: reject
    });
  });
};
```

## 命令行参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `--email` | YAPI登录邮箱 | `--email admin@company.com` |
| `--password` | YAPI登录密码 | `--password mypassword` |
| `--url` | YAPI服务器地址 | `--url https://yapi.company.com` |
| `--project-id` | YAPI项目ID | `--project-id 123` |

## 使用流程

1. **启动服务器**：使用命令行参数配置YAPI连接
2. **获取接口**：使用 `yapi-id-xxx` 格式获取特定接口
3. **生成代码**：选择框架和配置生成前端调用代码
4. **批量生成**：一次性生成项目所有接口代码

## 注意事项

- 确保YAPI服务器可访问
- 检查YAPI账号权限
- 项目ID必须正确
- 生成的代码需要根据实际项目调整类型定义 