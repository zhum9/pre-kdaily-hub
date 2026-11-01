// Theme order is a practice route, not a claimed match to a textbook edition.
export function extendProgression(catalog) {
  catalog.version = "2026.11.01.3";
  catalog.review.note =
    "按课程标准的知识主题参考，加入后续年级精选数学与分层推理任务；题目为原创规则生成，经独立答案检验，不冒称教材逐课配套或教师逐题审定。";
  catalog.coverage =
    "数学含一至六年级的精选主题，尚非各年级全册课程；按知识主题编排，不虚构教材单元。思维分层可选，英语按实际基础独立设置。";
  for (const skill of catalog.skills) {
    if (skill.subject === "math") skill.grade = 1;
    if (skill.subject === "english") skill.englishLevel = 1;
    if (skill.subject === "thinking") {
      skill.minGrade = 1;
      skill.maxGrade = 3;
    }
  }
  const add = (
    grade,
    term,
    template,
    suffix,
    title,
    goal,
    coach,
    extra = {},
  ) => {
    catalog.skills.push({
      id: `m${grade}-${suffix}`,
      subject: "math",
      grade,
      term,
      template,
      order:
        grade * 100 + catalog.skills.filter((s) => s.grade === grade).length,
      title,
      goal,
      coach,
      prerequisites: [],
      sources: ["moe-math"],
      ...extra,
    });
  };
  const units = [
    [
      2,
      1,
      "math-column",
      "column",
      "百以内加减：算理与检查",
      "理解数位对齐、进位与退位，用逆运算检查。",
      "先用十根一捆的小棒解释一次进位或退位，再写竖式。",
    ],
    [
      2,
      1,
      "math-groups",
      "groups",
      "乘法：几个几",
      "从相同加数和等量组理解乘法。",
      "画出每盒和盒数，说明两个因数分别表示什么。",
    ],
    [
      2,
      2,
      "math-share",
      "share",
      "平均分与除法",
      "用平均分和乘法检查理解除法。",
      "用小物件平均分，再用每份乘份数检查。",
    ],
    [
      2,
      2,
      "math-convert",
      "length",
      "米与厘米：统一单位",
      "知道1米是100厘米，能统一长度单位。",
      "在尺子上找到1厘米，与1米的实际长度比较。",
    ],
    [
      3,
      1,
      "math-column",
      "multiply",
      "多位数乘一位数",
      "按数位分解，理解计算与估算。",
      "先估数量级，拆成整十部分与个位计算。",
    ],
    [
      3,
      1,
      "math-share",
      "divide",
      "多位数除以一位数",
      "用分组理解除法，用乘法验算。",
      "写清总量、份数和每份的单位。",
    ],
    [
      3,
      2,
      "math-remainder",
      "remainder",
      "余数问题：还需要一辆车",
      "按真实问题解释余数，不机械舍去。",
      "画满车与剩下的人，解释为什么要多一辆。",
    ],
    [
      3,
      2,
      "math-rectangle",
      "perimeter",
      "长方形：周长",
      "区分围一圈的长度和内部面积。",
      "沿四条边比画一圈，指出长和宽各有两条。",
      { mode: "perimeter" },
    ],
    [
      4,
      1,
      "math-column",
      "multiply",
      "两位数乘两位数",
      "用分配思想解释多位数乘法。",
      "把一个因数拆成整十和个位，用两种算法相互检查。",
    ],
    [
      4,
      1,
      "math-share",
      "divide",
      "除数是两位数的平均分",
      "结合估商和乘法验算检查除法。",
      "先估每份的大致范围，避免只追求口算速度。",
    ],
    [
      4,
      2,
      "math-average",
      "average",
      "平均数：移多补少",
      "平均数描述整体水平，不等于每个个体实际值。",
      "先移动积木让三堆相等，再连接总数除以份数。",
    ],
    [
      4,
      2,
      "math-rectangle",
      "area",
      "面积与周长分清楚",
      "用单位方格理解长方形面积，区分计量单位。",
      "先数每行和行数，再说明平方厘米为什么不同于厘米。",
      { mode: "area" },
    ],
    [
      5,
      1,
      "math-decimal",
      "decimals",
      "小数：元角分中的加法",
      "小数点对齐源于相同计数单位对齐。",
      "换成分验算，解释一位小数与两位小数的关系。",
    ],
    [
      5,
      1,
      "math-rectangle",
      "triangle",
      "三角形面积：拼成两份",
      "理解底乘高后为什么要除以2。",
      "用两个同样三角形拼图，指出对应的底与高。",
      { mode: "triangle" },
    ],
    [
      5,
      2,
      "math-fraction",
      "fractions",
      "分数：同单位相加与约分",
      "整体一致、分数单位一致时才能直接合并份数。",
      "先画同一个整体，说明分母不相加的原因。",
    ],
    [
      5,
      2,
      "math-convert",
      "units",
      "小数与长度单位换算",
      "通过1米等于100厘米解释换算。",
      "用数位和实际单位解释换算，不只背小数点移动。",
    ],
    [
      6,
      1,
      "math-fraction",
      "fractions",
      "分数乘法：一部分的几分之几",
      "用整体分割解释乘法，并化为最简分数。",
      "用长方形面积模型表示一部分中的一部分。",
    ],
    [
      6,
      1,
      "math-ratio",
      "ratio",
      "按比分配：先求一份",
      "区分比的份数、总份数和实际数量。",
      "先画份数线段，不把两种数量之比误当部分占整体。",
    ],
    [
      6,
      2,
      "math-percent",
      "percent",
      "百分数：谁是整体",
      "明确整体，理解百分数表示的部分。",
      "先说哪一个量对应100%，再计算并估结果。",
    ],
    [
      6,
      2,
      "math-circle",
      "circle",
      "圆面积：半径与近似值",
      "区分半径直径，知道计算使用近似圆周率。",
      "先说明半径和平方单位，再做数量级检查。",
    ],
  ];
  units.forEach((unit) => add(...unit));
  const extraTopics = [
    [
      "guarantee",
      "最坏情况与保证",
      "🎒",
      "think-pigeonhole",
      "先构造尚未达到条件的最坏情况，再多取一个。",
    ],
    [
      "square-count",
      "分类数正方形",
      "▦",
      "think-squares",
      "按大小分类，检查大图形和缺口，避免重复遗漏。",
    ],
    [
      "winning-strategy",
      "轮流游戏策略",
      "♟️",
      "think-strategy",
      "从小数量反推，找到能保持的整组关系，并检验对手所有应对。",
    ],
  ];
  for (const [topicId, topicTitle, icon, template, coach] of extraTopics)
    for (let level = 1; level <= 3; level++)
      catalog.skills.push({
        id: `t-${topicId}-${level}`,
        subject: "thinking",
        template,
        topicId,
        topicTitle,
        icon,
        level,
        levelTitle: ["起步", "进阶", "挑战"][level - 1],
        minGrade: 3,
        maxGrade: 6,
        term: 1,
        order: 300 + extraTopics.findIndex((t) => t[0] === topicId) * 3 + level,
        title: `${topicTitle} · ${["图示与小规模", "增加分类和条件", "解释保证与边界"][level - 1]}`,
        goal: coach,
        coach,
        prerequisites: [],
        sources: ["nrich-lthc", "moe-math"],
      });
  const english = (id, title, level, words, dialogue, activity) =>
    catalog.skills.push({
      id,
      title,
      subject: "english",
      template: "english",
      englishLevel: level,
      order:
        100 * level +
        catalog.skills.filter((s) => s.subject === "english").length,
      term: 1,
      prerequisites: [],
      sources: ["bc-home", "english-standard"],
      goal: "先听懂情境，再用一句话完成真实交流，不以图片识别代替口语能力。",
      coach:
        "先听音和看图，家长再用中文说明情境；鼓励孩子表达，不要求模仿口音。",
      words: words.map(([en, zh, picture, cue]) => ({ en, zh, picture, cue })),
      dialogue,
      activity,
    });
  english(
    "e-polite",
    "礼貌表达：请求、接受与婉拒",
    2,
    [
      [
        "Yes, please.",
        "愿意接受",
        "✅",
        "Would you like some water? Say yes politely: Yes, please.",
      ],
      [
        "No, thank you.",
        "礼貌婉拒",
        "✋",
        "Would you like an apple? Say no politely: No, thank you.",
      ],
      ["Help, please.", "请求帮助", "🙋", "You need help. Say: Help, please."],
      [
        "Thank you.",
        "表示感谢",
        "💝",
        "Your friend helps you. Say: Thank you.",
      ],
    ],
    [
      "Would you like some water?",
      "Yes, please.",
      "Here you are.",
      "Thank you.",
    ],
    "用真实水杯做一次邀请：孩子可接受也可拒绝；家长只检查回应是否符合孩子意愿，不强迫总答Yes。再交换角色。",
  );
  english(
    "e-find",
    "寻找物品：位置与行动",
    2,
    [
      ["under", "在下面", "⬇️", "The ball is under the chair."],
      ["on", "在上面", "⬆️", "The book is on the desk."],
      ["in", "在里面", "📦", "The toy is in the box."],
      ["next to", "在旁边", "↔️", "The bag is next to the chair."],
    ],
    ["Where is my book?", "It is on the desk.", "Thank you. I found it!"],
    "把同一玩具放在盒里、盒上、盒旁和椅下，先听指令找到，再让孩子藏一次并告诉家长。图标只是提示，真正理解要靠实物操作。",
  );
  english(
    "e-routine",
    "我的一天：说清日常活动",
    3,
    [
      ["get up", "起床", "🌅", "I get up in the morning."],
      ["go to school", "去上学", "🏫", "I go to school after breakfast."],
      ["read a book", "读书", "📖", "I read a book after school."],
      ["go to bed", "睡觉", "🛏️", "I go to bed at night."],
    ],
    [
      "What do you do after school?",
      "I read a book.",
      "What about you?",
      "I play with my friends.",
    ],
    "用三幅自画图讲自己的真实一天；孩子可以换活动。请追问一次What about you?，目标是让听者明白，不是背相同句子。",
  );
  english(
    "e-directions",
    "校园小向导：听懂并给出方向",
    3,
    [
      ["turn left", "向左转", "⬅️", "At the corner, turn left."],
      ["turn right", "向右转", "➡️", "At the corner, turn right."],
      ["go straight", "直走", "⬆️", "Go straight to the library."],
      ["stop", "停下", "🛑", "Stop at the door."],
    ],
    [
      "Excuse me. Where is the library?",
      "Go straight. Then turn left.",
      "Is it next to the classroom?",
      "Yes, it is.",
    ],
    "在纸上画起点、转角和图书馆。孩子先按两步口头指令走棋子，再自己给家长两步指令；不在真实马路上练习。",
  );
  return catalog;
}
