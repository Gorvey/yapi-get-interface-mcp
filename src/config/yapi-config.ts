import { YAPIClient, YAPIConfig } from '../yapi/client.js';

/**
 * 全局YAPI配置管理
 */
class YAPIConfigManager {
  private static instance: YAPIConfigManager;
  private _client: YAPIClient | null = null;
  private _config: YAPIConfig | null = null;

  private constructor() {}

  static getInstance(): YAPIConfigManager {
    if (!YAPIConfigManager.instance) {
      YAPIConfigManager.instance = new YAPIConfigManager();
    }
    return YAPIConfigManager.instance;
  }

  /**
   * 初始化YAPI配置
   */
  async initialize(config: YAPIConfig): Promise<void> {
    this._config = config;
    this._client = new YAPIClient(config);
    
    // 测试连接
    try {
      await this._client.login();
      console.error(`✅ YAPI配置成功! 服务器: ${config.url}`);
    } catch (error) {
      console.error(`❌ YAPI连接失败: ${error instanceof Error ? error.message : '未知错误'}`);
      throw error;
    }
  }

  /**
   * 获取YAPI客户端
   */
  getClient(): YAPIClient {
    if (!this._client) {
      throw new Error('YAPI未配置，请先通过命令行参数配置');
    }
    return this._client;
  }

  /**
   * 获取YAPI配置
   */
  getConfig(): YAPIConfig {
    if (!this._config) {
      throw new Error('YAPI未配置，请先通过命令行参数配置');
    }
    return this._config;
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    return this._client !== null && this._config !== null;
  }

  /**
   * 重置配置
   */
  reset(): void {
    this._client = null;
    this._config = null;
  }
}

export const yapiConfigManager = YAPIConfigManager.getInstance(); 