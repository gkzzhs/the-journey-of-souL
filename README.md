# 心灵之旅 - 心理健康应用

一个帮助用户记录和管理情绪的Vue3应用，通过生成个性化的"心灵车票"，提供心理健康建议和情绪管理指导。

## 项目介绍

心灵之旅是一款基于Vue3开发的心理健康应用，通过DeepSeek AI提供个性化的心理建议。用户可以选择当前情绪，记录自己的感受，应用会生成一张包含分析和建议的"心灵车票"，帮助用户更好地理解和管理自己的情绪。

## 功能特点

- 情绪选择：提供多种情绪类型供用户选择
- 个性化分析：基于用户输入提供专业的情绪分析
- 心理建议：针对用户情绪状态提供实用的应对策略
- 心灵车票：生成精美的视觉呈现，记录用户的情绪旅程
- 历史记录：保存用户的情绪记录，方便回顾和反思

## 安装与使用

1. 克隆仓库

```bash
git clone https://github.com/你的用户名/心灵之旅.git
cd 心灵之旅
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制`.env.example`文件并重命名为`.env`，然后填入你的DeepSeek API密钥：

```
VITE_DEEPSEEK_API_KEY=你的DeepSeek_API密钥
```

4. 启动开发服务器

```bash
npm run dev
```

## 部署指南

### GitHub部署

1. 在GitHub上创建一个新的仓库
2. 初始化本地Git仓库并推送到GitHub

```bash
git init
git add .
git commit -m "初始提交"
git branch -M main
git remote add origin https://github.com/你的用户名/心灵之旅.git
git push -u origin main
```

### Vercel部署

1. 在[Vercel](https://vercel.com)上注册账号并连接你的GitHub账号
2. 导入你刚刚创建的GitHub仓库
3. 在Vercel项目设置中，添加环境变量：
   - 名称：`VITE_DEEPSEEK_API_KEY`
   - 值：你的DeepSeek API密钥
4. 点击部署按钮

部署完成后，Vercel会提供一个可访问的URL，你的应用就成功上线了！

## 注意事项

- 确保在Vercel上正确设置了DeepSeek API密钥环境变量，否则应用将无法正常调用AI功能
- 本应用使用的是DeepSeek API，请确保你有有效的API密钥
- 如果API调用失败，应用会使用内置的备用回复

## 技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- HTTP客户端：Axios
- AI服务：DeepSeek API