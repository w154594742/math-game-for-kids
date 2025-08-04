/**
 * 界面管理器 - 负责用户界面的控制和管理
 * 处理页面切换、动画效果、用户交互等
 */

class UIManager {
  constructor() {
    this.currentView = 'home';
    this.currentScene = null;
    this.dragElements = [];
    this.dropZones = [];
    this.animationQueue = [];

    // 用户选择状态
    this.selectedCharacter = null;
    this.selectedOperation = null;
    this.selectedDifficulty = null;

    // 页面切换管理
    this.viewHistory = ['home']; // 页面历史记录
    this.isTransitioning = false; // 是否正在切换
    this.transitionDuration = 500; // 切换动画时长
  }

  /**
   * 切换视图
   * @param {string} viewName - 视图名称
   * @param {Object} options - 切换选项
   */
  switchView(viewName, options = {}) {
    // 防止重复切换
    if (this.isTransitioning || viewName === this.currentView) {
      return Promise.resolve();
    }

    // 验证视图是否存在
    const newViewElement = document.getElementById(`${viewName}-view`);
    if (!newViewElement) {
      console.error(`视图不存在: ${viewName}`);
      return Promise.reject(new Error(`视图不存在: ${viewName}`));
    }

    return this.performViewTransition(viewName, options);
  }

  /**
   * 执行视图切换
   * @param {string} viewName - 目标视图名称
   * @param {Object} options - 切换选项
   * @returns {Promise} 切换完成的Promise
   */
  performViewTransition(viewName, options = {}) {
    return new Promise((resolve) => {
      this.isTransitioning = true;

      const currentViewElement = document.getElementById(`${this.currentView}-view`);
      const newViewElement = document.getElementById(`${viewName}-view`);

      // 执行切换前的回调
      if (options.beforeTransition) {
        options.beforeTransition(this.currentView, viewName);
      }

      // 执行视图切换前的清理
      this.cleanupCurrentView();

      // 开始切换动画
      this.startTransitionAnimation(currentViewElement, newViewElement, options)
        .then(() => {
          // 更新当前视图
          const previousView = this.currentView;
          this.currentView = viewName;

          // 更新历史记录
          if (!options.replaceHistory) {
            this.viewHistory.push(viewName);
            // 限制历史记录长度
            if (this.viewHistory.length > 10) {
              this.viewHistory = this.viewHistory.slice(-10);
            }
          }

          // 初始化新视图
          this.initializeView(viewName);

          // 执行切换后的回调
          if (options.afterTransition) {
            options.afterTransition(previousView, viewName);
          }

          this.isTransitioning = false;
          console.log(`视图切换完成: ${previousView} → ${viewName}`);
          resolve();
        });
    });
  }

  /**
   * 开始切换动画
   * @param {HTMLElement} currentElement - 当前视图元素
   * @param {HTMLElement} newElement - 新视图元素
   * @param {Object} options - 动画选项
   * @returns {Promise} 动画完成的Promise
   */
  startTransitionAnimation(currentElement, newElement, options = {}) {
    return new Promise((resolve) => {
      const animationType = options.animation || 'fade';
      const duration = options.duration || this.transitionDuration;

      // 设置新视图的初始状态
      newElement.classList.add('active');

      switch (animationType) {
        case 'slide-left':
          this.slideTransition(currentElement, newElement, 'left', duration, resolve);
          break;
        case 'slide-right':
          this.slideTransition(currentElement, newElement, 'right', duration, resolve);
          break;
        case 'slide-up':
          this.slideTransition(currentElement, newElement, 'up', duration, resolve);
          break;
        case 'slide-down':
          this.slideTransition(currentElement, newElement, 'down', duration, resolve);
          break;
        case 'fade':
        default:
          this.fadeTransition(currentElement, newElement, duration, resolve);
          break;
      }
    });
  }

  /**
   * 淡入淡出切换
   * @param {HTMLElement} currentElement - 当前元素
   * @param {HTMLElement} newElement - 新元素
   * @param {number} duration - 动画时长
   * @param {Function} callback - 完成回调
   */
  fadeTransition(currentElement, newElement, duration, callback) {
    if (currentElement) {
      currentElement.style.transition = `opacity ${duration}ms ease-out`;
      currentElement.style.opacity = '0';
    }

    newElement.style.opacity = '0';
    newElement.style.transition = `opacity ${duration}ms ease-in`;

    // 强制重绘
    newElement.offsetHeight;

    newElement.style.opacity = '1';
    newElement.classList.add('view-transition');

    setTimeout(() => {
      if (currentElement) {
        currentElement.classList.remove('active');
        currentElement.style.opacity = '';
        currentElement.style.transition = '';
      }

      newElement.style.opacity = '';
      newElement.style.transition = '';
      newElement.classList.remove('view-transition');

      callback();
    }, duration);
  }

  /**
   * 滑动切换
   * @param {HTMLElement} currentElement - 当前元素
   * @param {HTMLElement} newElement - 新元素
   * @param {string} direction - 滑动方向
   * @param {number} duration - 动画时长
   * @param {Function} callback - 完成回调
   */
  slideTransition(currentElement, newElement, direction, duration, callback) {
    const transforms = {
      left: { current: 'translateX(-100%)', new: 'translateX(100%)' },
      right: { current: 'translateX(100%)', new: 'translateX(-100%)' },
      up: { current: 'translateY(-100%)', new: 'translateY(100%)' },
      down: { current: 'translateY(100%)', new: 'translateY(-100%)' }
    };

    const transform = transforms[direction];

    // 设置初始位置
    newElement.style.transform = transform.new;
    newElement.style.transition = `transform ${duration}ms ease-out`;

    if (currentElement) {
      currentElement.style.transition = `transform ${duration}ms ease-out`;
    }

    // 强制重绘
    newElement.offsetHeight;

    // 开始动画
    newElement.style.transform = 'translateX(0) translateY(0)';
    if (currentElement) {
      currentElement.style.transform = transform.current;
    }

    setTimeout(() => {
      if (currentElement) {
        currentElement.classList.remove('active');
        currentElement.style.transform = '';
        currentElement.style.transition = '';
      }

      newElement.style.transform = '';
      newElement.style.transition = '';

      callback();
    }, duration);
  }

  /**
   * 显示题目
   * @param {Object} question - 题目对象
   */
  displayQuestion(question) {
    if (!question) return;

    // 更新题目文本
    const questionTextElement = document.getElementById('question-text');
    if (questionTextElement) {
      questionTextElement.textContent = question.storyText || question.question;
      questionTextElement.classList.add('view-transition');
      setTimeout(() => {
        questionTextElement.classList.remove('view-transition');
      }, 500);
    }

    // 更新进度显示
    this.updateGameProgress();

    // 渲染基础游戏界面
    this.renderBasicGameInterface(question);

    // 渲染场景（如果场景管理器可用）
    if (window.app && window.app.sceneManager) {
      // 场景管理器会处理场景渲染，这里只需要更新题目文本
      console.log('使用场景管理器渲染');
    } else {
      // 如果没有场景管理器，使用基础界面
      this.renderBasicAnswerInterface(question);
    }

    console.log('显示题目:', question);
  }

  /**
   * 渲染基础游戏界面
   * @param {Object} question - 题目对象
   */
  renderBasicGameInterface(question) {
    // 清空之前的界面元素
    this.clearGameInterface();

    // 根据运算类型设置场景背景色
    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer) {
      const backgroundColors = {
        addition: 'linear-gradient(135deg, #FFE5B4, #FFCC99)',
        subtraction: 'linear-gradient(135deg, #E5F3FF, #B3D9FF)',
        multiplication: 'linear-gradient(135deg, #E5FFE5, #B3FFB3)',
        division: 'linear-gradient(135deg, #FFE5F1, #FFB3D9)'
      };

      sceneContainer.style.background = backgroundColors[question.type] || backgroundColors.addition;

      // 添加运算类型图标
      const operationIcon = this.createOperationIcon(question.type);
      sceneContainer.appendChild(operationIcon);
    }
  }

  /**
   * 创建运算类型图标
   * @param {string} operationType - 运算类型
   * @returns {HTMLElement} 图标元素
   */
  createOperationIcon(operationType) {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'operation-icon';
    iconDiv.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 48px;
      opacity: 0.3;
      pointer-events: none;
    `;

    const icons = {
      addition: '➕',
      subtraction: '➖',
      multiplication: '✖️',
      division: '➗'
    };

    iconDiv.textContent = icons[operationType] || '🔢';
    return iconDiv;
  }

  /**
   * 渲染基础答题界面
   * @param {Object} question - 题目对象
   */
  renderBasicAnswerInterface(question) {
    const dragElementsContainer = document.getElementById('drag-elements');
    const dropZonesContainer = document.getElementById('drop-zones');

    if (!dragElementsContainer || !dropZonesContainer) return;

    // 创建数字输入界面
    this.createNumberInputInterface(question, dragElementsContainer, dropZonesContainer);
  }

  /**
   * 创建数字输入界面
   * @param {Object} question - 题目对象
   * @param {HTMLElement} inputContainer - 输入容器
   * @param {HTMLElement} targetContainer - 目标容器
   */
  createNumberInputInterface(question, inputContainer, targetContainer) {
    // 清空容器
    inputContainer.innerHTML = '';
    targetContainer.innerHTML = '';

    // 创建数字输入区域
    const inputSection = document.createElement('div');
    inputSection.className = 'number-input-section';
    inputSection.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;

    // 创建题目显示
    const questionDisplay = document.createElement('div');
    questionDisplay.className = 'question-math';
    questionDisplay.style.cssText = `
      font-size: 32px;
      font-weight: bold;
      color: var(--text-color);
      margin-bottom: 20px;
    `;
    questionDisplay.textContent = question.question;

    // 创建答案输入框
    const answerInput = document.createElement('input');
    answerInput.type = 'number';
    answerInput.id = 'answer-input';
    answerInput.className = 'answer-input';
    answerInput.placeholder = '请输入答案';
    answerInput.style.cssText = `
      font-size: 24px;
      padding: 12px 20px;
      border: 3px solid var(--primary-color);
      border-radius: 8px;
      text-align: center;
      width: 150px;
      outline: none;
    `;

    // 创建提交按钮
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-success btn-large';
    submitBtn.textContent = '✓ 提交答案';
    submitBtn.onclick = () => this.submitAnswer();

    // 创建数字键盘（可选）
    const numberPad = this.createNumberPad();

    // 组装界面
    inputSection.appendChild(questionDisplay);
    inputSection.appendChild(answerInput);
    inputSection.appendChild(submitBtn);
    inputSection.appendChild(numberPad);

    inputContainer.appendChild(inputSection);

    // 聚焦到输入框
    setTimeout(() => {
      answerInput.focus();
    }, 100);

    // 添加回车键提交
    answerInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.submitAnswer();
      }
    });
  }

  /**
   * 创建数字键盘
   * @returns {HTMLElement} 数字键盘元素
   */
  createNumberPad() {
    const numberPad = document.createElement('div');
    numberPad.className = 'number-pad';
    numberPad.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 20px;
    `;

    // 创建数字按钮 1-9
    for (let i = 1; i <= 9; i++) {
      const btn = this.createNumberButton(i.toString());
      numberPad.appendChild(btn);
    }

    // 创建 0 按钮
    const zeroBtn = this.createNumberButton('0');
    zeroBtn.style.gridColumn = '2';
    numberPad.appendChild(zeroBtn);

    // 创建清除按钮
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-secondary';
    clearBtn.textContent = '清除';
    clearBtn.style.gridColumn = '1';
    clearBtn.onclick = () => {
      const input = document.getElementById('answer-input');
      if (input) input.value = '';
    };
    numberPad.appendChild(clearBtn);

    // 创建退格按钮
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '←';
    backBtn.style.gridColumn = '3';
    backBtn.onclick = () => {
      const input = document.getElementById('answer-input');
      if (input && input.value) {
        input.value = input.value.slice(0, -1);
      }
    };
    numberPad.appendChild(backBtn);

    return numberPad;
  }

  /**
   * 创建数字按钮
   * @param {string} number - 数字
   * @returns {HTMLElement} 按钮元素
   */
  createNumberButton(number) {
    const btn = document.createElement('button');
    btn.className = 'btn number-btn';
    btn.textContent = number;
    btn.style.cssText = `
      font-size: 20px;
      font-weight: bold;
      min-height: 50px;
      background-color: var(--secondary-color);
    `;

    btn.onclick = () => {
      const input = document.getElementById('answer-input');
      if (input) {
        input.value += number;
        input.focus();
      }
    };

    return btn;
  }

  /**
   * 提交答案
   */
  submitAnswer() {
    const input = document.getElementById('answer-input');
    if (!input) return;

    const userAnswer = parseInt(input.value);

    if (isNaN(userAnswer)) {
      this.showMessage('请输入一个有效的数字');
      return;
    }

    // 禁用输入和按钮
    input.disabled = true;
    const submitBtn = input.parentElement.querySelector('.btn-success');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '处理中...';
    }

    // 通知应用提交答案
    if (window.app) {
      window.app.submitAnswer(userAnswer);
    }
  }

  /**
   * 清空游戏界面
   */
  clearGameInterface() {
    const containers = [
      'scene-container',
      'drag-elements',
      'drop-zones'
    ];

    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    });
  }

  /**
   * 更新游戏进度
   */
  updateGameProgress() {
    if (window.app && window.app.gameEngine) {
      const engine = window.app.gameEngine;
      const current = engine.currentQuestionIndex + 1;
      const total = engine.totalQuestions;

      const progressElement = document.getElementById('question-progress');
      if (progressElement) {
        progressElement.textContent = `${current}/${total}`;
      }
    }
  }

  /**
   * 显示反馈
   * @param {Object} result - 验证结果
   */
  showFeedback(result) {
    if (!result) return;

    // 更新分数显示
    if (result.isCorrect && result.points) {
      this.updateScore(result.points);
    }

    // 更新连击显示
    this.updateStreak(result.streak || 0);

    // 更新进度显示（修复进度不更新的问题）
    this.updateGameProgress();

    const feedbackElement = this.createFeedbackElement(result);
    document.body.appendChild(feedbackElement);

    // 显示反馈动画
    if (result.isCorrect) {
      this.playSuccessAnimation();
      if (result.points) {
        this.showScoreIncrease(result.points);
      }
    } else {
      this.playErrorAnimation();
    }

    // 重新启用输入
    setTimeout(() => {
      this.enableAnswerInput();
    }, 1000);

    // 自动移除反馈元素
    setTimeout(() => {
      if (feedbackElement.parentNode) {
        feedbackElement.parentNode.removeChild(feedbackElement);
      }
    }, 3000);

    console.log('显示反馈:', result);
  }

  /**
   * 更新分数显示
   * @param {number} points - 增加的分数
   */
  updateScore(points) {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      const currentScore = parseInt(scoreElement.textContent) || 0;
      const newScore = currentScore + points;
      this.animateNumber(scoreElement, currentScore, newScore, 500);
    }
  }

  /**
   * 更新连击显示
   * @param {number} streak - 当前连击数
   */
  updateStreak(streak) {
    const streakElement = document.getElementById('current-streak');
    if (streakElement) {
      streakElement.textContent = streak.toString();

      // 连击数大于1时添加特效
      if (streak > 1) {
        streakElement.classList.add('celebration');
        setTimeout(() => {
          streakElement.classList.remove('celebration');
        }, 600);
      }
    }
  }

  /**
   * 重新启用答案输入
   */
  enableAnswerInput() {
    const input = document.getElementById('answer-input');
    if (input) {
      input.disabled = false;
      input.value = '';
      input.focus();
    }

    const submitBtn = document.querySelector('.btn-success');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '✓ 提交答案';
    }
  }

  /**
   * 创建反馈元素
   * @param {Object} result - 验证结果
   * @returns {HTMLElement} 反馈元素
   */
  createFeedbackElement(result) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${result.isCorrect ? 'success' : 'error'}`;
    feedbackDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 40px;
      border-radius: 12px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    if (result.isCorrect) {
      feedbackDiv.style.backgroundColor = 'var(--success-color)';
      feedbackDiv.innerHTML = `
        <div>🎉 太棒了！</div>
        <div style="font-size: 18px; margin-top: 10px;">+${result.points} 分</div>
      `;
    } else {
      feedbackDiv.style.backgroundColor = 'var(--error-color)';
      feedbackDiv.innerHTML = `
        <div>😊 再试试看！</div>
        <div style="font-size: 18px; margin-top: 10px;">正确答案是 ${result.correctAnswer}</div>
      `;
    }

    return feedbackDiv;
  }

  /**
   * 播放成功动画
   */
  playSuccessAnimation() {
    const gameView = document.getElementById('game-view');
    if (gameView) {
      gameView.classList.add('success-feedback');
      setTimeout(() => {
        gameView.classList.remove('success-feedback');
      }, 600);
    }
  }

  /**
   * 播放错误动画
   */
  playErrorAnimation() {
    const gameView = document.getElementById('game-view');
    if (gameView) {
      gameView.classList.add('error-feedback');
      setTimeout(() => {
        gameView.classList.remove('error-feedback');
      }, 500);
    }
  }

  /**
   * 显示分数增加动画
   * @param {number} points - 增加的分数
   */
  showScoreIncrease(points) {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      const currentScore = parseInt(scoreElement.textContent) || 0;
      const newScore = currentScore + points;
      
      // 创建分数增加动画
      const increaseElement = document.createElement('div');
      increaseElement.textContent = `+${points}`;
      increaseElement.style.cssText = `
        position: absolute;
        color: var(--success-color);
        font-weight: bold;
        font-size: 18px;
        animation: scoreIncrease 1s ease-out forwards;
        pointer-events: none;
      `;
      
      scoreElement.parentNode.style.position = 'relative';
      scoreElement.parentNode.appendChild(increaseElement);
      
      // 更新分数
      this.animateNumber(scoreElement, currentScore, newScore, 500);
      
      // 移除动画元素
      setTimeout(() => {
        if (increaseElement.parentNode) {
          increaseElement.parentNode.removeChild(increaseElement);
        }
      }, 1000);
    }
  }

  /**
   * 数字动画
   * @param {HTMLElement} element - 目标元素
   * @param {number} start - 起始值
   * @param {number} end - 结束值
   * @param {number} duration - 动画时长
   */
  animateNumber(element, start, end, duration) {
    const startTime = Date.now();
    const difference = end - start;
    
    const updateNumber = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + difference * progress);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    requestAnimationFrame(updateNumber);
  }

  /**
   * 显示游戏结果
   * @param {Object} results - 游戏结果
   */
  showResults(results) {
    console.log('显示游戏结果:', results);

    // 更新最终得分
    const finalScoreElement = document.getElementById('final-score-number');
    if (finalScoreElement) {
      this.animateNumber(finalScoreElement, 0, results.score, 1000);
    }

    // 更新统计信息
    this.updateResultStats(results);

    // 显示获得的奖励
    this.displayAchievements(results.rewards || []);

    // 初始化结果页面按钮
    this.initResultPageButtons();
  }

  /**
   * 更新结果统计信息
   * @param {Object} results - 游戏结果
   */
  updateResultStats(results) {
    // 更新正确率
    const accuracyElement = document.getElementById('accuracy-percentage');
    if (accuracyElement) {
      accuracyElement.textContent = `${results.accuracy}%`;
    }

    // 更新最高连击
    const maxStreakElement = document.getElementById('max-streak');
    if (maxStreakElement) {
      maxStreakElement.textContent = results.maxStreak.toString();
    }

    // 更新用时
    const totalTimeElement = document.getElementById('total-time');
    if (totalTimeElement) {
      const minutes = Math.floor(results.totalTime / 60000);
      const seconds = Math.floor((results.totalTime % 60000) / 1000);
      totalTimeElement.textContent = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
    }
  }

  /**
   * 显示成就奖励
   * @param {Array} achievements - 成就列表
   */
  displayAchievements(achievements) {
    const achievementsContainer = document.getElementById('achievements-list');
    if (!achievementsContainer) return;

    achievementsContainer.innerHTML = '';

    if (achievements.length === 0) {
      achievementsContainer.innerHTML = '<p style="text-align: center; color: #666;">继续努力，争取获得更多成就！</p>';
      return;
    }

    // 播放成就音效
    if (achievements.length > 0 && window.app && window.app.audioManager) {
      window.app.audioManager.playAchievement();
    }

    achievements.forEach((achievement, index) => {
      const achievementElement = document.createElement('div');
      achievementElement.className = 'achievement-badge';
      achievementElement.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <span class="achievement-title">${achievement.title}</span>
      `;

      // 延迟显示动画
      setTimeout(() => {
        achievementElement.classList.add('celebration');
      }, index * 200);

      achievementsContainer.appendChild(achievementElement);
    });
  }

  /**
   * 初始化结果页面按钮
   */
  initResultPageButtons() {
    // 再玩一次按钮
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
      playAgainBtn.onclick = () => {
        if (window.app) {
          // 使用相同设置重新开始游戏
          const uiManager = window.app.uiManager;
          if (uiManager && uiManager.selectedOperation && uiManager.selectedDifficulty) {
            window.app.startGame(uiManager.selectedOperation, uiManager.selectedDifficulty);
          } else {
            // 返回主页重新选择
            window.app.showView('home', { animation: 'slide-right' });
          }
        }
      };
    }

    // 更换设置按钮
    const changeSettingsBtn = document.getElementById('change-settings-btn');
    if (changeSettingsBtn) {
      changeSettingsBtn.onclick = () => {
        if (window.app) {
          window.app.showView('home', { animation: 'slide-right' });
        }
      };
    }

    // 查看进度按钮
    const viewProgressBtn = document.getElementById('view-progress-btn');
    if (viewProgressBtn) {
      viewProgressBtn.onclick = () => {
        this.showProgressReport();
      };
    }
  }

  /**
   * 显示进度报告
   */
  showProgressReport() {
    if (window.app && window.app.gameEngine) {
      const personalBest = window.app.gameEngine.getPersonalBest();
      const trend = window.app.gameEngine.getProgressTrend();
      const recommendations = window.app.gameEngine.getLearningRecommendations();

      let reportContent = '<div class="progress-report">';

      if (personalBest) {
        reportContent += `
          <h3>📊 个人最佳记录</h3>
          <p>最高分数: ${personalBest.bestScore.score}</p>
          <p>最高正确率: ${personalBest.bestAccuracy.accuracy}%</p>
          <p>平均分数: ${personalBest.averageScore}</p>
        `;
      }

      if (trend.hasTrend) {
        reportContent += `
          <h3>📈 学习趋势</h3>
          <p>${trend.message}</p>
        `;
      }

      if (recommendations.length > 0) {
        reportContent += '<h3>💡 学习建议</h3>';
        recommendations.forEach(rec => {
          reportContent += `<p>• ${rec.suggestion}</p>`;
        });
      }

      reportContent += '</div>';

      // 创建模态框显示报告
      this.showModal('学习进度报告', reportContent);
    }
  }

  /**
   * 显示模态框
   * @param {string} title - 标题
   * @param {string} content - 内容
   */
  showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    `;

    modalContent.innerHTML = `
      <h2 style="margin-top: 0;">${title}</h2>
      ${content}
      <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()" style="margin-top: 20px;">关闭</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * 处理窗口大小改变
   */
  handleResize() {
    // 重新调整场景布局
    if (this.currentScene && window.sceneManager) {
      window.sceneManager.adjustLayout();
    }
    
    console.log('处理窗口大小改变');
  }

  /**
   * 更新进度显示
   * @param {Object} progress - 进度信息
   */
  updateProgress(progress) {
    // 更新进度条或其他进度显示元素
    console.log('更新进度:', progress);
  }

  /**
   * 添加按钮点击效果
   * @param {HTMLElement} button - 按钮元素
   */
  addButtonClickEffect(button) {
    button.addEventListener('click', () => {
      // 播放点击音效
      if (window.app && window.app.audioManager) {
        window.app.audioManager.playClick();
      }

      button.classList.add('btn-click');
      setTimeout(() => {
        button.classList.remove('btn-click');
      }, 200);
    });
  }

  /**
   * 初始化UI事件监听器
   */
  initEventListeners() {
    try {
      // 为所有按钮添加点击效果
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        this.addButtonClickEffect(button);
      });

      // 初始化主页面交互
      this.initHomePageInteractions();

      console.log('UI事件监听器初始化完成');
    } catch (error) {
      console.error('UI事件监听器初始化失败:', error);
    }
  }

  /**
   * 初始化主页面交互
   */
  initHomePageInteractions() {
    try {
      // 角色选择交互
      this.initCharacterSelection();

      // 运算类型选择交互
      this.initOperationSelection();

      // 难度选择交互
      this.initDifficultySelection();

      // 开始游戏按钮交互
      this.initStartGameButton();

      // 设置按钮交互
      this.initSettingsButton();
    } catch (error) {
      console.error('主页面交互初始化失败:', error);
    }
  }

  /**
   * 初始化角色选择
   */
  initCharacterSelection() {
    try {
      const characterCards = document.querySelectorAll('.character-card');
      console.log('找到角色卡片数量:', characterCards.length);

      if (characterCards.length === 0) {
        console.warn('未找到角色选择卡片');
        return;
      }

      characterCards.forEach((card, index) => {
        console.log(`绑定角色卡片 ${index + 1}:`, card.dataset.character);
        card.addEventListener('click', () => {
          console.log('角色卡片被点击:', card.dataset.character);

          // 移除其他卡片的选中状态
          characterCards.forEach(c => c.classList.remove('selected'));

          // 添加当前卡片的选中状态
          card.classList.add('selected');
          card.classList.add('selected-animation');

          // 移除动画类
          setTimeout(() => {
            card.classList.remove('selected-animation');
          }, 500);

          // 保存选择的角色
          const character = card.dataset.character;
          this.selectedCharacter = character;

          // 检查是否可以开始游戏
          this.checkStartGameAvailability();

          console.log('选择角色:', character);
        });
      });

      // 默认选择第一个角色
      if (characterCards.length > 0) {
        characterCards[0].click();
      }
    } catch (error) {
      console.error('角色选择初始化失败:', error);
    }
  }

  /**
   * 初始化运算类型选择
   */
  initOperationSelection() {
    try {
      const operationBtns = document.querySelectorAll('.operation-btn');
      console.log('找到运算类型按钮数量:', operationBtns.length);

      if (operationBtns.length === 0) {
        console.warn('未找到运算类型按钮');
        return;
      }

      operationBtns.forEach((btn, index) => {
        console.log(`绑定运算按钮 ${index + 1}:`, btn.dataset.operation);
        btn.addEventListener('click', () => {
          console.log('运算按钮被点击:', btn.dataset.operation);

          // 移除其他按钮的选中状态
          operationBtns.forEach(b => b.classList.remove('selected'));

          // 添加当前按钮的选中状态
          btn.classList.add('selected');

          // 保存选择的运算类型
          const operation = btn.dataset.operation;
          this.selectedOperation = operation;

          // 检查是否可以开始游戏
          this.checkStartGameAvailability();

          console.log('选择运算类型:', operation);
        });
      });
    } catch (error) {
      console.error('运算类型选择初始化失败:', error);
    }
  }

  /**
   * 初始化难度选择
   */
  initDifficultySelection() {
    try {
      const difficultyBtns = document.querySelectorAll('.difficulty-btn');
      console.log('找到难度按钮数量:', difficultyBtns.length);

      if (difficultyBtns.length === 0) {
        console.warn('未找到难度选择按钮');
        return;
      }

      difficultyBtns.forEach((btn, index) => {
        console.log(`绑定难度按钮 ${index + 1}:`, btn.dataset.difficulty);
        btn.addEventListener('click', () => {
          console.log('难度按钮被点击:', btn.dataset.difficulty);

          // 移除其他按钮的选中状态
          difficultyBtns.forEach(b => b.classList.remove('selected'));

          // 添加当前按钮的选中状态
          btn.classList.add('selected');

          // 保存选择的难度
          const difficulty = parseInt(btn.dataset.difficulty);
          this.selectedDifficulty = difficulty;

          // 检查是否可以开始游戏
          this.checkStartGameAvailability();

          console.log('选择难度:', difficulty);
        });
      });

      // 默认选择第一个难度
      if (difficultyBtns.length > 0) {
        console.log('默认选择第一个难度');
        difficultyBtns[0].click();
      }
    } catch (error) {
      console.error('难度选择初始化失败:', error);
    }
  }

  /**
   * 初始化开始游戏按钮
   */
  initStartGameButton() {
    try {
      const startBtn = document.getElementById('start-game-btn');
      console.log('开始游戏按钮:', startBtn ? '找到' : '未找到');

      if (startBtn) {
        startBtn.addEventListener('click', () => {
          console.log('开始游戏按钮被点击');
          console.log('当前选择状态:', {
            operation: this.selectedOperation,
            difficulty: this.selectedDifficulty,
            canStart: this.canStartGame()
          });

          if (this.canStartGame()) {
            console.log('开始游戏...');
            this.startGame();
          } else {
            console.log('无法开始游戏，显示提示信息');
            this.showMessage('请先选择运算类型和难度级别');
          }
        });
        console.log('开始游戏按钮事件监听器已绑定');
      } else {
        console.error('未找到开始游戏按钮元素');
      }
    } catch (error) {
      console.error('开始游戏按钮初始化失败:', error);
    }
  }

  /**
   * 初始化设置按钮
   */
  initSettingsButton() {
    // 如果有设置按钮，添加点击事件
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.switchView('settings');
      });
    }
  }

  /**
   * 检查是否可以开始游戏
   */
  checkStartGameAvailability() {
    try {
      const startBtn = document.getElementById('start-game-btn');

      if (startBtn) {
        if (this.canStartGame()) {
          startBtn.disabled = false;
          startBtn.classList.remove('disabled');
          startBtn.textContent = '🚀 开始游戏';
        } else {
          startBtn.disabled = true;
          startBtn.classList.add('disabled');
          startBtn.textContent = '请选择运算类型和难度';
        }
      } else {
        console.warn('未找到开始游戏按钮');
      }
    } catch (error) {
      console.error('检查开始游戏可用性失败:', error);
    }
  }

  /**
   * 检查是否可以开始游戏
   * @returns {boolean} 是否可以开始
   */
  canStartGame() {
    return this.selectedOperation && this.selectedDifficulty;
  }

  /**
   * 开始游戏
   */
  startGame() {
    if (!this.canStartGame()) {
      return;
    }

    // 显示加载动画
    this.showLoading('正在准备游戏...');

    // 延迟启动游戏，让用户看到加载效果
    setTimeout(() => {
      // 通知应用开始游戏
      if (window.app) {
        window.app.startGame(this.selectedOperation, this.selectedDifficulty);
      }

      this.hideLoading();
    }, 1000);
  }

  /**
   * 显示消息提示
   * @param {string} message - 消息内容
   */
  showMessage(message) {
    // 创建消息提示元素
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-toast';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(messageDiv);

    // 3秒后自动移除
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
          messageDiv.parentNode.removeChild(messageDiv);
        }, 300);
      }
    }, 3000);
  }

  /**
   * 显示加载动画
   * @param {string} message - 加载消息
   */
  showLoading(message = '加载中...') {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      const loadingText = loadingElement.querySelector('p');
      if (loadingText) {
        loadingText.textContent = message;
      }
      loadingElement.style.display = 'flex';
    }
  }

  /**
   * 隐藏加载动画
   */
  hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  /**
   * 清理当前视图
   */
  cleanupCurrentView() {
    switch (this.currentView) {
      case 'game':
        // 清理游戏相关的定时器、事件监听器等
        this.cleanupGameView();
        break;
      case 'result':
        // 清理结果页面的动画等
        this.cleanupResultView();
        break;
      default:
        // 通用清理
        break;
    }
  }

  /**
   * 清理游戏视图
   */
  cleanupGameView() {
    // 清理拖拽元素
    this.dragElements = [];
    this.dropZones = [];

    // 清理场景
    this.currentScene = null;

    // 停止所有动画
    this.animationQueue = [];
  }

  /**
   * 清理结果视图
   */
  cleanupResultView() {
    // 清理结果页面的动画和定时器
    const resultView = document.getElementById('result-view');
    if (resultView) {
      const animations = resultView.querySelectorAll('.celebration, .success-feedback');
      animations.forEach(element => {
        element.classList.remove('celebration', 'success-feedback');
      });
    }
  }

  /**
   * 初始化视图
   * @param {string} viewName - 视图名称
   */
  initializeView(viewName) {
    switch (viewName) {
      case 'home':
        this.initializeHomeView();
        break;
      case 'game':
        this.initializeGameView();
        break;
      case 'result':
        this.initializeResultView();
        break;
      case 'settings':
        this.initializeSettingsView();
        break;
      default:
        console.log(`初始化视图: ${viewName}`);
        break;
    }
  }

  /**
   * 初始化主页视图
   */
  initializeHomeView() {
    // 重置选择状态（如果需要）
    // this.resetSelections();

    // 检查开始游戏按钮状态
    this.checkStartGameAvailability();

    console.log('主页视图初始化完成');
  }

  /**
   * 初始化游戏视图
   */
  initializeGameView() {
    // 重置游戏相关的UI状态
    this.resetGameUI();

    // 初始化游戏控制按钮
    this.initGameControls();

    console.log('游戏视图初始化完成');
  }

  /**
   * 初始化结果视图
   */
  initializeResultView() {
    // 播放结果展示动画
    this.playResultAnimations();

    console.log('结果视图初始化完成');
  }

  /**
   * 初始化设置视图
   */
  initializeSettingsView() {
    // 加载当前设置
    this.loadCurrentSettings();

    console.log('设置视图初始化完成');
  }

  /**
   * 重置游戏UI
   */
  resetGameUI() {
    // 重置分数显示
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = '0';
    }

    // 重置进度显示
    const progressElement = document.getElementById('question-progress');
    if (progressElement) {
      progressElement.textContent = '1/10';
    }

    // 重置连击显示
    const streakElement = document.getElementById('current-streak');
    if (streakElement) {
      streakElement.textContent = '0';
    }

    // 清空题目显示
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
      questionElement.textContent = '准备开始...';
    }
  }

  /**
   * 初始化游戏控制按钮
   */
  initGameControls() {
    // 提示按钮
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.onclick = () => this.showHint();
      // 添加点击效果
      this.addButtonClickEffect(hintBtn);
    }

    // 重新开始按钮
    const resetBtn = document.getElementById('reset-question-btn');
    if (resetBtn) {
      resetBtn.onclick = () => this.resetCurrentQuestion();
    }

    // 返回主页按钮
    const backBtn = document.getElementById('back-home-btn');
    if (backBtn) {
      backBtn.onclick = () => this.goBack();
    }
  }

  /**
   * 显示提示
   */
  showHint() {
    try {
      console.log('🎯 提示按钮被点击');

      // 检查SceneManager是否存在
      if (!window.app || !window.app.sceneManager) {
        console.error('SceneManager不存在');
        this.showMessage('场景管理器未初始化');
        return;
      }

      const sceneManager = window.app.sceneManager;
      const currentScene = sceneManager.currentScene;

      console.log('当前场景信息:', currentScene);

      // 检查当前场景是否存在
      if (!currentScene) {
        console.error('当前场景不存在');
        this.showMessage('当前没有活动场景');
        return;
      }

      console.log('场景类型:', currentScene.type);

      // 检查是否是减法场景
      if (currentScene.type !== 'sharing') {
        console.log('不是减法场景，当前场景类型:', currentScene.type);
        this.showMessage('提示功能仅在减法场景中可用');
        return;
      }

      // 获取减法场景实例
      const sharingScene = sceneManager.scenes.sharing;
      console.log('减法场景实例:', sharingScene);

      if (!sharingScene) {
        console.error('减法场景实例不存在');
        this.showMessage('减法场景未正确初始化');
        return;
      }

      // 检查showHint方法是否存在
      if (typeof sharingScene.showHint !== 'function') {
        console.error('showHint方法不存在');
        this.showMessage('提示功能未正确实现');
        return;
      }

      console.log('✅ 开始调用减法场景的showHint方法');

      // 调用减法场景的提示功能
      sharingScene.showHint();

    } catch (error) {
      console.error('显示提示功能出错:', error);
      this.showMessage('提示功能出现错误，请重试');
    }
  }

  /**
   * 设置提示按钮状态
   * @param {boolean} enabled - 是否启用
   * @param {string} text - 按钮文本
   */
  setHintButtonState(enabled, text = '💡 提示') {
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.disabled = !enabled;
      hintBtn.textContent = text;

      if (enabled) {
        hintBtn.classList.remove('disabled');
      } else {
        hintBtn.classList.add('disabled');
      }
    }
  }

  /**
   * 重置当前题目
   */
  resetCurrentQuestion() {
    // 重置当前题目的状态
    this.cleanupGameView();

    // 生成新的题目（而不是重新显示当前题目）
    if (window.app && window.app.gameEngine) {
      // 获取当前游戏设置
      const operationType = window.app.gameEngine.operationType;
      const difficulty = window.app.gameEngine.difficulty;

      // 生成新的题目
      const newQuestion = window.app.gameEngine.createQuestion(operationType, difficulty);

      if (newQuestion) {
        // 重新加载场景
        if (window.app.sceneManager) {
          window.app.sceneManager.loadScene(newQuestion.type, newQuestion);
        } else {
          this.displayQuestion(newQuestion);
        }
      }
    }
  }

  /**
   * 返回上一页
   */
  goBack() {
    if (this.viewHistory.length > 1) {
      // 移除当前页面
      this.viewHistory.pop();
      // 获取上一页
      const previousView = this.viewHistory[this.viewHistory.length - 1];
      this.switchView(previousView, { replaceHistory: true });
    } else {
      // 默认返回主页
      this.switchView('home');
    }
  }

  /**
   * 播放结果动画
   */
  playResultAnimations() {
    // 延迟播放动画，让页面切换完成
    setTimeout(() => {
      const finalScore = document.getElementById('final-score-number');
      if (finalScore) {
        finalScore.classList.add('celebration');
      }
    }, 200);
  }

  /**
   * 加载当前设置
   */
  loadCurrentSettings() {
    if (window.app && window.app.dataManager) {
      const settings = window.app.dataManager.getSettings();

      // 更新设置界面的控件状态
      const soundToggle = document.getElementById('sound-toggle');
      if (soundToggle) {
        soundToggle.checked = settings.soundEnabled;
      }

      const sessionLength = document.getElementById('session-length');
      if (sessionLength) {
        sessionLength.value = settings.sessionLength;
      }

      const difficultyMode = document.getElementById('difficulty-mode');
      if (difficultyMode) {
        difficultyMode.value = settings.difficulty;
      }
    }
  }

  /**
   * 显示系统信息
   */
  showSystemInfo() {
    if (!window.app) return;

    let systemInfo = '<div class="system-info">';
    systemInfo += '<h3>🔧 系统状态</h3>';

    // 管理器状态
    const managers = [
      { name: '游戏引擎', instance: window.app.gameEngine, status: '✅' },
      { name: 'UI管理器', instance: window.app.uiManager, status: '✅' },
      { name: '场景管理器', instance: window.app.sceneManager, status: '✅' },
      { name: '拖拽管理器', instance: window.app.dragDropManager, status: '✅' },
      { name: '音效管理器', instance: window.app.audioManager, status: '✅' },
      { name: '数据管理器', instance: window.app.dataManager, status: '✅' }
    ];

    systemInfo += '<h4>📦 核心模块</h4>';
    managers.forEach(manager => {
      const status = manager.instance ? '✅ 已加载' : '❌ 未加载';
      systemInfo += `<p>${manager.name}: ${status}</p>`;
    });

    // 音效系统状态
    if (window.app.audioManager) {
      const audioStatus = window.app.audioManager.getStatus();
      systemInfo += '<h4>🔊 音效系统</h4>';
      systemInfo += `<p>状态: ${audioStatus.isEnabled ? '启用' : '禁用'}</p>`;
      systemInfo += `<p>音量: ${Math.round(audioStatus.volume * 100)}%</p>`;
      systemInfo += `<p>已加载音效: ${audioStatus.loadedSounds.length}个</p>`;
    }

    // 数据存储状态
    if (window.app.dataManager) {
      const userData = window.app.dataManager.getUserData();
      systemInfo += '<h4>💾 数据存储</h4>';
      systemInfo += `<p>用户名: ${userData.profile.name}</p>`;
      systemInfo += `<p>总分: ${userData.profile.totalScore}</p>`;
      systemInfo += `<p>游戏次数: ${userData.statistics.totalGamesPlayed}</p>`;
    }

    // 浏览器信息
    systemInfo += '<h4>🌐 浏览器信息</h4>';
    systemInfo += `<p>用户代理: ${navigator.userAgent.substring(0, 50)}...</p>`;
    systemInfo += `<p>屏幕分辨率: ${screen.width}x${screen.height}</p>`;
    systemInfo += `<p>窗口大小: ${window.innerWidth}x${window.innerHeight}</p>`;

    // 功能特性
    systemInfo += '<h4>🎮 功能特性</h4>';
    systemInfo += '<p>✅ 四种数学运算（加减乘除）</p>';
    systemInfo += '<p>✅ 主题场景系统</p>';
    systemInfo += '<p>✅ 拖拽交互</p>';
    systemInfo += '<p>✅ 音效反馈</p>';
    systemInfo += '<p>✅ 进度保存</p>';
    systemInfo += '<p>✅ 成就系统</p>';
    systemInfo += '<p>✅ 响应式设计</p>';

    systemInfo += '</div>';

    // 显示模态框
    this.showModal('系统信息', systemInfo);
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIManager;
}
