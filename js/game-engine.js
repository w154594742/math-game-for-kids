/**
 * 游戏引擎 - 核心游戏逻辑
 * 负责题目生成、答案验证、得分计算等核心功能
 */

class GameEngine {
  constructor() {
    this.currentLevel = 1;
    this.questionTypes = ['addition', 'subtraction', 'multiplication', 'division'];
    this.currentQuestions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.totalQuestions = 10;
    this.streak = 0;
    this.maxStreak = 0;
    this.startTime = null;
    this.operationType = 'addition';
    this.difficulty = 1;
    this.usedQuestions = new Set(); // 避免重复题目
    this.maxRetries = 50; // 生成题目的最大重试次数
    this.scoreHistory = []; // 分数历史记录
    this.sessionStats = { // 当前会话统计
      questionsAnswered: 0,
      totalTimeSpent: 0,
      streakCount: 0
    };
  }

  /**
   * 初始化游戏引擎
   * @param {string} operationType - 运算类型
   * @param {number} difficulty - 难度级别
   */
  init(operationType, difficulty) {
    this.operationType = operationType;
    this.difficulty = difficulty;
    this.currentQuestions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.startTime = Date.now();
    
    // 预生成所有题目
    this.generateAllQuestions();
  }

  /**
   * 生成所有题目
   */
  generateAllQuestions() {
    this.currentQuestions = [];
    this.usedQuestions.clear();

    for (let i = 0; i < this.totalQuestions; i++) {
      const question = this.createUniqueQuestion(this.operationType, this.difficulty);
      if (question) {
        this.currentQuestions.push(question);
      } else {
        // 如果无法生成唯一题目，生成普通题目
        const fallbackQuestion = this.createQuestion(this.operationType, this.difficulty);
        this.currentQuestions.push(fallbackQuestion);
      }
    }
  }

  /**
   * 创建唯一题目（避免重复）
   * @param {string} type - 运算类型
   * @param {number} level - 难度级别
   * @returns {Object|null} 题目对象或null
   */
  createUniqueQuestion(type, level) {
    let retries = 0;

    while (retries < this.maxRetries) {
      const question = this.createQuestion(type, level);
      const questionKey = `${question.num1}_${question.operator}_${question.num2}`;

      if (!this.usedQuestions.has(questionKey)) {
        this.usedQuestions.add(questionKey);
        return question;
      }

      retries++;
    }

    return null; // 无法生成唯一题目
  }

  /**
   * 创建单个题目
   * @param {string} type - 运算类型
   * @param {number} level - 难度级别
   * @returns {Object} 题目对象
   */
  createQuestion(type, level) {
    let question = {};
    const maxNumber = level === 1 ? 10 : level === 2 ? 20 : 100;
    let attempts = 0;

    // 重试机制，确保生成合格的题目
    do {
      switch (type) {
        case 'addition':
          question = this.generateAddition(maxNumber);
          break;
        case 'subtraction':
          question = this.generateSubtraction(maxNumber);
          break;
        case 'multiplication':
          question = this.generateMultiplication(Math.min(maxNumber, 10));
          break;
        case 'division':
          question = this.generateDivision(Math.min(maxNumber, 10));
          break;
        default:
          question = this.generateAddition(maxNumber);
      }
      attempts++;
    } while (!this.validateQuestion(question) && attempts < 10);

    // 如果仍然无法生成合格题目，使用简单的备用题目
    if (!this.validateQuestion(question)) {
      question = this.generateFallbackQuestion(type);
    }

    question.id = Date.now() + Math.random();
    question.type = type;
    question.level = level;
    question.startTime = Date.now();

    return question;
  }

  /**
   * 生成备用题目（简单且可靠）
   * @param {string} type - 运算类型
   * @returns {Object} 备用题目
   */
  generateFallbackQuestion(type) {
    switch (type) {
      case 'addition':
        return {
          num1: 1,
          num2: 1,
          operator: '+',
          answer: 2,
          question: '1 + 1 = ?',
          storyText: '1个苹果加1个苹果，一共几个？'
        };
      case 'subtraction':
        return {
          num1: 2,
          num2: 1,
          operator: '-',
          answer: 1,
          question: '2 - 1 = ?',
          storyText: '2个饼干吃掉1个，还剩几个？'
        };
      case 'multiplication':
        return {
          num1: 2,
          num2: 2,
          operator: '×',
          answer: 4,
          question: '2 × 2 = ?',
          storyText: '2行花，每行2朵，一共几朵？'
        };
      case 'division':
        return {
          num1: 4,
          num2: 2,
          operator: '÷',
          answer: 2,
          question: '4 ÷ 2 = ?',
          storyText: '4块蛋糕分给2个人，每人几块？'
        };
      default:
        return this.generateFallbackQuestion('addition');
    }
  }

  /**
   * 生成加法题目
   * @param {number} maxNumber - 最大数字
   * @returns {Object} 加法题目
   */
  generateAddition(maxNumber) {
    let num1, num2;

    // 根据难度级别调整题目复杂度
    if (maxNumber <= 10) {
      // 10以内加法，确保结果不超过10
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * (10 - num1)) + 1;
    } else if (maxNumber <= 20) {
      // 20以内加法，可能包含进位
      num1 = Math.floor(Math.random() * 19) + 1;
      num2 = Math.floor(Math.random() * (20 - num1)) + 1;
    } else {
      // 100以内加法
      num1 = Math.floor(Math.random() * 99) + 1;
      num2 = Math.floor(Math.random() * (100 - num1)) + 1;
    }

    // 随机选择故事文本
    const storyTexts = [
      `买${num1}个苹果和${num2}个苹果，一共有几个？`,
      `小明有${num1}个玩具，小红给了他${num2}个，现在有几个？`,
      `篮子里有${num1}个橘子，又放进${num2}个，总共几个？`,
      `停车场有${num1}辆车，又开来${num2}辆，现在有几辆？`
    ];

    return {
      num1: num1,
      num2: num2,
      operator: '+',
      answer: num1 + num2,
      question: `${num1} + ${num2} = ?`,
      storyText: storyTexts[Math.floor(Math.random() * storyTexts.length)]
    };
  }

  /**
   * 生成减法题目
   * @param {number} maxNumber - 最大数字
   * @returns {Object} 减法题目
   */
  generateSubtraction(maxNumber) {
    let num1, num2;

    // 根据难度级别调整题目复杂度
    if (maxNumber <= 10) {
      // 10以内减法
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
    } else if (maxNumber <= 20) {
      // 20以内减法，可能包含退位
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
    } else {
      // 100以内减法
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
    }

    // 随机选择故事文本
    const storyTexts = [
      `有${num1}个饼干，分给朋友${num2}个，还剩几个？`,
      `树上有${num1}只鸟，飞走了${num2}只，还剩几只？`,
      `小明有${num1}元钱，买东西花了${num2}元，还剩几元？`,
      `盒子里有${num1}个球，拿走${num2}个，还有几个？`
    ];

    return {
      num1: num1,
      num2: num2,
      operator: '-',
      answer: num1 - num2,
      question: `${num1} - ${num2} = ?`,
      storyText: storyTexts[Math.floor(Math.random() * storyTexts.length)]
    };
  }

  /**
   * 生成乘法题目
   * @param {number} maxNumber - 最大数字
   * @returns {Object} 乘法题目
   */
  generateMultiplication(maxNumber) {
    let num1, num2;

    // 乘法题目限制在10以内，避免结果过大
    const limit = Math.min(maxNumber, 10);

    // 优先生成乘法表中的题目
    if (Math.random() < 0.7) {
      // 70%概率生成乘法表题目
      num1 = Math.floor(Math.random() * limit) + 1;
      num2 = Math.floor(Math.random() * limit) + 1;
    } else {
      // 30%概率生成简单的乘法题目
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
    }

    // 随机选择故事文本
    const storyTexts = [
      `种${num1}行花，每行${num2}朵，一共种几朵？`,
      `${num1}个盒子，每个盒子有${num2}个苹果，总共几个？`,
      `${num1}排座位，每排${num2}个位子，一共几个位子？`,
      `小明每天读${num2}页书，${num1}天读了几页？`
    ];

    return {
      num1: num1,
      num2: num2,
      operator: '×',
      answer: num1 * num2,
      question: `${num1} × ${num2} = ?`,
      storyText: storyTexts[Math.floor(Math.random() * storyTexts.length)]
    };
  }

  /**
   * 生成除法题目
   * @param {number} maxNumber - 最大数字
   * @returns {Object} 除法题目
   */
  generateDivision(maxNumber) {
    let num1, num2, answer;

    // 除法题目限制在10以内，确保整除
    const limit = Math.min(maxNumber, 10);

    // 先确定除数和商，再计算被除数
    num2 = Math.floor(Math.random() * limit) + 1; // 除数 1-10
    answer = Math.floor(Math.random() * limit) + 1; // 商 1-10
    num1 = num2 * answer; // 被除数 = 除数 × 商

    // 确保被除数不会太大
    if (num1 > 100) {
      num2 = Math.floor(Math.random() * 5) + 1;
      answer = Math.floor(Math.random() * 5) + 1;
      num1 = num2 * answer;
    }

    // 随机选择故事文本
    const storyTexts = [
      `${num1}块蛋糕平均分给${num2}个朋友，每人几块？`,
      `${num1}个苹果装进${num2}个盒子，每盒几个？`,
      `${num1}本书平均放在${num2}个书架上，每个书架几本？`,
      `${num1}颗糖平均分给${num2}个小朋友，每人几颗？`
    ];

    return {
      num1: num1,
      num2: num2,
      operator: '÷',
      answer: answer,
      question: `${num1} ÷ ${num2} = ?`,
      storyText: storyTexts[Math.floor(Math.random() * storyTexts.length)]
    };
  }

  /**
   * 获取当前题目
   * @returns {Object} 当前题目
   */
  generateQuestion() {
    if (this.currentQuestionIndex < this.currentQuestions.length) {
      return this.currentQuestions[this.currentQuestionIndex];
    }
    return null;
  }

  /**
   * 验证答案
   * @param {number} userAnswer - 用户答案
   * @returns {Object} 验证结果
   */
  validateAnswer(userAnswer) {
    // 输入验证
    const validationResult = this.validateUserInput(userAnswer);
    if (!validationResult.isValid) {
      return {
        isCorrect: false,
        correctAnswer: null,
        userAnswer: userAnswer,
        points: 0,
        timeSpent: 0,
        streak: this.streak,
        error: validationResult.error,
        feedback: validationResult.feedback
      };
    }

    const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
    if (!currentQuestion) {
      return {
        isCorrect: false,
        correctAnswer: null,
        userAnswer: userAnswer,
        points: 0,
        timeSpent: 0,
        streak: this.streak,
        error: 'NO_QUESTION',
        feedback: '没有找到当前题目'
      };
    }

    const normalizedUserAnswer = this.normalizeAnswer(userAnswer);
    const isCorrect = normalizedUserAnswer === currentQuestion.answer;
    const timeSpent = Date.now() - currentQuestion.startTime;

    let points = 0;
    let feedback = '';

    if (isCorrect) {
      this.correctAnswers++;
      this.streak++;
      this.maxStreak = Math.max(this.maxStreak, this.streak);

      // 计算得分
      points = this.calculateScore(true, timeSpent, this.streak);
      this.score += points;

      // 生成正面反馈
      feedback = this.generatePositiveFeedback(timeSpent, this.streak);
    } else {
      this.streak = 0;

      // 生成建设性反馈
      feedback = this.generateConstructiveFeedback(currentQuestion, normalizedUserAnswer);
    }

    this.currentQuestionIndex++;

    return {
      isCorrect: isCorrect,
      correctAnswer: currentQuestion.answer,
      userAnswer: normalizedUserAnswer,
      originalUserAnswer: userAnswer,
      points: points,
      timeSpent: timeSpent,
      streak: this.streak,
      feedback: feedback,
      question: currentQuestion,
      progress: {
        current: this.currentQuestionIndex,
        total: this.totalQuestions
      }
    };
  }

  /**
   * 验证用户输入
   * @param {*} userAnswer - 用户输入的答案
   * @returns {Object} 验证结果
   */
  validateUserInput(userAnswer) {
    // 检查是否为空或未定义
    if (userAnswer === null || userAnswer === undefined) {
      return {
        isValid: false,
        error: 'EMPTY_ANSWER',
        feedback: '请输入答案'
      };
    }

    // 检查是否为数字
    const numericAnswer = Number(userAnswer);
    if (isNaN(numericAnswer)) {
      return {
        isValid: false,
        error: 'INVALID_NUMBER',
        feedback: '请输入一个有效的数字'
      };
    }

    // 检查是否为整数
    if (!Number.isInteger(numericAnswer)) {
      return {
        isValid: false,
        error: 'NOT_INTEGER',
        feedback: '请输入一个整数'
      };
    }

    // 检查数字范围
    if (numericAnswer < 0) {
      return {
        isValid: false,
        error: 'NEGATIVE_NUMBER',
        feedback: '答案不能是负数'
      };
    }

    if (numericAnswer > 10000) {
      return {
        isValid: false,
        error: 'NUMBER_TOO_LARGE',
        feedback: '答案太大了，请检查计算'
      };
    }

    return {
      isValid: true,
      normalizedAnswer: numericAnswer
    };
  }

  /**
   * 标准化答案
   * @param {*} userAnswer - 用户答案
   * @returns {number} 标准化后的答案
   */
  normalizeAnswer(userAnswer) {
    return Math.round(Number(userAnswer));
  }

  /**
   * 生成正面反馈
   * @param {number} timeSpent - 用时
   * @param {number} streak - 连击数
   * @returns {string} 反馈文本
   */
  generatePositiveFeedback(timeSpent, streak) {
    const feedbacks = [];

    // 基础正面反馈
    const baseFeedbacks = [
      '太棒了！', '答对了！', '很好！', '正确！',
      '你真聪明！', '做得很好！', '继续加油！'
    ];
    feedbacks.push(baseFeedbacks[Math.floor(Math.random() * baseFeedbacks.length)]);

    // 速度反馈
    if (timeSpent < 3000) {
      feedbacks.push('反应真快！');
    } else if (timeSpent < 5000) {
      feedbacks.push('速度不错！');
    }

    // 连击反馈
    if (streak >= 5) {
      feedbacks.push(`连续答对${streak}题，太厉害了！`);
    } else if (streak >= 3) {
      feedbacks.push(`连击${streak}次！`);
    }

    return feedbacks.join(' ');
  }

  /**
   * 生成建设性反馈
   * @param {Object} question - 题目对象
   * @param {number} userAnswer - 用户答案
   * @returns {string} 反馈文本
   */
  generateConstructiveFeedback(question, userAnswer) {
    const correctAnswer = question.answer;
    const difference = Math.abs(userAnswer - correctAnswer);

    let feedback = '再试试看！ ';

    // 根据答案接近程度给出提示
    if (difference === 1) {
      feedback += '你的答案很接近了！';
    } else if (difference <= 5) {
      feedback += '答案在附近，仔细想想。';
    } else if (difference <= 10) {
      feedback += '再仔细计算一下。';
    } else {
      feedback += '让我们一起重新计算。';
    }

    // 根据运算类型给出具体提示
    switch (question.operator) {
      case '+':
        feedback += ` 提示：${question.num1} 加上 ${question.num2}`;
        break;
      case '-':
        feedback += ` 提示：${question.num1} 减去 ${question.num2}`;
        break;
      case '×':
        feedback += ` 提示：${question.num1} 乘以 ${question.num2}`;
        break;
      case '÷':
        feedback += ` 提示：${question.num1} 除以 ${question.num2}`;
        break;
    }

    return feedback;
  }

  /**
   * 验证拖拽式答案
   * @param {Array} draggedItems - 拖拽的物品数组
   * @param {string} operationType - 运算类型
   * @returns {Object} 验证结果
   */
  validateDragAnswer(draggedItems, operationType) {
    if (!Array.isArray(draggedItems)) {
      return {
        isValid: false,
        error: 'INVALID_DRAG_DATA',
        feedback: '拖拽数据无效'
      };
    }

    const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
    if (!currentQuestion) {
      return {
        isValid: false,
        error: 'NO_QUESTION',
        feedback: '没有找到当前题目'
      };
    }

    let calculatedAnswer = 0;

    // 根据运算类型计算拖拽结果
    switch (operationType) {
      case 'addition':
        calculatedAnswer = draggedItems.length;
        break;
      case 'subtraction':
        // 减法：原有数量 - 拖走的数量
        calculatedAnswer = currentQuestion.num1 - draggedItems.length;
        break;
      case 'multiplication':
        // 乘法：检查是否按行列正确排列
        calculatedAnswer = this.validateMultiplicationArrangement(draggedItems, currentQuestion);
        break;
      case 'division':
        // 除法：检查是否平均分配
        calculatedAnswer = this.validateDivisionDistribution(draggedItems, currentQuestion);
        break;
      default:
        return {
          isValid: false,
          error: 'UNKNOWN_OPERATION',
          feedback: '未知的运算类型'
        };
    }

    return this.validateAnswer(calculatedAnswer);
  }

  /**
   * 验证乘法排列
   * @param {Array} draggedItems - 拖拽的物品
   * @param {Object} question - 题目对象
   * @returns {number} 计算出的答案
   */
  validateMultiplicationArrangement(draggedItems, question) {
    // 简化处理：直接计算拖拽物品的总数
    // 在实际场景管理器中会有更复杂的位置验证
    return draggedItems.length;
  }

  /**
   * 验证除法分配
   * @param {Array} draggedItems - 拖拽的物品
   * @param {Object} question - 题目对象
   * @returns {number} 计算出的答案
   */
  validateDivisionDistribution(draggedItems, question) {
    // 简化处理：检查每组的数量是否相等
    // 在实际场景管理器中会有更复杂的分组验证
    if (draggedItems.length === 0) return 0;

    // 假设物品已经按组分配，计算每组的平均数量
    return Math.floor(question.num1 / question.num2);
  }

  /**
   * 计算得分
   * @param {boolean} isCorrect - 是否正确
   * @param {number} timeSpent - 用时
   * @param {number} streak - 连击数
   * @returns {number} 得分
   */
  calculateScore(isCorrect, timeSpent, streak) {
    if (!isCorrect) return 0;

    let baseScore = 10;

    // 难度奖励
    if (this.difficulty === 3) {
      baseScore += 5; // 进阶级额外奖励
    } else if (this.difficulty === 2) {
      baseScore += 2; // 入门级额外奖励
    }

    // 连击奖励
    if (streak > 1) {
      baseScore += Math.min(streak * 2, 20); // 最多20分连击奖励
    }

    // 速度奖励
    if (timeSpent < 3000) { // 3秒内完成
      baseScore += 10;
    } else if (timeSpent < 5000) { // 5秒内完成
      baseScore += 5;
    } else if (timeSpent < 10000) { // 10秒内完成
      baseScore += 2;
    }

    // 运算类型奖励
    switch (this.operationType) {
      case 'multiplication':
      case 'division':
        baseScore += 3; // 乘除法额外奖励
        break;
    }

    return baseScore;
  }

  /**
   * 检查是否还有题目
   * @returns {boolean} 是否还有题目
   */
  hasMoreQuestions() {
    return this.currentQuestionIndex < this.currentQuestions.length;
  }

  /**
   * 获取游戏结果
   * @returns {Object} 游戏结果
   */
  getResults() {
    const totalTime = Date.now() - this.startTime;
    const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
    const averageTime = totalTime / this.totalQuestions;

    // 计算等级评定
    const grade = this.calculateGrade(accuracy, averageTime);

    // 计算奖励
    const rewards = this.calculateRewards(accuracy, this.maxStreak, averageTime);

    return {
      score: this.score,
      correctAnswers: this.correctAnswers,
      totalQuestions: this.totalQuestions,
      accuracy: Math.round(accuracy),
      totalTime: totalTime,
      averageTime: Math.round(averageTime),
      maxStreak: this.maxStreak,
      operationType: this.operationType,
      difficulty: this.difficulty,
      grade: grade,
      rewards: rewards,
      statistics: this.getDetailedStatistics()
    };
  }

  /**
   * 计算等级评定
   * @param {number} accuracy - 正确率
   * @param {number} averageTime - 平均用时
   * @returns {Object} 等级信息
   */
  calculateGrade(accuracy, averageTime) {
    let grade = 'C';
    let stars = 1;
    let message = '继续努力！';

    if (accuracy >= 95) {
      grade = 'A+';
      stars = 5;
      message = '完美表现！';
    } else if (accuracy >= 90) {
      grade = 'A';
      stars = 4;
      message = '优秀！';
    } else if (accuracy >= 80) {
      grade = 'B+';
      stars = 4;
      message = '很好！';
    } else if (accuracy >= 70) {
      grade = 'B';
      stars = 3;
      message = '不错！';
    } else if (accuracy >= 60) {
      grade = 'C+';
      stars = 2;
      message = '还可以！';
    } else if (accuracy >= 50) {
      grade = 'C';
      stars = 2;
      message = '继续努力！';
    } else {
      grade = 'D';
      stars = 1;
      message = '多练习会更好！';
    }

    // 速度加成
    if (averageTime < 5000 && accuracy >= 80) {
      stars = Math.min(stars + 1, 5);
      message += ' 速度很快！';
    }

    return {
      grade: grade,
      stars: stars,
      message: message
    };
  }

  /**
   * 计算奖励
   * @param {number} accuracy - 正确率
   * @param {number} maxStreak - 最大连击
   * @param {number} averageTime - 平均用时
   * @returns {Array} 奖励列表
   */
  calculateRewards(accuracy, maxStreak, averageTime) {
    const rewards = [];

    // 正确率奖励
    if (accuracy === 100) {
      rewards.push({
        type: 'achievement',
        name: 'perfect_score',
        title: '完美答题',
        description: '全部答对！',
        icon: '🏆'
      });
    } else if (accuracy >= 90) {
      rewards.push({
        type: 'achievement',
        name: 'excellent',
        title: '优秀表现',
        description: '正确率超过90%',
        icon: '⭐'
      });
    }

    // 连击奖励
    if (maxStreak >= 10) {
      rewards.push({
        type: 'achievement',
        name: 'streak_master',
        title: '连击大师',
        description: `连续答对${maxStreak}题`,
        icon: '🔥'
      });
    } else if (maxStreak >= 5) {
      rewards.push({
        type: 'achievement',
        name: 'combo_king',
        title: '连击之王',
        description: `连续答对${maxStreak}题`,
        icon: '⚡'
      });
    }

    // 速度奖励
    if (averageTime < 3000) {
      rewards.push({
        type: 'achievement',
        name: 'speed_demon',
        title: '闪电快手',
        description: '平均答题时间少于3秒',
        icon: '💨'
      });
    } else if (averageTime < 5000) {
      rewards.push({
        type: 'achievement',
        name: 'quick_thinker',
        title: '思维敏捷',
        description: '平均答题时间少于5秒',
        icon: '🧠'
      });
    }

    // 难度奖励
    if (this.difficulty === 3 && accuracy >= 80) {
      rewards.push({
        type: 'achievement',
        name: 'challenge_master',
        title: '挑战大师',
        description: '在进阶级难度下表现优秀',
        icon: '🎯'
      });
    }

    // 运算类型奖励
    if ((this.operationType === 'multiplication' || this.operationType === 'division') && accuracy >= 80) {
      rewards.push({
        type: 'achievement',
        name: 'math_expert',
        title: '数学专家',
        description: `${this.operationType === 'multiplication' ? '乘法' : '除法'}高手`,
        icon: '🔢'
      });
    }

    return rewards;
  }

  /**
   * 获取详细统计信息
   * @returns {Object} 详细统计
   */
  getDetailedStatistics() {
    const totalTime = Date.now() - this.startTime;
    const wrongAnswers = this.totalQuestions - this.correctAnswers;

    return {
      totalTime: totalTime,
      averageTimePerQuestion: Math.round(totalTime / this.totalQuestions),
      correctAnswers: this.correctAnswers,
      wrongAnswers: wrongAnswers,
      accuracy: Math.round((this.correctAnswers / this.totalQuestions) * 100),
      maxStreak: this.maxStreak,
      totalScore: this.score,
      averageScorePerQuestion: Math.round(this.score / this.totalQuestions),
      difficulty: this.difficulty,
      operationType: this.operationType,
      questionsPerMinute: Math.round((this.totalQuestions / (totalTime / 60000)) * 10) / 10
    };
  }

  /**
   * 验证题目质量
   * @param {Object} question - 题目对象
   * @returns {boolean} 题目是否合格
   */
  validateQuestion(question) {
    // 检查基本属性
    if (!question || !question.num1 || !question.num2 || !question.answer) {
      return false;
    }

    // 检查数字范围
    if (question.num1 < 0 || question.num2 < 0 || question.answer < 0) {
      return false;
    }

    // 检查答案正确性
    let expectedAnswer;
    switch (question.operator) {
      case '+':
        expectedAnswer = question.num1 + question.num2;
        break;
      case '-':
        expectedAnswer = question.num1 - question.num2;
        break;
      case '×':
        expectedAnswer = question.num1 * question.num2;
        break;
      case '÷':
        expectedAnswer = question.num1 / question.num2;
        break;
      default:
        return false;
    }

    // 检查答案是否为整数（特别是除法）
    if (expectedAnswer !== Math.floor(expectedAnswer)) {
      return false;
    }

    return expectedAnswer === question.answer;
  }

  /**
   * 获取题目难度统计
   * @returns {Object} 难度统计信息
   */
  getDifficultyStats() {
    const stats = {
      easy: 0,    // 答案 <= 10
      medium: 0,  // 答案 11-50
      hard: 0     // 答案 > 50
    };

    this.currentQuestions.forEach(question => {
      if (question.answer <= 10) {
        stats.easy++;
      } else if (question.answer <= 50) {
        stats.medium++;
      } else {
        stats.hard++;
      }
    });

    return stats;
  }

  /**
   * 获取当前题目的提示
   * @returns {Object} 提示信息
   */
  getHint() {
    const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
    if (!currentQuestion) {
      return {
        hasHint: false,
        message: '没有可用的提示'
      };
    }

    let hint = '';
    const { num1, num2, operator, answer } = currentQuestion;

    switch (operator) {
      case '+':
        if (num1 <= 10 && num2 <= 10) {
          hint = `可以用手指数一数：先数${num1}个，再数${num2}个`;
        } else {
          hint = `试试分步计算：${num1} + ${num2}`;
        }
        break;

      case '-':
        if (num1 <= 10) {
          hint = `从${num1}开始，往后退${num2}步`;
        } else {
          hint = `想想：${num1}减去${num2}等于多少？`;
        }
        break;

      case '×':
        if (num1 <= 5 && num2 <= 5) {
          hint = `可以画${num1}行，每行${num2}个点，数一数总共有几个`;
        } else {
          hint = `记住乘法表：${num1} × ${num2}`;
        }
        break;

      case '÷':
        hint = `想想：${num2} × ? = ${num1}，那么 ? 就是答案`;
        break;

      default:
        hint = '仔细想想，你一定能做对！';
    }

    return {
      hasHint: true,
      message: hint,
      question: currentQuestion
    };
  }

  /**
   * 检查答案是否接近正确答案
   * @param {number} userAnswer - 用户答案
   * @returns {Object} 接近程度信息
   */
  checkAnswerProximity(userAnswer) {
    const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
    if (!currentQuestion) {
      return { isClose: false };
    }

    const correctAnswer = currentQuestion.answer;
    const difference = Math.abs(userAnswer - correctAnswer);

    if (difference === 0) {
      return { isClose: true, proximity: 'exact', message: '完全正确！' };
    } else if (difference === 1) {
      return { isClose: true, proximity: 'very_close', message: '非常接近了！' };
    } else if (difference <= 3) {
      return { isClose: true, proximity: 'close', message: '很接近了！' };
    } else if (difference <= 5) {
      return { isClose: true, proximity: 'somewhat_close', message: '有点接近了' };
    } else {
      return { isClose: false, proximity: 'far', message: '再想想看' };
    }
  }

  /**
   * 获取错误分析
   * @param {number} userAnswer - 用户答案
   * @returns {Object} 错误分析
   */
  analyzeError(userAnswer) {
    const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
    if (!currentQuestion) {
      return { hasAnalysis: false };
    }

    const { num1, num2, operator, answer } = currentQuestion;
    const analysis = {
      hasAnalysis: true,
      possibleErrors: [],
      suggestions: []
    };

    switch (operator) {
      case '+':
        if (userAnswer === num1 || userAnswer === num2) {
          analysis.possibleErrors.push('忘记了加法运算');
          analysis.suggestions.push('记住要把两个数字加起来');
        } else if (userAnswer === Math.abs(num1 - num2)) {
          analysis.possibleErrors.push('做成了减法');
          analysis.suggestions.push('这是加法题，要用加号');
        }
        break;

      case '-':
        if (userAnswer === num1 + num2) {
          analysis.possibleErrors.push('做成了加法');
          analysis.suggestions.push('这是减法题，要用减号');
        } else if (userAnswer === num2 - num1) {
          analysis.possibleErrors.push('数字顺序搞反了');
          analysis.suggestions.push('减法要用大数减小数');
        }
        break;

      case '×':
        if (userAnswer === num1 + num2) {
          analysis.possibleErrors.push('做成了加法');
          analysis.suggestions.push('乘法是重复相加，不是简单相加');
        }
        break;

      case '÷':
        if (userAnswer === num1 - num2) {
          analysis.possibleErrors.push('做成了减法');
          analysis.suggestions.push('除法是平均分配，不是减法');
        }
        break;
    }

    if (analysis.possibleErrors.length === 0) {
      analysis.suggestions.push('仔细检查计算过程');
    }

    return analysis;
  }

  /**
   * 记录分数到历史
   * @param {Object} gameResult - 游戏结果
   */
  recordScore(gameResult) {
    const scoreRecord = {
      score: gameResult.score,
      accuracy: gameResult.accuracy,
      operationType: gameResult.operationType,
      difficulty: gameResult.difficulty,
      maxStreak: gameResult.maxStreak,
      totalTime: gameResult.totalTime,
      grade: gameResult.grade,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString()
    };

    this.scoreHistory.push(scoreRecord);

    // 只保留最近50次记录
    if (this.scoreHistory.length > 50) {
      this.scoreHistory = this.scoreHistory.slice(-50);
    }
  }

  /**
   * 获取个人最佳记录
   * @param {string} operationType - 运算类型
   * @param {number} difficulty - 难度级别
   * @returns {Object} 最佳记录
   */
  getPersonalBest(operationType = null, difficulty = null) {
    let filteredHistory = this.scoreHistory;

    if (operationType) {
      filteredHistory = filteredHistory.filter(record => record.operationType === operationType);
    }

    if (difficulty) {
      filteredHistory = filteredHistory.filter(record => record.difficulty === difficulty);
    }

    if (filteredHistory.length === 0) {
      return null;
    }

    // 找到最高分记录
    const bestScore = filteredHistory.reduce((best, current) => {
      return current.score > best.score ? current : best;
    });

    // 找到最高正确率记录
    const bestAccuracy = filteredHistory.reduce((best, current) => {
      return current.accuracy > best.accuracy ? current : best;
    });

    // 找到最快速度记录
    const bestSpeed = filteredHistory.reduce((best, current) => {
      return current.totalTime < best.totalTime ? current : best;
    });

    return {
      bestScore: bestScore,
      bestAccuracy: bestAccuracy,
      bestSpeed: bestSpeed,
      totalGames: filteredHistory.length,
      averageScore: Math.round(filteredHistory.reduce((sum, record) => sum + record.score, 0) / filteredHistory.length),
      averageAccuracy: Math.round(filteredHistory.reduce((sum, record) => sum + record.accuracy, 0) / filteredHistory.length)
    };
  }

  /**
   * 获取进步趋势
   * @param {number} recentGames - 最近游戏数量
   * @returns {Object} 进步趋势
   */
  getProgressTrend(recentGames = 10) {
    if (this.scoreHistory.length < 2) {
      return {
        hasTrend: false,
        message: '需要更多游戏数据来分析趋势'
      };
    }

    const recentRecords = this.scoreHistory.slice(-recentGames);
    const olderRecords = this.scoreHistory.slice(-recentGames * 2, -recentGames);

    if (olderRecords.length === 0) {
      return {
        hasTrend: false,
        message: '数据不足以分析趋势'
      };
    }

    const recentAvgScore = recentRecords.reduce((sum, record) => sum + record.score, 0) / recentRecords.length;
    const olderAvgScore = olderRecords.reduce((sum, record) => sum + record.score, 0) / olderRecords.length;

    const recentAvgAccuracy = recentRecords.reduce((sum, record) => sum + record.accuracy, 0) / recentRecords.length;
    const olderAvgAccuracy = olderRecords.reduce((sum, record) => sum + record.accuracy, 0) / olderRecords.length;

    const scoreImprovement = ((recentAvgScore - olderAvgScore) / olderAvgScore) * 100;
    const accuracyImprovement = recentAvgAccuracy - olderAvgAccuracy;

    let trend = 'stable';
    let message = '保持稳定的表现';

    if (scoreImprovement > 10 || accuracyImprovement > 5) {
      trend = 'improving';
      message = '你的表现在不断提升！';
    } else if (scoreImprovement < -10 || accuracyImprovement < -5) {
      trend = 'declining';
      message = '最近表现有所下降，多练习会更好';
    }

    return {
      hasTrend: true,
      trend: trend,
      message: message,
      scoreImprovement: Math.round(scoreImprovement),
      accuracyImprovement: Math.round(accuracyImprovement),
      recentAvgScore: Math.round(recentAvgScore),
      olderAvgScore: Math.round(olderAvgScore)
    };
  }

  /**
   * 获取学习建议
   * @returns {Array} 建议列表
   */
  getLearningRecommendations() {
    const recommendations = [];
    const personalBest = this.getPersonalBest();

    if (!personalBest) {
      return [{
        type: 'welcome',
        message: '欢迎开始数学学习之旅！',
        suggestion: '从简单的加法开始练习吧'
      }];
    }

    // 基于正确率的建议
    if (personalBest.averageAccuracy < 70) {
      recommendations.push({
        type: 'accuracy',
        message: '建议多练习基础运算',
        suggestion: '可以降低难度，先掌握基本概念'
      });
    } else if (personalBest.averageAccuracy > 90) {
      recommendations.push({
        type: 'challenge',
        message: '你的基础很扎实！',
        suggestion: '可以尝试更高难度或新的运算类型'
      });
    }

    // 基于速度的建议
    const avgTime = personalBest.bestSpeed ? personalBest.bestSpeed.totalTime / 10 : 0;
    if (avgTime > 10000) { // 平均每题超过10秒
      recommendations.push({
        type: 'speed',
        message: '可以提高答题速度',
        suggestion: '多练习能帮助你更快地计算'
      });
    }

    // 基于运算类型的建议
    const operationStats = {};
    this.scoreHistory.forEach(record => {
      if (!operationStats[record.operationType]) {
        operationStats[record.operationType] = [];
      }
      operationStats[record.operationType].push(record.accuracy);
    });

    Object.keys(operationStats).forEach(operation => {
      const avgAccuracy = operationStats[operation].reduce((sum, acc) => sum + acc, 0) / operationStats[operation].length;
      if (avgAccuracy < 70) {
        const operationNames = {
          'addition': '加法',
          'subtraction': '减法',
          'multiplication': '乘法',
          'division': '除法'
        };
        recommendations.push({
          type: 'operation',
          message: `${operationNames[operation]}需要加强练习`,
          suggestion: `多做一些${operationNames[operation]}题目`
        });
      }
    });

    return recommendations;
  }

  /**
   * 重置游戏状态
   */
  reset() {
    this.currentQuestions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.startTime = null;
    this.usedQuestions.clear();

    // 重置会话统计
    this.sessionStats = {
      questionsAnswered: 0,
      totalTimeSpent: 0,
      streakCount: 0
    };
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameEngine;
}
