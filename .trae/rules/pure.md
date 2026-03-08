# Pure Admin项目Trae项目规则

## 项目基本信息

**项目名称**：Pure Admin
**技术栈**：Vue 3 + Vite + Element-Plus + TypeScript + Pinia + Tailwind CSS
**模块规范**：完全采用ECMAScript模块（ESM）规范

## 开发规范要求

### 组件开发规范

1. 所有组件必须使用`<script setup lang="ts">`语法
2. Props必须使用TypeScript接口定义类型
3. Emit事件必须明确声明事件名和参数类型
4. 组件必须包含功能说明注释
5. 复杂组件需提供使用示例

### 代码质量规范

1. **ESLint配置**：使用项目根目录的`eslint.config.js`
2. **Prettier配置**：使用`.prettierrc.js`统一代码格式
3. **Stylelint配置**：使用`stylelint.config.js`检查样式
4. **TypeScript配置**：启用严格模式所有检查选项
5. **Git提交规范**：使用commitlint检查提交信息

### 样式编写规范

1. 优先使用Tailwind CSS工具类

### 路由配置规范

1. 静态路由配置在`src/router/routes.ts`

### 文档与注释要求

1. 组件文件头部必须包含功能说明
2. 复杂逻辑必须添加行内注释
3. 公共函数必须包含JSDoc注释
4. 接口定义必须包含参数说明
