import axios, { AxiosInstance } from 'axios';

export interface YAPIConfig {
  url: string;
  email: string;
  password: string;
  projectId?: number;
}

export interface YAPIInterface {
  url?: string;
  _id: number;
  title: string;
  path: string;
  method: string;
  project_id: number;
  catid: number;
  status: string;
  type: string;
  uid: number;
  username: string;
  add_time: number;
  up_time: number;
  api_opened: boolean;
  edit_uid: number;
  index: number;
  query_path: {
    path: string;
    params: any[];
  };
  req_body_type?: string;
  req_body_other?: string;
  req_body_is_json_schema?: boolean;
  req_body_form?: any[];
  req_query?: Array<{
    name: string;
    desc: string;
    required: '1' | '0';
    example?: string;
  }>;
  req_params?: Array<{
    name: string;
    desc: string;
  }>;
  req_headers?: Array<{
    required: '1' | '0';
    _id: string;
    name: string;
    value: string;
  }>;
  res_body?: string;
  res_body_type?: string;
  res_body_is_json_schema?: boolean;
  desc?: string;
  markdown?: string;
  tag?: any[];
  __v?: number;
}

export class YAPIClient {
  private axios: AxiosInstance;
  private config: YAPIConfig;
  private isLoggedIn = false;

  constructor(config: YAPIConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.url,
      timeout: 10000,
    });
  }

  /**
   * 登录YAPI
   */
  async login(): Promise<void> {
    try {
      const response = await this.axios.post('/api/user/login', {
        email: this.config.email,
        password: this.config.password,
      });

      if (response.data.errcode === 0) {
        this.isLoggedIn = true;
        const cookies = response.headers['set-cookie'];
        if (cookies) {
          this.axios.defaults.headers.Cookie = cookies.join('; ');
        }
      } else {
        throw new Error(`登录失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      throw new Error(`登录YAPI失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 确保已登录
   */
  private async ensureLoggedIn(): Promise<void> {
    if (!this.isLoggedIn) {
      await this.login();
    }
  }

  /**
   * 根据接口ID获取接口详情
   */
  async getInterfaceById(interfaceId: number): Promise<YAPIInterface> {
    await this.ensureLoggedIn();

    try {
      const response = await this.axios.get(`/api/interface/get?id=${interfaceId}`);
      
      if (response.data.errcode === 0) {
        return response.data.data;
      } else {
        throw new Error(`获取接口失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      throw new Error(`获取YAPI接口失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取项目下的所有接口列表
   */
  async getProjectInterfaces(projectId: number): Promise<YAPIInterface[]> {
    await this.ensureLoggedIn();

    try {
      const response = await this.axios.get(`/api/interface/list?project_id=${projectId}`);
      
      if (response.data.errcode === 0) {
        return response.data.data.list || [];
      } else {
        throw new Error(`获取项目接口列表失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      throw new Error(`获取YAPI项目接口失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
} 