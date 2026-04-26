# Work Log

## 本次作业内容（2026-04-25）

---

### 1. AI 聊天机器人优化

**文件：`app/api/chat/route.ts`、`components/chat-bot.tsx`**

- 系统提示词大幅扩充，加入网站各板块介绍、作者 Zeli 完整信息（职业/学历/兴趣/联系方式）
- 语言规则明确化：中文→中文、英文→英文、日文→日文、其他语言→同语言回复
- 回答范围放宽：除网站/作者相关问题外，日常闲聊（旅行、摄影等）也可应对
- 修复 `GROQ_API_KEY || OPENAI_API_KEY` 历史遗留 fallback，统一使用 `GROQ_API_KEY`
- 发送给 LLM 前过滤 `timestamp` 等非标准字段（否则 Groq API 报 400）

**聊天界面（`chat-bot.tsx`）：**
- 问候语改为中/日/英三语各自完整段落，每段附免责声明
- UI 文案全部改为英文系统口吻（标题 `AI Assistant`、占位符、错误提示等）
- 消息气泡加 `whitespace-pre-wrap`，修复 `\n` 不换行的问题
- 新增 `Message` 类型（含可选 `timestamp` 字段）
- 每条消息气泡上方显示发送时间（`mm/dd HH:mm:ss`，24小时制，用户消息靠右，AI 消息靠左）

---

### 2. 每条消息时间戳

**文件：`app/api/chat/route.ts`**

- upsert 时显式传入 `updated_at: new Date().toISOString()`，修复 `updated_at` 不更新的问题
- 每次对话后给本轮新增的用户消息和 AI 回复打上 `timestamp`，历史消息不重复打
- 发送给 LLM 前用 `map` 剥离 `timestamp`，只传 `role` + `content`

---

### 3. AWS 每日报告系统（全新搭建）

**AWS 资源（ap-northeast-1，全部在免费额度内）：**

| 资源 | 名称 |
|------|------|
| S3 Bucket | `zeli-chat-reports` |
| Lambda | `zeli-daily-chat-report` |
| EventBridge Rule | `zeli-daily-report-trigger`（每天 UTC 00:00 = JST 09:00 触发） |
| IAM Role | `zeli-chat-report-role` |
| Budget | `zeli-monthly-cost-alert`（$0.5 上限，80%/100% 邮件提醒至 zlzhou1022@gmail.com） |

**Lambda 环境变量：**
```
SUPABASE_URL
SUPABASE_SERVICE_KEY
S3_BUCKET=zeli-chat-reports
GROQ_API_KEY
LINE_CHANNEL_TOKEN
LINE_USER_ID
```

**报告逻辑（`aws-deploy/lambda_function.py`）：**
- 按 `updated_at` 过滤昨天有活动的会话（UTC 00:00～00:00，对应 JST 09:00～09:00）
- 用每条消息的 `timestamp` 精确区分「昨天的新消息」和「历史上下文」
  - 无 timestamp 的旧会话（迁移前数据）fallback 为全部视为昨天的消息
- 调用 Groq API（`llama-3.1-8b-instant`）生成中文 AI 总结，聚焦昨天的新消息
- 报告上传至 S3，生成 7 天有效预签名链接，经 TinyURL 缩短
- 通过 LINE Messaging API Push Message 发送给指定 User ID（仅发给作者本人）
- LINE 消息包含：日期、会话数、AI 总结摘要（500字以内）、短链

**注意事项：**
- `aws-deploy/` 目录已加入 `.gitignore`，不推送到 GitHub（含敏感凭证）
- Lambda 部署包为纯标准库 + boto3，无需第三方依赖，单文件打包
- Groq API 在 AWS IP 下需要加 `User-Agent` 头，否则返回 403

---

### 4. LINE 通知

- LINE Notify 已于 2025-03-31 停止服务
- 改用 LINE Messaging API（Communication Plan 免费档，每月 200 条，实际用量约 30 条）
- 创建流程：LINE Official Account Manager → 设定 → Messaging API → 有效化 → LINE Developers Console 获取 Channel Access Token 和 User ID

---

### 5. Git / 部署

- 远程仓库名为 `zeli-portfolio`（非 `origin`），推送命令：`git push zeli-portfolio master`
- 历史提交中曾误提交 `aws-deploy/`（含 Groq key），已通过 `git reset --soft` 重写历史清除
- Vercel 环境变量需在 Dashboard → Settings → Environment Variables 手动配置，修改后需 Redeploy 才生效

---

### 待办 / 可改进项

- [ ] 消息级时间戳目前只对新会话生效，旧会话历史消息无 timestamp（已有 fallback 处理）
- [ ] LINE Messaging API Channel Access Token 为长期 token，注意定期检查有效性
- [ ] S3 免费额度仅前 12 个月，到期后费用约 $0.01/月，可忽略
