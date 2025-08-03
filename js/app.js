/**
 * 趣味数学小天地 - 应用主控制器
 * 负责应用的初始化和整体流程控制
 */

class App {
  constructor() {
    this.gameEngine = null;
    this.uiManager = null;
    this.sceneManager = null;
    this.dragDropManager = null;
    this.dataManager = null;
    this.audioManager = null;
    
    this.currentView = 'home';
    this.isInitialized = false;
  }

  /**
   * 初始化应用
   */
  async init() {
    try {
      console.log('正在初始化趣味数学小天地...');

      // 初始化各个管理器
      this.gameEngine = new GameEngine();
      this.uiManager = new UIManager();
      this.sceneManager = new SceneManager();
      this.dragDropManager = new DragDropManager();
      this.audioManager = new AudioManager();
      this.dataManager = new DataManager();

      // 初始化UI事件监听器
      if (this.uiManager) {
        this.uiManager.initEventListeners();
      }

      // 初始化音效管理器
      if (this.audioManager) {
        await this.audioManager.init();
      }

      // 显示主页面
      this.showView('home');

      // 加载用户数据
      this.loadUserData();

      this.isInitialized = true;
      console.log('应用初始化完成！');

      // 执行启动检查
      this.performStartupCheck();

    } catch (error) {
      console.error('应用初始化失败:', error);
      this.showErrorMessage('应用初始化失败，请刷新页面重试');
    }
  }

  /**
   * 执行启动检查
   */
  performStartupCheck() {
    console.log('=== 启动检查 ===');

    // 检查各个管理器
    const managers = [
      { name: 'GameEngine', instance: this.gameEngine },
      { name: 'UIManager', instance: this.uiManager },
      { name: 'SceneManager', instance: this.sceneManager },
      { name: 'DragDropManager', instance: this.dragDropManager },
      { name: 'AudioManager', instance: this.audioManager },
      { name: 'DataManager', instance: this.dataManager }
    ];

    managers.forEach(manager => {
      if (manager.instance) {
        console.log(`✅ ${manager.name} 已加载`);
      } else {
        console.error(`❌ ${manager.name} 加载失败`);
      }
    });

    // 检查音效系统
    if (this.audioManager) {
      const audioStatus = this.audioManager.getStatus();
      console.log('🔊 音效系统状态:', audioStatus);
    }

    // 检查数据存储
    if (this.dataManager) {
      const userData = this.dataManager.userData;
      console.log('💾 用户数据状态:', userData ? '已加载' : '未加载');
    }

    console.log('=== 启动检查完成 ===');
  }

  /**
   * 加载用户数据
   */
  loadUserData() {
    if (this.dataManager) {
      const userData = this.dataManager.loadUserData();
      console.log('用户数据加载完成:', userData.profile);

      // 可以在这里显示欢迎信息或恢复用户设置
      this.applyUserSettings(userData.settings);
    }
  }

  /**
   * 应用用户设置
   * @param {Object} settings - 用户设置
   */
  applyUserSettings(settings) {
    if (settings) {
      // 应用音效设置
      if (this.audioManager) {
        this.audioManager.setEnabled(settings.soundEnabled);
        if (settings.volume !== undefined) {
          this.audioManager.setVolume(settings.volume);
        }
      }

      // 应用其他设置
      console.log('应用用户设置:', settings);
    }
  }

  /**
   * 显示错误消息
   * @param {string} message - 错误消息
   */
  showErrorMessage(message) {
    if (this.uiManager) {
      this.uiManager.showMessage(message);
    } else {
      alert(message);
    }
  }

  /**
   * 处理全局错误
   * @param {Error} error - 错误对象
   */
  handleGlobalError(error) {
    // 记录错误到数据管理器
    if (this.dataManager) {
      this.dataManager.recordError({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }

    // 根据错误类型显示不同的用户友好信息
    let userMessage = '发生了一个错误，请刷新页面重试。';

    if (error.message && error.message.includes('audio')) {
      userMessage = '音效系统出现问题，但不影响游戏功能。';
    } else if (error.message && error.message.includes('storage')) {
      userMessage = '数据保存出现问题，您的进度可能无法保存。';
    } else if (error.message && error.message.includes('network')) {
      userMessage = '网络连接出现问题，请检查网络设置。';
    }

    // 显示错误信息（但不要过于频繁）
    if (!this.lastErrorTime || Date.now() - this.lastErrorTime > 5000) {
      this.showErrorMessage(userMessage);
      this.lastErrorTime = Date.now();
    }
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }

    // 窗口大小改变时重新调整布局
    window.addEventListener('resize', () => {
      if (this.uiManager) {
        this.uiManager.handleResize();
      }
      if (this.sceneManager) {
        this.sceneManager.adjustLayout();
      }
    });

    // 全局错误处理
    window.addEventListener('error', (event) => {
      console.error('全局错误:', event.error);
      this.handleGlobalError(event.error);
    });

    // 未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise拒绝:', event.reason);
      this.handleGlobalError(event.reason);
      event.preventDefault(); // 防止错误在控制台中显示
    });

    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardInput(event);
    });
  }

  /**
   * 处理键盘输入
   * @param {KeyboardEvent} event - 键盘事件
   */
  handleKeyboardInput(event) {
    // 在游戏页面时，数字键可以用于答题
    if (this.currentView === 'game') {
      if (event.key >= '0' && event.key <= '9') {
        // 处理数字输入
        this.handleNumberInput(event.key);
      } else if (event.key === 'Enter') {
        // 回车键提交答案
        this.handleAnswerSubmit();
      } else if (event.key === 'Escape') {
        // ESC键返回主页
        this.showView('home');
      }
    }

    // 全局快捷键
    if (event.key === 'F12' || (event.ctrlKey && event.key === 'i')) {
      // F12或Ctrl+I显示系统信息
      event.preventDefault();
      if (this.uiManager) {
        this.uiManager.showSystemInfo();
      }
    }
  }

  /**
   * 处理数字输入
   * @param {string} digit - 输入的数字
   */
  handleNumberInput(digit) {
    // 这里可以实现数字输入逻辑
    // 暂时只是记录，具体实现在场景管理器中
    console.log('数字输入:', digit);
  }

  /**
   * 处理答案提交
   */
  handleAnswerSubmit() {
    // 这里可以实现答案提交逻辑
    console.log('提交答案');
  }

  /**
   * 显示指定视图
   * @param {string} viewName - 视图名称
   * @param {Object} options - 切换选项
   */
  showView(viewName, options = {}) {
    if (this.uiManager) {
      return this.uiManager.switchView(viewName, {
        ...options,
        beforeTransition: (from, to) => {
          console.log(`页面切换: ${from} → ${to}`);
          if (options.beforeTransition) {
            options.beforeTransition(from, to);
          }
        },
        afterTransition: (from, to) => {
          this.currentView = to;
          this.onViewChanged(from, to);
          if (options.afterTransition) {
            options.afterTransition(from, to);
          }
        }
      });
    }
    return Promise.resolve();
  }

  /**
   * 视图切换完成后的处理
   * @param {string} fromView - 来源视图
   * @param {string} toView - 目标视图
   */
  onViewChanged(fromView, toView) {
    // 更新页面标题
    this.updatePageTitle(toView);

    // 根据视图执行特定逻辑
    switch (toView) {
      case 'home':
        this.onHomeViewActivated();
        break;
      case 'game':
        this.onGameViewActivated();
        break;
      case 'result':
        this.onResultViewActivated();
        break;
      case 'settings':
        this.onSettingsViewActivated();
        break;
    }
  }

  /**
   * 更新页面标题
   * @param {string} viewName - 视图名称
   */
  updatePageTitle(viewName) {
    const titles = {
      home: '趣味数学小天地',
      game: '趣味数学小天地 - 游戏中',
      result: '趣味数学小天地 - 游戏结果',
      settings: '趣味数学小天地 - 设置'
    };

    document.title = titles[viewName] || '趣味数学小天地';
  }

  /**
   * 主页视图激活
   */
  onHomeViewActivated() {
    // 重置游戏状态
    if (this.gameEngine) {
      this.gameEngine.reset();
    }
  }

  /**
   * 游戏视图激活
   */
  onGameViewActivated() {
    // 游戏视图激活时的逻辑
    console.log('游戏视图已激活');
  }

  /**
   * 结果视图激活
   */
  onResultViewActivated() {
    // 结果视图激活时的逻辑
    console.log('结果视图已激活');
  }

  /**
   * 设置视图激活
   */
  onSettingsViewActivated() {
    // 设置视图激活时的逻辑
    console.log('设置视图已激活');
  }

  /**
   * 开始游戏
   * @param {string} operationType - 运算类型
   * @param {number} difficulty - 难度级别
   */
  startGame(operationType, difficulty) {
    if (!this.isInitialized) {
      console.error('应用尚未初始化完成');
      return;
    }

    try {
      // 初始化游戏引擎
      this.gameEngine.init(operationType, difficulty);

      // 切换到游戏视图，使用滑动动画
      this.showView('game', {
        animation: 'slide-left',
        afterTransition: () => {
          // 游戏视图切换完成后开始第一题
          this.nextQuestion();
        }
      });

    } catch (error) {
      console.error('游戏启动失败:', error);
      if (this.uiManager) {
        this.uiManager.showMessage('游戏启动失败，请重试');
      }
    }
  }

  /**
   * 下一题
   */
  nextQuestion() {
    if (this.gameEngine) {
      const question = this.gameEngine.generateQuestion();
      if (question) {
        // 加载场景
        if (this.sceneManager) {
          this.sceneManager.loadScene(question.type, question)
            .then(() => {
              console.log('场景加载完成');
            })
            .catch(error => {
              console.error('场景加载失败，使用基础界面:', error);
              // 场景加载失败时使用基础界面
              if (this.uiManager) {
                this.uiManager.displayQuestion(question);
              }
            });
        } else {
          // 没有场景管理器时使用基础界面
          if (this.uiManager) {
            this.uiManager.displayQuestion(question);
          }
        }
      }
    }
  }

  /**
   * 提交答案
   * @param {*} answer - 用户答案
   */
  submitAnswer(answer) {
    if (this.gameEngine) {
      const result = this.gameEngine.validateAnswer(answer);

      // 播放音效
      if (this.audioManager) {
        if (result.isCorrect) {
          this.audioManager.playSuccess();
          if (result.streak > 1) {
            setTimeout(() => {
              this.audioManager.playStreak();
            }, 300);
          }
        } else {
          this.audioManager.playError();
        }
      }

      if (this.uiManager) {
        this.uiManager.showFeedback(result);
      }

      // 如果还有题目，继续下一题
      if (this.gameEngine.hasMoreQuestions()) {
        setTimeout(() => this.nextQuestion(), 2000);
      } else {
        // 游戏结束，显示结果
        setTimeout(() => this.showResults(), 2000);
      }
    }
  }

  /**
   * 显示游戏结果
   */
  showResults() {
    if (this.gameEngine && this.uiManager) {
      const results = this.gameEngine.getResults();

      // 记录分数到历史
      this.gameEngine.recordScore(results);

      // 保存到数据管理器
      if (this.dataManager) {
        this.dataManager.updateProgress(results.operationType, results);
      }

      // 切换到结果视图，使用向上滑动动画
      this.showView('result', {
        animation: 'slide-up',
        afterTransition: () => {
          // 显示结果
          this.uiManager.showResults(results);
        }
      });
    }
  }

  /**
   * 重新开始游戏
   */
  restartGame() {
    if (this.gameEngine) {
      this.gameEngine.reset();
      this.showView('home');
    }
  }
}

// 全局应用实例变量
let app = null;

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
