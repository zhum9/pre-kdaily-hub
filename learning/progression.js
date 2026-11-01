// Bounded original tasks for successive primary grades. Not a complete textbook.
export const PROGRESSION_TEMPLATES = [
  "math-column",
  "math-groups",
  "math-share",
  "math-remainder",
  "math-rectangle",
  "math-convert",
  "math-average",
  "math-decimal",
  "math-fraction",
  "math-percent",
  "math-ratio",
  "math-circle",
  "think-pigeonhole",
  "think-squares",
  "think-strategy",
];
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const fraction = (n, d) => {
  const common = gcd(n, d);
  return `${n / common}/${d / common}`;
};
export function makeProgressionItem(skill, rng) {
  if (!PROGRESSION_TEMPLATES.includes(skill.template)) return null;
  const int = (a, b) => a + Math.floor(rng() * (b - a + 1));
  const grade = skill.grade || skill.minGrade || 2;
  let prompt, answer, hint, explanation, model, choices, diagram;
  const money = (cents) => (cents / 100).toFixed(2);
  switch (skill.template) {
    case "math-column": {
      const a =
        grade === 2 ? int(25, 60) : grade === 3 ? int(101, 399) : int(12, 69);
      const b =
        grade === 2 ? int(11, 39) : grade === 3 ? int(2, 7) : int(11, 29);
      const op = grade === 2 ? (rng() < 0.5 ? "+" : "−") : "×";
      const high = op === "−" ? Math.max(a, b) : a,
        low = op === "−" ? Math.min(a, b) : b;
      answer = op === "+" ? high + low : op === "−" ? high - low : high * low;
      prompt = `${high} ${op} ${low} = □。可以用纸笔，先估一估，再算一算。`;
      hint =
        op === "×"
          ? "把一个因数按数位拆开，分别相乘再合起来。"
          : "相同数位对齐；想一想什么时候进位或退位。";
      explanation = `${high} ${op} ${low} = ${answer}。${op === "×" ? `可以检查：${Math.floor(high / 10) * 10} × ${low} + ${high % 10} × ${low} = ${answer}。` : `再用${op === "+" ? "减法" : "加法"}检查结果。`}`;
      model = { type: "operation", a: high, b: low, op };
      break;
    }
    case "math-groups": {
      const groups = int(2, 9),
        each = int(2, 9);
      answer = groups * each;
      prompt = `有 ${groups} 盒蜡笔，每盒 ${each} 支。每盒一样多，一共有多少支？`;
      hint = "先画几盒，每盒画同样多，再用乘法表示几个几。";
      explanation = `${groups} 个 ${each} 相加，可用 ${groups} × ${each} = ${answer}（支）表示。`;
      model = { type: "groups", groups, each };
      break;
    }
    case "math-share": {
      const each =
        grade === 2 ? int(2, 9) : grade === 3 ? int(12, 99) : int(11, 39);
      const groups = grade <= 3 ? int(2, 9) : int(11, 19);
      answer = each;
      prompt = `${groups * each} 本练习本，平均分给 ${groups} 个小组，每组几本？`;
      hint = "平均分表示每组一样多；用乘法检查每组数量。";
      explanation = `${groups * each} ÷ ${groups} = ${each}（本），检查：${groups} × ${each} = ${groups * each}。`;
      model = { type: "share", total: groups * each, groups };
      break;
    }
    case "math-remainder": {
      const each = int(3, 9),
        groups = int(2, 9),
        remainder = int(1, each - 1);
      answer = groups + 1;
      prompt = `${groups * each + remainder} 名同学，每辆车最多坐 ${each} 人。至少要几辆这样的车？（每人都要坐上车）`;
      hint = "先分成满车，剩下的人也需要一辆车。不能直接丢掉余数。";
      explanation = `${groups * each + remainder} ÷ ${each} = ${groups} 余 ${remainder}；剩下 ${remainder} 人还需要一辆，所以至少 ${answer} 辆。`;
      model = { type: "remainder", total: groups * each + remainder, each };
      break;
    }
    case "math-rectangle": {
      const length = int(4, 18),
        width = int(2, length - 1),
        area = skill.mode !== "perimeter",
        triangle = skill.mode === "triangle";
      answer = triangle
        ? length * width
        : area
          ? length * width
          : 2 * (length + width);
      prompt = triangle
        ? `三角形的底是 ${length * 2} 厘米，高是 ${width} 厘米，面积是多少平方厘米？`
        : `长方形长 ${length} 厘米、宽 ${width} 厘米，${area ? "面积是多少平方厘米" : "周长是多少厘米"}？`;
      hint = triangle
        ? "三角形可以和相同的另一个拼成平行四边形。"
        : area
          ? "每行有几格，共有几行？面积计量单位是平方厘米。"
          : "周长是围一圈的长度，长和宽各有两条。";
      explanation = triangle
        ? `${length * 2} × ${width} ÷ 2 = ${answer}（平方厘米）。`
        : area
          ? `${length} × ${width} = ${answer}（平方厘米）。`
          : `（${length} + ${width}）× 2 = ${answer}（厘米）。`;
      model = {
        type: "measure",
        length: triangle ? length * 2 : length,
        width,
        mode: triangle ? "triangle" : area ? "area" : "perimeter",
      };
      break;
    }
    case "math-convert": {
      const whole = int(1, 8),
        part = int(1, 9) * 10;
      answer = whole * 100 + part;
      prompt =
        grade >= 5
          ? `一根绳子长 ${whole}.${part} 米，合多少厘米？`
          : `一根绳子长 ${whole} 米 ${part} 厘米，一共多少厘米？`;
      hint = "1 米等于 100 厘米；先把单位统一再计算。";
      explanation = `${whole} 米是 ${whole * 100} 厘米，再加 ${part} 厘米，共 ${answer} 厘米。`;
      model = { type: "convert", whole, part, factor: 100 };
      break;
    }
    case "math-average": {
      const mean = int(8, 25),
        offset = int(1, 5);
      answer = mean;
      const numbers = [mean - offset, mean, mean + offset];
      prompt = `三组分别收集 ${numbers.join("、")} 个空瓶，平均每组收集几个？`;
      hint = "先合起来，再平均分成三份；也可以想怎样移多补少。";
      explanation = `（${numbers.join(" + ")}）÷ 3 = ${mean}（个）。平均数不代表每组实际都一样多。`;
      model = { type: "average", numbers };
      break;
    }
    case "math-decimal": {
      const a = int(105, 1690),
        b = int(101, 890),
        cents = a + b;
      answer = money(cents);
      prompt = `一本本子 ${money(a)} 元，一支笔 ${money(b)} 元，一共多少元？`;
      hint = "对齐小数点，让元对元、角对角、分对分；也可全部换成分。";
      explanation = `${a} 分 + ${b} 分 = ${cents} 分，也就是 ${answer} 元。`;
      choices = [answer, money(cents + 10), money(cents + 100)];
      model = { type: "decimal", cents: [a, b] };
      break;
    }
    case "math-fraction": {
      const multiply = grade >= 6,
        d = int(5, 10),
        a = int(1, d - 2),
        b = int(1, d - a - 1),
        e = int(3, 7);
      const numerator = multiply ? a * b : a + b,
        denominator = multiply ? d * e : d;
      answer = fraction(numerator, denominator);
      prompt = multiply
        ? `${a}/${d} × ${b}/${e} 等于多少？选择最简分数。`
        : `同一个整体的 ${a}/${d} 与 ${b}/${d} 合起来是多少？选择最简分数。`;
      hint = multiply
        ? "先想一个分数的几分之几，再检查分子和分母有没有公因数。"
        : "每份大小相同，份数相加，分母表示的每份大小不变。";
      explanation = `${multiply ? `${a}/${d} × ${b}/${e}` : `${a}/${d} + ${b}/${d}`} = ${numerator}/${denominator}，约分后是 ${answer}。`;
      choices = [
        answer,
        fraction(numerator + 1, denominator),
        fraction(numerator + 2, denominator),
      ];
      model = { type: "fraction", a, b, d, e, multiply };
      break;
    }
    case "math-percent": {
      const total = int(2, 12) * 100,
        percent = [10, 20, 25, 50, 75][int(0, 4)];
      answer = (total * percent) / 100;
      prompt = `图书角有 ${total} 本书，其中 ${percent}% 是科普书，科普书有多少本？`;
      hint = "百分之几表示每 100 份中的几份；先确定整体是什么。";
      explanation = `把 ${total} 本作为整体：${total} × ${percent}/100 = ${answer}（本）。`;
      model = { type: "percent", total, percent };
      break;
    }
    case "math-ratio": {
      const a = int(2, 5),
        b = int(2, 6),
        unit = int(3, 15);
      answer = a * unit;
      prompt = `红蓝两色卡片张数的比是 ${a}∶${b}，共 ${(a + b) * unit} 张。红卡片有几张？`;
      hint = "先数总份数，求一份，再求红色的份数。";
      explanation = `共 ${a + b} 份，一份 ${(a + b) * unit} ÷ ${a + b} = ${unit} 张；红卡 ${a} × ${unit} = ${answer} 张。`;
      model = { type: "ratio", a, b, total: (a + b) * unit };
      break;
    }
    case "math-circle": {
      const radius = int(2, 9),
        cents = 314 * radius * radius;
      answer = money(cents);
      prompt = `圆的半径是 ${radius} 厘米，取圆周率为 3.14，面积约多少平方厘米？`;
      hint = "圆面积用圆周率乘半径的平方，不是乘直径。";
      explanation = `3.14 × ${radius} × ${radius} = ${answer}（平方厘米），这是取圆周率 3.14 的近似值。`;
      choices = [answer, money(cents + 314), money(cents + 628)];
      model = { type: "circle", radius };
      break;
    }
    case "think-pigeonhole": {
      const level = skill.level || 1,
        colors = level === 1 ? int(2, 5) : level === 2 ? int(3, 7) : int(4, 8),
        wanted = level === 1 ? 2 : level === 2 ? 3 : int(3, 5);
      answer = colors * (wanted - 1) + 1;
      prompt = `袋里只有 ${colors} 种颜色的积木，每种都有很多。不看颜色，每次取 1 块，至少取多少块，才能保证有 ${wanted} 块同色？`;
      hint = "先想最不走运的取法：每种都尽量拿，却还达不到要求。";
      explanation = `最多可以每种先取 ${wanted - 1} 块，共 ${colors * (wanted - 1)} 块仍不满足；再取 1 块，必有一种达到 ${wanted} 块，所以是 ${answer} 块。`;
      model = { type: "pigeonhole", colors, wanted };
      break;
    }
    case "think-squares": {
      const level = skill.level || 1,
        columns = level === 1 ? int(2, 5) : int(3, 6),
        rows = level === 1 ? int(2, 4) : level === 2 ? int(3, 5) : int(3, 6);
      const blocked = level === 3;
      answer = 0;
      const counts = [];
      for (let side = 1; side <= Math.min(columns, rows); side++) {
        const count =
          (columns - side + 1) * (rows - side + 1) - (blocked ? 1 : 0);
        counts.push(count);
        answer += count;
      }
      prompt = `一个 ${columns} 列、${rows} 行的正方形方格图，${blocked ? "左上角 1 个小方格被挖去；经过这个缺口的正方形不计。" : ""}只数沿格线围成的正方形，大小都算，一共有几个？`;
      hint =
        "按边长 1 格、2 格、3 格分别数，不只数最小方格。缺口会让某些大正方形也消失。";
      explanation = `按边长从小到大分别有 ${counts.join("、")} 个，合计 ${answer} 个。${blocked ? "每种可容纳的边长都要扣除含左上缺口的那 1 个。" : "按大小分类能避免漏数和重复。"}`;
      model = { type: "squares", columns, rows, missingCorner: blocked };
      diagram = { type: "square-count", columns, rows, missingCorner: blocked };
      break;
    }
    case "think-strategy": {
      const max = (skill.level || 1) + 1,
        pile = int(max * 2 + 1, max * 5 + 2),
        remainder = pile % (max + 1);
      answer = remainder;
      prompt = `桌上有 ${pile} 块积木，两人轮流拿，每次拿 1 到 ${max} 块，拿走最后一块的人赢。双方都用最佳策略。先手第一步拿几块能保证赢？如果没有必胜第一步，填 0。`;
      hint = `想想每两回合怎样合起来拿 ${max + 1} 块；先研究较小数量。`;
      explanation = remainder
        ? `先取 ${remainder} 块，留下 ${pile - remainder}，是 ${max + 1} 的倍数。以后对手取 k 块，你取 ${max + 1}−k 块，保持成组，最终取完。`
        : `${pile} 是 ${max + 1} 的倍数。无论先取几块，对手都能凑成每组 ${max + 1} 块；对手最佳应对时，先手没有必胜第一步，填 0。`;
      model = { type: "strategy", pile, max };
      break;
    }
  }
  if (choices)
    choices = choices
      .map((value) => ({ value, order: rng() }))
      .sort((a, b) => a.order - b.order)
      .map((v) => v.value);
  return {
    prompt,
    answer,
    hint,
    explanation,
    steps: [hint, explanation],
    model,
    choices,
    diagram,
    visual: "",
    transfer: true,
    kind: choices ? "choice" : "number",
  };
}
