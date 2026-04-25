import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
    
    // 接收前端传来的完整聊天记录和唯一会话 ID
    const { messages, chatId } = await req.json();

    // 1. 检查今日配额
    const today = new Date().toISOString().split('T')[0];
    const quotaKey = `chat_quota:${today}`;
    const currentQuota = await redis.get<number>(quotaKey) ?? 0;

    if (currentQuota >= 50) {
      return new NextResponse("今日配额已满", { status: 403 });
    }

    // 2. 准备 AI 的系统提示词（人设）
    const systemPrompt = {
      role: "system",
      content: `你是一个活泼、热情、友好的 AI 小助手，名字叫"小灵"（日文名叫レイ，英文名叫Ling），负责回答访客关于这个个人主页网站及其作者 Zeli 的问题。你的语气要充满活力，适当使用颜文字（如 ^_^, ✨, >_<）。

## 关于本网站
这是 Zeli Zhou 的个人主页，包含以下几个板块：
- 个人主页（Profile）：展示 Zeli 的教育背景与职业经历
- 实验室与插件（Labs）：收录 Zeli 开发的工程实验与个人工具，例如"个人旅游计划用网页App（九州版）"——一个支持动态调整行程与实时记录旅行开销的旅行辅助工具
- 光影与足迹（Photography）：用 Fujifilm X-S20 记录的日本各地及世界各地旅行照片，目前收录了"日本东北地方的二月：雪与祭典"等游记
- 留言板（Guestbook）：访客可以在此留言互动

## 关于作者 Zeli Zhou
- 姓名：Zeli Zhou（周澤立）
- 现居地：日本
- 职业：IT 工程师 & 顾问，目前就职于 Deloitte Tohmatsu Akt，担任交付分析师（2024年4月至今），主导基于 Salesforce 平台的数字化转型咨询与开发实施，提供端到端解决方案
- 教育背景：
  - 东京大学大学院工学系研究科，系统创成学专攻，硕士学位（2021.10 ~ 2023.9），毕业论文：《基于机器学习的模型化身体知识的焊接训练评分模型》
  - 武汉大学电子信息学院，通信工程，学士学位（2017.9 ~ 2021.6），毕业论文：《基于深度学习的单目相机深度预测模型》
- 兴趣爱好：热爱摄影（使用 Fujifilm X-S20）、旅行（目标走遍日本47都道府县及世界各地）、开发有趣的个人项目
- 联系方式：zlzhou1022@gmail.com

## 语言规则（重要）
请严格根据访客消息所使用的语言进行回复：
- 访客用中文提问 → 用中文回复
- 访客用英文提问 → 用英文回复
- 访客用日文提问 → 用日文回复
- 其他语言 → 用同样的语言回复

## 回答范围
你主要回答与本网站内容及作者 Zeli 相关的问题。同时也可以应对日常轻松的话题，例如问候、天气、兴趣爱好、旅行、摄影等闲聊内容。对于过于复杂或完全无关的话题（如专业法律、医疗建议等），请友好地说明你帮不上忙。`,
    };

    // 3. 呼叫大模型 (Groq API)，发送前剥离 timestamp 等非标准字段
    const messagesForLLM = messages.map(({ role, content }: { role: string; content: string; timestamp?: string }) => ({ role, content }));
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [systemPrompt, ...messagesForLLM],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ LLM API 报错详情:", errorData);
      return new NextResponse("AI 接口调用失败", { status: 500 });
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    // 给本轮新增的两条消息打上时间戳（历史消息已有时间戳，不重复打）
    const now = new Date().toISOString();
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && !lastUserMsg.timestamp) {
      lastUserMsg.timestamp = now;
    }
    const aiMessageWithTs = { ...aiMessage, timestamp: now };
    const fullHistory = [...messages, aiMessageWithTs];

    // 4. Upsert 逻辑：有则更新（覆盖），无则插入
    const { error: dbError } = await supabaseAdmin
      .from('chat_logs')
      .upsert({
        id: chatId,
        ip: ip,
        messages: fullHistory,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });
      
    if (dbError) {
      console.error("❌ 更新聊天快照失败:", dbError);
    } else {
      console.log(`✅ 会话 ${chatId?.slice(0,8)}... 已成功更新数据库快照!`);
    }
      
    // 5. 更新配额：每次成功的对话都算1次
    await redis.incr(quotaKey);
    await redis.expire(quotaKey, 60 * 60 * 24);

    return NextResponse.json(aiMessage);

  } catch (error) {
    console.error("❌ 聊天后端发生未知错误:", error);
    return new NextResponse("服务器内部错误", { status: 500 });
  }
}
