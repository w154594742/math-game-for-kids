/**
 * 场景物品配置 - 各种数学场景的物品类型配置
 */

class SceneItemsConfig {
  constructor() {
    this.initializeConfigs();
  }

  initializeConfigs() {
    // 加法场景物品类型配置（18种组合）
    this.additionItems = [
      // 水果组合
      { 
        leftContainer: '🧺', leftContainerName: '篮子', leftTheme: '水果',
        rightContainer: '🧺', rightContainerName: '篮子', rightTheme: '水果',
        leftItem: { icon: '🍎', name: '苹果' },
        rightItem: { icon: '🍊', name: '橙子' },
        combinedName: '水果'
      },
      { 
        leftContainer: '🧺', leftContainerName: '篮子', leftTheme: '水果',
        rightContainer: '🧺', rightContainerName: '篮子', rightTheme: '水果',
        leftItem: { icon: '🍓', name: '草莓' },
        rightItem: { icon: '🍇', name: '葡萄' },
        combinedName: '水果'
      },
      { 
        leftContainer: '🧺', leftContainerName: '篮子', leftTheme: '水果',
        rightContainer: '🧺', rightContainerName: '篮子', rightTheme: '水果',
        leftItem: { icon: '🍌', name: '香蕉' },
        rightItem: { icon: '🥝', name: '猕猴桃' },
        combinedName: '水果'
      },

      // 蔬菜组合
      { 
        leftContainer: '🥬', leftContainerName: '菜篮', leftTheme: '蔬菜',
        rightContainer: '🥬', rightContainerName: '菜篮', rightTheme: '蔬菜',
        leftItem: { icon: '🥕', name: '胡萝卜' },
        rightItem: { icon: '🥒', name: '黄瓜' },
        combinedName: '蔬菜'
      },
      { 
        leftContainer: '🥬', leftContainerName: '菜篮', leftTheme: '蔬菜',
        rightContainer: '🥬', rightContainerName: '菜篮', rightTheme: '蔬菜',
        leftItem: { icon: '🍅', name: '番茄' },
        rightItem: { icon: '🥬', name: '白菜' },
        combinedName: '蔬菜'
      },
      { 
        leftContainer: '🥬', leftContainerName: '菜篮', leftTheme: '蔬菜',
        rightContainer: '🥬', rightContainerName: '菜篮', rightTheme: '蔬菜',
        leftItem: { icon: '🌽', name: '玉米' },
        rightItem: { icon: '🥔', name: '土豆' },
        combinedName: '蔬菜'
      },

      // 玩具组合
      { 
        leftContainer: '📦', leftContainerName: '玩具盒', leftTheme: '玩具',
        rightContainer: '📦', rightContainerName: '玩具盒', rightTheme: '玩具',
        leftItem: { icon: '🧸', name: '玩具熊' },
        rightItem: { icon: '🚗', name: '小汽车' },
        combinedName: '玩具'
      },
      { 
        leftContainer: '📦', leftContainerName: '玩具盒', leftTheme: '玩具',
        rightContainer: '📦', rightContainerName: '玩具盒', rightTheme: '玩具',
        leftItem: { icon: '⚽', name: '足球' },
        rightItem: { icon: '🏀', name: '篮球' },
        combinedName: '玩具'
      },
      { 
        leftContainer: '📦', leftContainerName: '玩具盒', leftTheme: '玩具',
        rightContainer: '📦', rightContainerName: '玩具盒', rightTheme: '玩具',
        leftItem: { icon: '🎲', name: '骰子' },
        rightItem: { icon: '🪀', name: '悠悠球' },
        combinedName: '玩具'
      },

      // 学习用品组合
      { 
        leftContainer: '👜', leftContainerName: '书包', leftTheme: '学习用品',
        rightContainer: '👜', rightContainerName: '书包', rightTheme: '学习用品',
        leftItem: { icon: '📚', name: '书本' },
        rightItem: { icon: '✏️', name: '铅笔' },
        combinedName: '学习用品'
      },
      { 
        leftContainer: '👜', leftContainerName: '书包', leftTheme: '学习用品',
        rightContainer: '👜', rightContainerName: '书包', rightTheme: '学习用品',
        leftItem: { icon: '🖍️', name: '蜡笔' },
        rightItem: { icon: '📝', name: '笔记本' },
        combinedName: '学习用品'
      },
      { 
        leftContainer: '👜', leftContainerName: '书包', leftTheme: '学习用品',
        rightContainer: '👜', rightContainerName: '书包', rightTheme: '学习用品',
        leftItem: { icon: '🎨', name: '画笔' },
        rightItem: { icon: '📐', name: '尺子' },
        combinedName: '学习用品'
      },

      // 食物组合
      { 
        leftContainer: '🎁', leftContainerName: '礼盒', leftTheme: '食物',
        rightContainer: '🎁', rightContainerName: '礼盒', rightTheme: '食物',
        leftItem: { icon: '🍪', name: '饼干' },
        rightItem: { icon: '🧁', name: '纸杯蛋糕' },
        combinedName: '食物'
      },
      { 
        leftContainer: '🎁', leftContainerName: '礼盒', leftTheme: '食物',
        rightContainer: '🎁', rightContainerName: '礼盒', rightTheme: '食物',
        leftItem: { icon: '🍬', name: '糖果' },
        rightItem: { icon: '🍭', name: '棒棒糖' },
        combinedName: '食物'
      },
      { 
        leftContainer: '🎁', leftContainerName: '礼盒', leftTheme: '食物',
        rightContainer: '🎁', rightContainerName: '礼盒', rightTheme: '食物',
        leftItem: { icon: '🥨', name: '椒盐卷饼' },
        rightItem: { icon: '🍩', name: '甜甜圈' },
        combinedName: '食物'
      },

      // 花朵组合
      { 
        leftContainer: '🪣', leftContainerName: '花盆', leftTheme: '花朵',
        rightContainer: '🪣', rightContainerName: '花盆', rightTheme: '花朵',
        leftItem: { icon: '🌸', name: '樱花' },
        rightItem: { icon: '🌻', name: '向日葵' },
        combinedName: '花朵'
      },
      { 
        leftContainer: '🪣', leftContainerName: '花盆', leftTheme: '花朵',
        rightContainer: '🪣', rightContainerName: '花盆', rightTheme: '花朵',
        leftItem: { icon: '🌷', name: '郁金香' },
        rightItem: { icon: '🌹', name: '玫瑰' },
        combinedName: '花朵'
      },
      { 
        leftContainer: '🪣', leftContainerName: '花盆', leftTheme: '花朵',
        rightContainer: '🪣', rightContainerName: '花盆', rightTheme: '花朵',
        leftItem: { icon: '🌺', name: '木槿花' },
        rightItem: { icon: '🌼', name: '雏菊' },
        combinedName: '花朵'
      }
    ];

    // 减法场景物品类型配置（生活化场景）
    this.subtractionItems = [
      // 水果系列 - 吃掉了
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍎', name: '苹果' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个苹果吧？', '看看篮子里还有几个苹果？', '数数剩下的苹果有多少个呢？'] },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍊', name: '橙子' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个橙子吧？', '看看篮子里还有几个橙子？', '数数剩下的橙子有多少个呢？'] },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍓', name: '草莓' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个草莓吧？', '看看篮子里还有几个草莓？', '数数剩下的草莓有多少个呢？'] },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍇', name: '葡萄' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个葡萄吧？', '看看篮子里还有几个葡萄？', '数数剩下的葡萄有多少个呢？'] },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍌', name: '香蕉' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少根香蕉吧？', '看看篮子里还有几根香蕉？', '数数剩下的香蕉有多少根呢？'] },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🥝', name: '猕猴桃' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个猕猴桃吧？', '看看篮子里还有几个猕猴桃？', '数数剩下的猕猴桃有多少个呢？'] },

      // 蔬菜系列 - 用掉了
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥕', name: '胡萝卜' }, actions: ['做菜用掉了', '做沙拉用掉了'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少根胡萝卜吧？', '看看菜篮里还有几根胡萝卜？', '数数剩下的胡萝卜有多少根呢？'] },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥒', name: '黄瓜' }, actions: ['做菜用掉了', '做沙拉用掉了'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少根黄瓜吧？', '看看菜篮里还有几根黄瓜？', '数数剩下的黄瓜有多少根呢？'] },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🍅', name: '番茄' }, actions: ['做菜用掉了', '做沙拉用掉了'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少个番茄吧？', '看看菜篮里还有几个番茄？', '数数剩下的番茄有多少个呢？'] },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥬', name: '白菜' }, actions: ['做菜用掉了', '煮汤用掉了'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少棵白菜吧？', '看看菜篮里还有几棵白菜？', '数数剩下的白菜有多少棵呢？'] },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🌽', name: '玉米' }, actions: ['做菜用掉了', '煮汤用掉了'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少根玉米吧？', '看看菜篮里还有几根玉米？', '数数剩下的玉米有多少根呢？'] },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥔', name: '土豆' }, actions: ['做菜用掉了', '煮汤用掉了'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少个土豆吧？', '看看菜篮里还有几个土豆？', '数数剩下的土豆有多少个呢？'] },

      // 玩具系列 - 弄坏了/弄丢了
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🧸', name: '玩具熊' }, actions: ['玩耍时弄坏了', '不小心弄丢了'], rightLabel: '弄坏了', hintTemplates: ['请现在数一数还剩多少个玩具熊吧？', '看看玩具盒里还有几个玩具熊？', '数数剩下的玩具熊有多少个呢？'] },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🚗', name: '小汽车' }, actions: ['玩耍时弄坏了', '不小心弄丢了'], rightLabel: '弄丢了', hintTemplates: ['请现在数一数还剩多少辆小汽车吧？', '看看玩具盒里还有几辆小汽车？', '数数剩下的小汽车有多少辆呢？'] },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '⚽', name: '足球' }, actions: ['踢球时弄丢了', '不小心弄坏了'], rightLabel: '弄丢了', hintTemplates: ['请现在数一数还剩多少个足球吧？', '看看玩具盒里还有几个足球？', '数数剩下的足球有多少个呢？'] },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🏀', name: '篮球' }, actions: ['打球时弄丢了', '不小心弄坏了'], rightLabel: '弄丢了', hintTemplates: ['请现在数一数还剩多少个篮球吧？', '看看玩具盒里还有几个篮球？', '数数剩下的篮球有多少个呢？'] },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🎲', name: '骰子' }, actions: ['游戏时弄丢了', '不小心弄坏了'], rightLabel: '弄丢了', hintTemplates: ['请现在数一数还剩多少个骰子吧？', '看看玩具盒里还有几个骰子？', '数数剩下的骰子有多少个呢？'] },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🪀', name: '悠悠球' }, actions: ['玩耍时弄坏了', '不小心弄丢了'], rightLabel: '弄坏了', hintTemplates: ['请现在数一数还剩多少个悠悠球吧？', '看看玩具盒里还有几个悠悠球？', '数数剩下的悠悠球有多少个呢？'] },

      // 学习用品系列 - 借给了/送给了
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '📚', name: '书本' }, actions: ['借给了同学', '送给了朋友'], rightLabel: '借给了同学', hintTemplates: ['请现在数一数还剩多少本书吧？', '看看书包里还有几本书？', '数数剩下的书本有多少本呢？'] },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '✏️', name: '铅笔' }, actions: ['借给了同学', '分给了小伙伴们'], rightLabel: '借给了同学', hintTemplates: ['请现在数一数还剩多少支铅笔吧？', '看看书包里还有几支铅笔？', '数数剩下的铅笔有多少支呢？'] },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '🖍️', name: '蜡笔' }, actions: ['借给了同学', '分给了小伙伴们'], rightLabel: '分给了小伙伴们', hintTemplates: ['请现在数一数还剩多少支蜡笔吧？', '看看书包里还有几支蜡笔？', '数数剩下的蜡笔有多少支呢？'] },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '📝', name: '笔记本' }, actions: ['借给了同学', '送给了朋友'], rightLabel: '借给了同学', hintTemplates: ['请现在数一数还剩多少本笔记本吧？', '看看书包里还有几本笔记本？', '数数剩下的笔记本有多少本呢？'] },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '🎨', name: '画笔' }, actions: ['借给了同学', '分给了小伙伴们'], rightLabel: '借给了同学', hintTemplates: ['请现在数一数还剩多少支画笔吧？', '看看书包里还有几支画笔？', '数数剩下的画笔有多少支呢？'] },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '📐', name: '尺子' }, actions: ['借给了同学', '送给了朋友'], rightLabel: '借给了同学', hintTemplates: ['请现在数一数还剩多少把尺子吧？', '看看书包里还有几把尺子？', '数数剩下的尺子有多少把呢？'] },

      // 食物系列 - 吃掉了
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍪', name: '饼干' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少块饼干吧？', '看看礼盒里还有几块饼干？', '数数剩下的饼干有多少块呢？'] },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🧁', name: '纸杯蛋糕' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个纸杯蛋糕吧？', '看看礼盒里还有几个纸杯蛋糕？', '数数剩下的纸杯蛋糕有多少个呢？'] },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍬', name: '糖果' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少颗糖果吧？', '看看礼盒里还有几颗糖果？', '数数剩下的糖果有多少颗呢？'] },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍭', name: '棒棒糖' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个棒棒糖吧？', '看看礼盒里还有几个棒棒糖？', '数数剩下的棒棒糖有多少个呢？'] },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🥨', name: '椒盐卷饼' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个椒盐卷饼吧？', '看看礼盒里还有几个椒盐卷饼？', '数数剩下的椒盐卷饼有多少个呢？'] },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍩', name: '甜甜圈' }, actions: ['吃掉了'], rightLabel: '吃掉了', hintTemplates: ['请现在数一数还剩多少个甜甜圈吧？', '看看礼盒里还有几个甜甜圈？', '数数剩下的甜甜圈有多少个呢？'] },

      // 花朵系列 - 摘掉了/用掉了
      { container: '🪣', containerName: '花盆', theme: '花朵', item: { icon: '🌸', name: '樱花' }, actions: ['做花环摘掉了', '用掉了装饰房间'], rightLabel: '摘掉了', hintTemplates: ['请现在数一数还剩多少朵樱花吧？', '看看花盆里还有几朵樱花？', '数数剩下的樱花有多少朵呢？'] },
      { container: '🪣', containerName: '花盆', theme: '花朵', item: { icon: '🌻', name: '向日葵' }, actions: ['做花环摘掉了', '用掉了装饰房间'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少朵向日葵吧？', '看看花盆里还有几朵向日葵？', '数数剩下的向日葵有多少朵呢？'] },
      { container: '🪣', containerName: '花盆', theme: '花朵', item: { icon: '🌷', name: '郁金香' }, actions: ['做花环摘掉了', '送给了妈妈'], rightLabel: '摘掉了', hintTemplates: ['请现在数一数还剩多少朵郁金香吧？', '看看花盆里还有几朵郁金香？', '数数剩下的郁金香有多少朵呢？'] },
      { container: '🪣', containerName: '花盆', theme: '花朵', item: { icon: '🌹', name: '玫瑰' }, actions: ['做花环摘掉了', '送给了妈妈'], rightLabel: '送给了妈妈', hintTemplates: ['请现在数一数还剩多少朵玫瑰吧？', '看看花盆里还有几朵玫瑰？', '数数剩下的玫瑰有多少朵呢？'] },
      { container: '🪣', containerName: '花盆', theme: '花朵', item: { icon: '🌺', name: '木槿花' }, actions: ['做花环摘掉了', '用掉了装饰房间'], rightLabel: '摘掉了', hintTemplates: ['请现在数一数还剩多少朵木槿花吧？', '看看花盆里还有几朵木槿花？', '数数剩下的木槿花有多少朵呢？'] },
      { container: '🪣', containerName: '花盆', theme: '花朵', item: { icon: '🌼', name: '雏菊' }, actions: ['做花环摘掉了', '用掉了装饰房间'], rightLabel: '用掉了', hintTemplates: ['请现在数一数还剩多少朵雏菊吧？', '看看花盆里还有几朵雏菊？', '数数剩下的雏菊有多少朵呢？'] }
    ];
  }

  /**
   * 随机选择一种加法物品组合
   * @returns {Object} 加法物品组合信息
   */
  getRandomAdditionItem() {
    const randomIndex = Math.floor(Math.random() * this.additionItems.length);
    return this.additionItems[randomIndex];
  }

  /**
   * 随机选择一种减法物品类型
   * @returns {Object} 减法物品类型信息
   */
  getRandomSubtractionItem() {
    const randomIndex = Math.floor(Math.random() * this.subtractionItems.length);
    return this.subtractionItems[randomIndex];
  }

  /**
   * 获取减法场景的提示文案
   * @param {Object} itemType - 物品类型信息
   * @returns {string} 格式化的提示文案
   */
  getHintTemplate(itemType) {
    if (!itemType || !itemType.hintTemplates || itemType.hintTemplates.length === 0) {
      // 默认提示文案
      return `请现在数一数还剩多少个${itemType?.item?.name || '物品'}吧？`;
    }

    // 随机选择一个提示文案模板
    const randomIndex = Math.floor(Math.random() * itemType.hintTemplates.length);
    return itemType.hintTemplates[randomIndex];
  }

  // 乘法场景物品类型配置（25种组合）
  initMultiplicationItems() {
    this.multiplicationItems = [
      // 水果系列
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍎', name: '苹果' } },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍊', name: '橙子' } },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍓', name: '草莓' } },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍇', name: '葡萄' } },
      { container: '🧺', containerName: '篮子', theme: '水果', item: { icon: '🍌', name: '香蕉' } },

      // 蔬菜系列
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥕', name: '胡萝卜' } },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥒', name: '黄瓜' } },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🍅', name: '番茄' } },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🥬', name: '白菜' } },
      { container: '🥬', containerName: '菜篮', theme: '蔬菜', item: { icon: '🌽', name: '玉米' } },

      // 玩具系列
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🧸', name: '玩具熊' } },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🚗', name: '小汽车' } },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '⚽', name: '足球' } },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🏀', name: '篮球' } },
      { container: '📦', containerName: '玩具盒', theme: '玩具', item: { icon: '🎲', name: '骰子' } },

      // 学习用品系列
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '📚', name: '书本' } },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '✏️', name: '铅笔' } },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '🖍️', name: '蜡笔' } },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '📝', name: '笔记本' } },
      { container: '👜', containerName: '书包', theme: '学习用品', item: { icon: '🎨', name: '画笔' } },

      // 食物系列
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍪', name: '饼干' } },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🧁', name: '纸杯蛋糕' } },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍬', name: '糖果' } },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🍭', name: '棒棒糖' } },
      { container: '🎁', containerName: '礼盒', theme: '食物', item: { icon: '🥨', name: '椒盐卷饼' } }
    ];
  }

  /**
   * 随机选择一种乘法物品类型
   * @returns {Object} 乘法物品类型信息
   */
  getRandomMultiplicationItem() {
    if (!this.multiplicationItems) {
      this.initMultiplicationItems();
    }
    const randomIndex = Math.floor(Math.random() * this.multiplicationItems.length);
    return this.multiplicationItems[randomIndex];
  }

  // 除法场景物品类型配置（生活化场景）
  initDivisionItems() {
    this.divisionItems = [
      // 聚会食物系列
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '聚会食物',
        item: { icon: '🎂', name: '蛋糕' },
        scenario: '聚会分享',
        questionTemplate: '{character}准备了{total}个{itemName}，要平均分给{plateCount}个小朋友，每个小朋友能分到几个{itemName}？'
      },
      {
        container: '👜',
        containerName: '袋子',
        theme: '聚会食物',
        item: { icon: '🍬', name: '糖果' },
        scenario: '聚会分享',
        questionTemplate: '{character}买了{total}颗{itemName}，要平均装进{plateCount}个袋子里，每个袋子装几颗{itemName}？'
      },
      {
        container: '🎁',
        containerName: '礼盒',
        theme: '聚会食物',
        item: { icon: '🍪', name: '饼干' },
        scenario: '聚会分享',
        questionTemplate: '奶奶做了{total}块{itemName}，要平均分给{plateCount}个小朋友，每个小朋友能吃几块{itemName}？'
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '聚会食物',
        item: { icon: '🧁', name: '纸杯蛋糕' },
        scenario: '聚会分享',
        questionTemplate: '{character}做了{total}个{itemName}，要平均装进{plateCount}个篮子，每个篮子装几个{itemName}？'
      },

      // 水果系列
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '水果',
        item: { icon: '🍎', name: '苹果' },
        scenario: '用餐分配',
        questionTemplate: '妈妈买了{total}个{itemName}，要平均分给{plateCount}个盘子，每个盘子放几个{itemName}？'
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        item: { icon: '🍊', name: '橙子' },
        scenario: '用餐分配',
        questionTemplate: '{character}摘了{total}个{itemName}，要平均装进{plateCount}个篮子，每个篮子装几个{itemName}？'
      },

      // 玩具系列
      {
        container: '📦',
        containerName: '盒子',
        theme: '玩具',
        item: { icon: '🧸', name: '玩具熊' },
        scenario: '分享游戏',
        questionTemplate: '{character}有{total}个{itemName}，要平均分给{plateCount}个小伙伴，每个小伙伴能得到几个{itemName}？'
      },
      {
        container: '🎁',
        containerName: '礼盒',
        theme: '玩具',
        item: { icon: '🚗', name: '小汽车' },
        scenario: '分享游戏',
        questionTemplate: '{character}买了{total}辆{itemName}，要平均装进{plateCount}个礼盒，每个礼盒装几辆{itemName}？'
      },

      // 学习用品系列
      {
        container: '📚',
        containerName: '书架',
        theme: '学习用品',
        item: { icon: '📖', name: '书本' },
        scenario: '学习分组',
        questionTemplate: '图书馆有{total}本{itemName}，要平均放在{plateCount}个书架上，每个书架放几本{itemName}？'
      },
      {
        container: '👜',
        containerName: '袋子',
        theme: '学习用品',
        item: { icon: '✏️', name: '铅笔' },
        scenario: '学习分组',
        questionTemplate: '老师有{total}支{itemName}，要平均分给{plateCount}个小组，每个小组分到几支{itemName}？'
      }
    ];
  }

  /**
   * 随机选择一种除法物品类型
   * @returns {Object} 除法物品类型信息
   */
  getRandomDivisionItem() {
    if (!this.divisionItems) {
      this.initDivisionItems();
    }
    const randomIndex = Math.floor(Math.random() * this.divisionItems.length);
    return this.divisionItems[randomIndex];
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SceneItemsConfig;
}
