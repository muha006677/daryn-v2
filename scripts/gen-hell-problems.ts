/**
 * 地狱级数学题库生成器
 * 用法: tsx scripts/gen-hell-problems.ts --n=30 --topics=NT,ALG,COMB,GEO,INEQ --out=data/hell_problems.json
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

// 加载 .env.local
dotenv.config({ path: '.env.local' });

// ============ Zod Schema ============
const HellProblemSchema = z.object({
  id: z.string().describe('唯一标识符，如 HELL-NT-001'),
  topic: z.enum(['NT', 'ALG', 'COMB', 'GEO', 'INEQ']).describe('题目类型'),
  difficulty: z.union([z.literal(9), z.literal(10)]).describe('难度等级，只能是9或10'),
  statement: z.string().describe('题目陈述，中文，可包含LaTeX公式'),
  answer: z.string().describe('最终答案或结论'),
  solution_outline: z.array(z.string()).min(3).max(8).describe('解题要点，3-8条'),
  killer_step: z.string().describe('关键突破步骤，即最难想到的那一步'),
  tags: z.array(z.string()).describe('标签，如["数论","费马小定理","组合恒等式"]'),
});

const HellProblemsResponseSchema = z.object({
  problems: z.array(HellProblemSchema),
});

type HellProblem = z.infer<typeof HellProblemSchema>;

// ============ CLI 参数解析 ============
function parseArgs(): { n: number; topics: string[]; out: string } {
  const args = process.argv.slice(2);
  let n = 30;
  let topics = ['NT', 'ALG', 'COMB', 'INEQ'];
  let out = 'data/hell_problems.json';

  for (const arg of args) {
    if (arg.startsWith('--n=')) {
      n = parseInt(arg.slice(4), 10) || 30;
    } else if (arg.startsWith('--topics=')) {
      topics = arg.slice(9).split(',').map(t => t.trim().toUpperCase());
    } else if (arg.startsWith('--out=')) {
      out = arg.slice(6);
    }
  }

  return { n, topics, out };
}

// ============ 题型中文名映射 ============
const TOPIC_NAMES: Record<string, string> = {
  NT: '数论 (Number Theory)',
  ALG: '代数 (Algebra)',
  COMB: '组合 (Combinatorics)',
  GEO: '几何 (Geometry)',
  INEQ: '不等式 (Inequalities)',
};

// ============ System Prompt ============
function buildSystemPrompt(topics: string[]): string {
  const topicList = topics.map(t => `${t}: ${TOPIC_NAMES[t] || t}`).join('\n  ');
  
  return `你是一个顶级数学竞赛命题专家，专门出IMO/CMO决赛级别的"地狱难度"题目。

【任务】
生成高质量的数学竞赛题目，难度必须达到9或10级（满分10）。

【题型范围】
  ${topicList}

【严格要求】
1. 难度必须是9或10，不允许更低
2. 题目必须为真且可解（有完整严谨的解法）
3. 题面必须用中文书写，数学公式用LaTeX
4. 每道题的 statement（题面）和 killer_step（关键步骤）必须尽量不重复
5. answer 给出最终答案，如具体数值、"所有满足条件的解"、"成立/不成立"等
6. solution_outline 给出3-8条解题要点，强调关键步骤和技巧，不要废话
7. killer_step 是整道题最难想到、最关键的突破点
8. tags 用中文标签，反映题目涉及的知识点和技巧

【题面格式示例】
- "设 $p$ 为奇素数，求所有满足 $x^p + y^p = z^p$ 的正整数解。"
- "在 $\\triangle ABC$ 中，$I$ 为内心，$O$ 为外心。证明：$OI^2 = R^2 - 2Rr$。"

【solution_outline 格式示例】
- "利用费马小定理约化指数"
- "构造辅助圆，证明四点共圆"
- "对 $n$ 进行奇偶讨论"

【禁止】
- 不要出无解或答案不确定的题
- 不要出难度低于9的题
- 不要重复出相同结构的题`;
}

// ============ 生成题目 ============
async function generateProblems(
  client: OpenAI,
  model: string,
  topics: string[],
  batchSize: number
): Promise<HellProblem[]> {
  const userPrompt = `请生成 ${batchSize} 道地狱级数学竞赛题目。

题型分布要求：尽量均匀分布在以下类型中：${topics.join(', ')}

每道题必须包含完整的 id, topic, difficulty, statement, answer, solution_outline, killer_step, tags 字段。

id 格式：HELL-{topic}-{三位数字}，如 HELL-NT-001, HELL-ALG-002

现在开始生成：`;

  console.log(`  调用 API 生成 ${batchSize} 道题目...`);
  
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt(topics) },
      { role: 'user', content: userPrompt },
    ],
    response_format: zodResponseFormat(HellProblemsResponseSchema, 'hell_problems'),
    temperature: 0.9,
    max_tokens: 16000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('API 返回内容为空');
  }

  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(content);
  } catch {
    throw new Error('API 返回内容不是有效的 JSON');
  }

  const parseResult = HellProblemsResponseSchema.safeParse(parsedContent);
  if (!parseResult.success) {
    throw new Error(`API 返回格式错误: ${parseResult.error.message}`);
  }

  return parseResult.data.problems;
}

// ============ 去重 ============
function deduplicateProblems(problems: HellProblem[]): HellProblem[] {
  const seen = new Set<string>();
  const result: HellProblem[] = [];

  for (const p of problems) {
    // 用 statement + killer_step 的简化版本作为去重 key
    const key = `${p.statement.slice(0, 100)}|||${p.killer_step.slice(0, 50)}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(p);
    } else {
      console.log(`  去重：跳过重复题目 ${p.id}`);
    }
  }

  return result;
}

// ============ 重新编号 ============
function renumberProblems(problems: HellProblem[]): HellProblem[] {
  const counters: Record<string, number> = {};
  
  return problems.map(p => {
    const topic = p.topic;
    counters[topic] = (counters[topic] || 0) + 1;
    const num = counters[topic].toString().padStart(3, '0');
    return {
      ...p,
      id: `HELL-${topic}-${num}`,
    };
  });
}

// ============ 主函数 ============
async function main() {
  const { n, topics, out } = parseArgs();

  console.log('========================================');
  console.log('  地狱级数学题库生成器');
  console.log('========================================');
  console.log(`  目标数量: ${n}`);
  console.log(`  题型: ${topics.join(', ')}`);
  console.log(`  输出: ${out}`);
  console.log('----------------------------------------');

  // 检查 API Key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('错误: 未找到 OPENAI_API_KEY，请在 .env.local 中配置');
    process.exit(1);
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  console.log(`  模型: ${model}`);

  const client = new OpenAI({ apiKey });

  // 分批生成（每批最多10道，避免超时）
  const batchSize = Math.min(10, n);
  const batches = Math.ceil(n / batchSize);
  let allProblems: HellProblem[] = [];

  console.log(`  将分 ${batches} 批生成，每批 ${batchSize} 道`);
  console.log('----------------------------------------');

  for (let i = 0; i < batches; i++) {
    const remaining = n - allProblems.length;
    const currentBatch = Math.min(batchSize, remaining);
    
    if (currentBatch <= 0) break;

    console.log(`\n[批次 ${i + 1}/${batches}]`);
    
    try {
      const problems = await generateProblems(client, model, topics, currentBatch);
      console.log(`  成功生成 ${problems.length} 道题目`);
      allProblems = allProblems.concat(problems);
    } catch (error) {
      console.error(`  批次 ${i + 1} 生成失败:`, error);
      // 继续下一批
    }

    // 避免 rate limit
    if (i < batches - 1) {
      console.log('  等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n----------------------------------------');
  console.log(`  原始生成: ${allProblems.length} 道`);

  // 去重
  allProblems = deduplicateProblems(allProblems);
  console.log(`  去重后: ${allProblems.length} 道`);

  // 重新编号
  allProblems = renumberProblems(allProblems);

  // 创建输出目录
  const outDir = path.dirname(out);
  if (outDir && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`  创建目录: ${outDir}`);
  }

  // 写入文件
  const output = {
    generated_at: new Date().toISOString(),
    model,
    total: allProblems.length,
    topics,
    problems: allProblems,
  };

  fs.writeFileSync(out, JSON.stringify(output, null, 2), 'utf-8');

  console.log('----------------------------------------');
  console.log(`  ✅ 成功写入 ${out}`);
  console.log(`  共 ${allProblems.length} 道题目`);
  console.log('========================================');

  // 输出统计
  const stats: Record<string, number> = {};
  for (const p of allProblems) {
    stats[p.topic] = (stats[p.topic] || 0) + 1;
  }
  console.log('\n题型分布:');
  for (const [topic, count] of Object.entries(stats)) {
    console.log(`  ${topic}: ${count} 道`);
  }
}

main().catch(err => {
  console.error('生成失败:', err);
  process.exit(1);
});

