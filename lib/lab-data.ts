export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[]; // 增加标签功能，显示技术栈
}

const projects: Project[] = [
  {
    id: "kyushu-travel-planner",
    title: "个人旅游计划用网页app（九州版）",
    description: "一个专门为个人旅行设计的辅助工具，支持动态调整行程细节并实时记录旅行开销，解决旅途中繁琐的账目管理问题。",
    url: "https://zlzhou1022-cloud.github.io/travel/",
    tags: ["React", "Cloud Storage", "Finance"]
  },
  // 💡 预留位：基于你之前的研究，这里以后可以放入你的 Python 股票分析工具
  /*
  {
    id: "stock-quant-tool",
    title: "Python 量化分析工具集",
    description: "基于 yfinance 获取历史数据，进行多指标回测与可视化分析的工具，用于辅助 NISA 投资决策。",
    url: "#",
    tags: ["Python", "Data Science", "Investment"]
  }
  */
];

export const getAllProjects = () => projects;