# 陶文文｜临床 AI 产品与解决方案求职网站

这是与学术网站分离的商业化求职网站，核心定位是 **Clinical AI Product Builder**：把临床问题、业务约束、数据治理、AI 产品架构与软件验证连接成可审计的产品闭环。

- 在线网站：https://wendytao9310.github.io/wenwen-clinical-ai-portfolio/
- 学术网站：https://wendytao9310.github.io/wenwen-academic-site/

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建结果位于 `dist/`，可部署到 GitHub Pages、Cloudflare Pages、Vercel 等静态托管服务。

## 当前内容

- 商业化价值主张与能力链
- Intelligent Health Cockpit 旗舰案例
- BPlus 软件证据与 DEMO / PILOT / REAL 验证边界
- 从临床到产品、数据、架构和工程落地的能力演进
- 临床 AI 模型风险意识
- Clinical AI Evidence & Safety Lab 产品路线图
- 可运行的 Evidence & Safety Lab v0.2：预期用途、证据卡、安全门槛、评估计划、反馈台账与 Claim Checker
- 求职简历下载、邮件联系和独立学术网站入口
- 最新投稿研究及其对产品验证的启示（明确标注 Submitted）

## 证据边界

网站中的“产品架构”“软件 Demo”“研究工作流”是当前已有证据；整车部署、真实用户效果、临床有效性、商业收益和规模化应用仍需后续验证，不能被当前页面表述为已经完成。

## 隐私与许可

- 公开版求职简历已移除手机号，保留职业邮箱。
- 网站源码采用 MIT License。
- 个人肖像、简历、姓名、项目叙述及其他个人内容不随源码授权复用。

## 下一阶段

Evidence & Safety Lab v0.2 已完成合成数据 Demo 和本地反馈闭环。下一阶段按 `docs/FEEDBACK_PROTOCOL.md` 开展 5–8 名专业用户的可用性与安全边界测试，并将确认后的问题写入 GitHub Issues；不会将软件 Demo 表述为临床验证。

## 自动化检查

```bash
npm test
npm run build
```

规则测试覆盖患者级数据拦截、自动诊疗用途拦截、低风险工作流、证据缺口、评估计划、声明检查和反馈隐私筛查。
