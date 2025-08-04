/**
 * 减法场景类 - 分享场景
 * 实现减法运算的可视化学习场景
 */

class SharingScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);

    // 提示功能状态管理
    this.isHintInProgress = false;
    this.currentQuestion = null;
    this.currentItemType = null;
  }

  /**
   * 渲染分享场景（减法）
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async render(container, question) {
    const totalCount = question.num1;
    const removeCount = question.num2;
    const remainingCount = question.answer;

    // 保存当前题目和物品类型信息（用于提示功能）
    this.currentQuestion = question;

    // 为容器添加减法场景类名
    container.classList.add('sharing-scene');

    // 创建标题区域（在数字拖拽区上方）
    this.createTitleHeader(container);

    // 随机选择物品类型
    const itemType = this.itemsConfig.getRandomSubtractionItem();
    this.currentItemType = itemType; // 保存物品类型信息
    console.log('减法场景选择的物品类型:', itemType);
    
    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    console.log('减法场景选择的学习伙伴:', character);

    // 创建数字拖拽区（顶部）
    this.createNumberDragArea(container);

    // 计算动态布局
    const layout = this.calculateDynamicLayout(totalCount, removeCount);
    console.log('减法场景动态布局:', layout);

    // 随机选择一个动作
    const randomAction = itemType.actions[Math.floor(Math.random() * itemType.actions.length)];

    // 创建左边篮子（原始物品）
    this.sceneManager.createAdaptiveBasket(container, 'left', totalCount, itemType.item, itemType);

    // 创建右边篮子（被移除的物品），传递随机选择的动作
    this.sceneManager.createSubtractionEatBasket(container, 'right', removeCount, itemType.item, itemType, character, randomAction);

    // 创建题目文字（使用动态位置）
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      position: absolute;
      top: ${layout.questionTop}px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255,255,255,0.95);
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      text-align: center;
      box-shadow: 0 3px 12px rgba(0,0,0,0.2);
      border: 2px solid #FF9800;
      z-index: 5;
      max-width: 500px;
      line-height: 1.4;
    `;

    questionText.innerHTML = `${character.name}有${totalCount}个${itemType.item.name}，${randomAction}${removeCount}个，还剩多少个${itemType.item.name}？`;
    container.appendChild(questionText);

    // 创建答案拖拽区（使用动态位置）
    this.createAnswerDropArea(container, remainingCount, layout.answerTop);

    // 设置容器的最小高度
    container.style.minHeight = `${layout.minContainerHeight}px`;

    console.log(`分享场景渲染完成: ${totalCount} - ${removeCount} = ${remainingCount}`);
  }

  /**
   * 创建标题区域
   * @param {HTMLElement} container - 容器
   */
  createTitleHeader(container) {
    const titleHeader = document.createElement('header');
    titleHeader.className = 'game-header title-header';
    titleHeader.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      z-index: 10;
      background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,248,220,0.9));
      border-radius: 20px;
      padding: 15px 30px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border: 3px solid transparent;
      background-clip: padding-box;
      backdrop-filter: blur(10px);
    `;

    const title = document.createElement('h1');
    title.textContent = '🎮 趣味数学小天地';
    title.style.cssText = `
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: bold;
      color: #2C3E50;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = '在游戏中快乐学习数学！';
    subtitle.style.cssText = `
      margin: 0;
      font-size: 16px;
      color: #7F8C8D;
      font-weight: 500;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;

    titleHeader.appendChild(title);
    titleHeader.appendChild(subtitle);
    container.appendChild(titleHeader);
  }

  /**
   * 显示提示功能 - 自动演示减法过程
   */
  async showHint() {
    try {
      // 检查是否正在进行提示
      if (this.isHintInProgress) {
        console.log('提示功能正在进行中，请稍候...');
        return;
      }

      // 检查必要的数据
      if (!this.currentQuestion || !this.currentItemType) {
        console.error('缺少必要的题目或物品类型信息');
        if (window.uiManager) {
          window.uiManager.showMessage('提示功能暂时不可用，请重新开始题目');
        }
        return;
      }

      console.log('🎯 开始提示演示:', this.currentQuestion);

      // 设置提示状态
      this.setHintState(true);

      // 获取当前题目信息
      const totalCount = this.currentQuestion.num1;
      const removeCount = this.currentQuestion.num2;
      const remainingCount = this.currentQuestion.answer;

      console.log(`提示演示: ${totalCount} - ${removeCount} = ${remainingCount}`);

      // 开始动画序列
      await this.startHintAnimation();

      // 显示提示文案
      await this.showHintMessage();

      console.log('✅ 提示演示完成');

    } catch (error) {
      console.error('提示功能执行出错:', error);

      // 确保状态恢复
      this.setHintState(false);

      if (window.uiManager) {
        window.uiManager.showMessage('提示功能出现问题，请重试');
      }
    }
  }

  /**
   * 设置提示状态
   * @param {boolean} inProgress - 是否正在进行提示
   */
  setHintState(inProgress) {
    this.isHintInProgress = inProgress;

    // 更新UI按钮状态
    if (window.uiManager) {
      if (inProgress) {
        window.uiManager.setHintButtonState(false, '⏳ 演示中...');
        // 禁用其他按钮
        const resetBtn = document.getElementById('reset-question-btn');
        const backBtn = document.getElementById('back-home-btn');
        if (resetBtn) resetBtn.disabled = true;
        if (backBtn) backBtn.disabled = true;
      } else {
        window.uiManager.setHintButtonState(true, '💡 提示');
        // 恢复其他按钮
        const resetBtn = document.getElementById('reset-question-btn');
        const backBtn = document.getElementById('back-home-btn');
        if (resetBtn) resetBtn.disabled = false;
        if (backBtn) backBtn.disabled = false;
      }
    }
  }

  /**
   * 开始提示动画序列 - 同步移除左右容器的元素
   */
  async startHintAnimation() {
    try {
      console.log('🎬 开始动画序列...');

      // 获取左右容器（修正选择器）
      const leftContainer = document.querySelector('.sharing-scene .basket-left');
      const rightContainer = document.querySelector('.sharing-scene .basket-right');

      console.log('🔍 查找容器:', {
        leftContainer: leftContainer ? '✅ 找到' : '❌ 未找到',
        rightContainer: rightContainer ? '✅ 找到' : '❌ 未找到'
      });

      if (!leftContainer || !rightContainer) {
        console.error('找不到左右容器，无法执行动画');
        console.log('🔍 当前场景中的所有元素:', document.querySelector('.sharing-scene')?.innerHTML);
        return;
      }

      // 获取左右容器中的物品元素（跳过标签，只获取物品容器中的物品）
      const leftItemsContainer = leftContainer.children[1]; // 第二个子元素是物品容器
      const rightItemsContainer = rightContainer.children[1]; // 第二个子元素是物品容器

      console.log('🔍 物品容器:', {
        leftItemsContainer: leftItemsContainer ? '✅ 找到' : '❌ 未找到',
        rightItemsContainer: rightItemsContainer ? '✅ 找到' : '❌ 未找到'
      });

      if (!leftItemsContainer || !rightItemsContainer) {
        console.error('找不到物品容器，无法执行动画');
        return;
      }

      const leftItems = Array.from(leftItemsContainer.children);
      const rightItems = Array.from(rightItemsContainer.children);

      console.log(`🎬 动画序列: 左边${leftItems.length}个物品, 右边${rightItems.length}个物品`);

      // 计算需要移除的次数（右边容器的当前物品数量）
      const removeCount = rightItems.length;

      if (removeCount === 0) {
        console.log('🎬 右边容器已为空，无需动画');
        return;
      }

      console.log(`🎬 将执行智能批量波浪动画，移除${removeCount}个元素`);

      // 智能选择动画策略
      const animationConfig = this.getAnimationConfig(removeCount);
      console.log(`🎬 动画配置:`, animationConfig);

      // 执行智能批量波浪动画
      await this.executeBatchWaveAnimation(
        leftItems,
        rightItems,
        leftItemsContainer,
        animationConfig
      );

      console.log('🎬 智能批量波浪动画序列完成');

    } catch (error) {
      console.error('动画序列执行出错:', error);
    }
  }

  /**
   * 获取动画配置 - 根据元素数量智能选择
   * @param {number} elementCount - 元素数量
   * @returns {Object} 动画配置
   */
  getAnimationConfig(elementCount) {
    if (elementCount <= 3) {
      // 少量元素：保持精致的逐个动画
      return {
        strategy: 'sequential',
        animationDuration: 800,
        interval: 200,
        description: '精致逐个动画'
      };
    } else if (elementCount <= 6) {
      // 中等元素：分组批量执行
      return {
        strategy: 'grouped',
        animationDuration: 700,
        interval: 200,
        groupSize: 2,
        description: '分组批量动画'
      };
    } else {
      // 大量元素：波浪式批量动画
      return {
        strategy: 'wave',
        animationDuration: 600,
        waveDelay: 150,
        description: '波浪批量动画'
      };
    }
  }

  /**
   * 执行智能批量波浪动画
   * @param {Array} leftItems - 左边元素数组
   * @param {Array} rightItems - 右边元素数组
   * @param {HTMLElement} targetContainer - 目标容器
   * @param {Object} config - 动画配置
   */
  async executeBatchWaveAnimation(leftItems, rightItems, targetContainer, config) {
    const removeCount = rightItems.length;

    if (config.strategy === 'sequential') {
      // 传统逐个动画
      await this.executeSequentialAnimation(leftItems, rightItems, targetContainer, config);
    } else if (config.strategy === 'grouped') {
      // 分组批量动画
      await this.executeGroupedAnimation(leftItems, rightItems, targetContainer, config);
    } else if (config.strategy === 'wave') {
      // 波浪批量动画
      await this.executeWaveAnimation(leftItems, rightItems, targetContainer, config);
    }
  }

  /**
   * 执行波浪批量动画 - 所有元素同时启动，设置不同延迟
   * @param {Array} leftItems - 左边元素数组
   * @param {Array} rightItems - 右边元素数组
   * @param {HTMLElement} targetContainer - 目标容器
   * @param {Object} config - 动画配置
   */
  async executeWaveAnimation(leftItems, rightItems, targetContainer, config) {
    const removeCount = rightItems.length;
    const animationPromises = [];

    console.log(`🌊 执行波浪动画: ${removeCount}个元素，延迟${config.waveDelay}ms，动画${config.animationDuration}ms`);

    // 批量启动所有动画，设置不同延迟
    for (let i = 0; i < removeCount; i++) {
      const leftItem = leftItems[leftItems.length - 1 - i]; // 从后往前
      const rightItem = rightItems[rightItems.length - 1 - i]; // 从后往前

      if (leftItem && rightItem) {
        const delay = i * config.waveDelay; // 波浪延迟
        animationPromises.push(
          this.createDelayedAnimation(
            leftItem,
            rightItem,
            delay,
            config.animationDuration
          )
        );
      }
    }

    // 等待所有动画完成
    await Promise.all(animationPromises);
    console.log(`🌊 波浪动画完成，总耗时约: ${(removeCount - 1) * config.waveDelay + config.animationDuration}ms`);
  }

  /**
   * 执行分组批量动画
   * @param {Array} leftItems - 左边元素数组
   * @param {Array} rightItems - 右边元素数组
   * @param {HTMLElement} targetContainer - 目标容器
   * @param {Object} config - 动画配置
   */
  async executeGroupedAnimation(leftItems, rightItems, targetContainer, config) {
    const removeCount = rightItems.length;
    const groupSize = config.groupSize || 2;
    const groups = Math.ceil(removeCount / groupSize);

    console.log(`👥 执行分组动画: ${removeCount}个元素分${groups}组，每组${groupSize}个`);

    for (let groupIndex = 0; groupIndex < groups; groupIndex++) {
      const groupPromises = [];
      const startIndex = groupIndex * groupSize;
      const endIndex = Math.min(startIndex + groupSize, removeCount);

      console.log(`👥 执行第${groupIndex + 1}/${groups}组动画`);

      // 同组内的元素同时执行
      for (let i = startIndex; i < endIndex; i++) {
        const leftItem = leftItems[leftItems.length - 1 - i];
        const rightItem = rightItems[rightItems.length - 1 - i];

        if (leftItem && rightItem) {
          groupPromises.push(
            this.createDelayedAnimation(
              leftItem,
              rightItem,
              0, // 组内无延迟
              config.animationDuration
            )
          );
        }
      }

      // 等待当前组完成
      await Promise.all(groupPromises);

      // 组间间隔
      if (groupIndex < groups - 1) {
        await new Promise(resolve => setTimeout(resolve, config.interval));
      }
    }

    console.log(`👥 分组动画完成`);
  }

  /**
   * 执行传统逐个动画
   * @param {Array} leftItems - 左边元素数组
   * @param {Array} rightItems - 右边元素数组
   * @param {HTMLElement} targetContainer - 目标容器
   * @param {Object} config - 动画配置
   */
  async executeSequentialAnimation(leftItems, rightItems, targetContainer, config) {
    const removeCount = rightItems.length;

    console.log(`🔄 执行传统逐个动画: ${removeCount}个元素`);

    for (let i = 0; i < removeCount; i++) {
      const leftItem = leftItems[leftItems.length - 1 - i];
      const rightItem = rightItems[rightItems.length - 1 - i];

      if (leftItem && rightItem) {
        await this.createDelayedAnimation(
          leftItem,
          rightItem,
          0, // 无延迟，逐个执行
          config.animationDuration
        );

        // 元素间间隔
        if (i < removeCount - 1) {
          await new Promise(resolve => setTimeout(resolve, config.interval));
        }
      }
    }

    console.log(`🔄 传统逐个动画完成`);
  }

  /**
   * 显示提示文案并恢复状态
   */
  async showHintMessage() {
    try {
      console.log('💬 显示提示文案...');

      // 获取提示文案
      const hintText = this.itemsConfig.getHintTemplate(this.currentItemType);
      console.log('提示文案:', hintText);

      // 创建提示文案显示元素
      const hintMessageElement = this.createHintMessageElement(hintText);

      // 显示提示文案
      await this.displayHintMessage(hintMessageElement);

      console.log('💬 提示文案显示完成');

    } catch (error) {
      console.error('显示提示文案出错:', error);
    } finally {
      // 确保状态恢复
      this.setHintState(false);
    }
  }

  /**
   * 创建提示文案显示元素
   * @param {string} hintText - 提示文案
   * @returns {HTMLElement} 提示文案元素
   */
  createHintMessageElement(hintText) {
    const hintElement = document.createElement('div');
    hintElement.className = 'hint-message';
    hintElement.textContent = hintText;

    // 设置样式
    hintElement.style.cssText = `
      position: absolute;
      top: 480px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      text-align: center;
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
      z-index: 20;
      max-width: 400px;
      line-height: 1.4;
      border: 3px solid rgba(255, 255, 255, 0.3);
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
      transition: all 0.5s ease-out;
    `;

    return hintElement;
  }

  /**
   * 显示提示文案动画
   * @param {HTMLElement} hintElement - 提示文案元素
   * @returns {Promise} 显示完成的Promise
   */
  displayHintMessage(hintElement) {
    return new Promise((resolve) => {
      try {
        // 获取场景容器
        const sceneContainer = document.querySelector('.sharing-scene');
        if (!sceneContainer) {
          console.error('找不到场景容器');
          resolve();
          return;
        }

        // 添加到场景容器
        sceneContainer.appendChild(hintElement);

        // 触发进入动画
        requestAnimationFrame(() => {
          hintElement.style.opacity = '1';
          hintElement.style.transform = 'translateX(-50%) translateY(0)';
        });

        console.log('💬 提示文案已显示，3秒后自动消失');

        // 3秒后开始退出动画
        setTimeout(() => {
          hintElement.style.opacity = '0';
          hintElement.style.transform = 'translateX(-50%) translateY(-20px)';

          // 退出动画完成后移除元素
          setTimeout(() => {
            try {
              if (hintElement && hintElement.parentNode) {
                hintElement.parentNode.removeChild(hintElement);
              }
              console.log('💬 提示文案已移除');
              resolve();
            } catch (cleanupError) {
              console.error('提示文案清理出错:', cleanupError);
              resolve();
            }
          }, 500); // 退出动画时长

        }, 3000); // 显示3秒

      } catch (error) {
        console.error('显示提示文案出错:', error);
        resolve();
      }
    });
  }

  /**
   * 清理提示动画相关资源
   */
  cleanupHintAnimation() {
    try {
      // 移除所有提示相关的元素
      const hintMessages = document.querySelectorAll('.hint-message');
      hintMessages.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      // 移除所有飞行元素
      const flyingElements = document.querySelectorAll('.flying-element');
      flyingElements.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      // 恢复所有隐藏的元素
      const hiddenElements = document.querySelectorAll('.sharing-scene .fade-out');
      hiddenElements.forEach(element => {
        element.style.visibility = 'visible';
        element.classList.remove('fade-out');
      });

      console.log('🧹 提示动画资源清理完成');

    } catch (error) {
      console.error('清理提示动画资源出错:', error);
    }
  }

  /**
   * 创建飞行动画
   * @param {HTMLElement} fromElement - 起始元素
   * @param {HTMLElement} toContainer - 目标容器
   * @param {number} animationDuration - 动画时长（毫秒）
   * @returns {Promise} 动画完成的Promise
   */
  createFlyingAnimation(fromElement, toContainer, animationDuration = 800) {
    return new Promise((resolve) => {
      try {
        // 获取起点和终点的位置
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toContainer.getBoundingClientRect();

        // 创建飞行元素
        const flyingElement = fromElement.cloneNode(true);
        flyingElement.className = 'flying-element';

        // 设置飞行元素的初始位置
        flyingElement.style.cssText = `
          position: fixed;
          left: ${fromRect.left}px;
          top: ${fromRect.top}px;
          width: ${fromRect.width}px;
          height: ${fromRect.height}px;
          z-index: 1000;
          pointer-events: none;
          font-size: ${getComputedStyle(fromElement).fontSize};
        `;

        // 添加到页面
        document.body.appendChild(flyingElement);

        console.log(`🚀 飞行动画: 从(${fromRect.left}, ${fromRect.top}) 到 (${toRect.left}, ${toRect.top})`);

        // 启动右上方抛物线消失动画
        requestAnimationFrame(() => {
          flyingElement.classList.add('animate');

          // 使用CSS动画实现抛物线消失效果
          flyingElement.style.animation = `flyToTarget ${animationDuration}ms ease-out forwards`;
        });

        // 动画完成后清理
        setTimeout(() => {
          try {
            if (flyingElement && flyingElement.parentNode) {
              flyingElement.parentNode.removeChild(flyingElement);
            }
            resolve();
          } catch (cleanupError) {
            console.error('飞行动画清理出错:', cleanupError);
            resolve(); // 即使清理出错也要resolve，避免阻塞后续流程
          }
        }, animationDuration); // 使用传入的动画时长

      } catch (error) {
        console.error('创建飞行动画出错:', error);
        resolve(); // 出错时也要resolve，避免阻塞后续流程
      }
    });
  }

  /**
   * 创建淡出动画
   * @param {HTMLElement} element - 要淡出的元素
   * @param {number} animationDuration - 动画时长（毫秒）
   * @returns {Promise} 动画完成的Promise
   */
  createFadeOutAnimation(element, animationDuration = 500) {
    return new Promise((resolve) => {
      try {
        element.classList.add('fade-out');

        setTimeout(() => {
          try {
            // 隐藏元素而不是删除（保持DOM结构）
            element.style.visibility = 'hidden';
            element.classList.remove('fade-out');
            resolve();
          } catch (cleanupError) {
            console.error('淡出动画清理出错:', cleanupError);
            resolve();
          }
        }, animationDuration);

      } catch (error) {
        console.error('创建淡出动画出错:', error);
        resolve();
      }
    });
  }

  /**
   * 创建延迟动画 - 用于批量波浪效果
   * @param {HTMLElement} leftElement - 左边要淡出的元素
   * @param {HTMLElement} rightElement - 右边要抛物线消失的元素
   * @param {number} delay - 延迟时间（毫秒）
   * @param {number} animationDuration - 动画时长（毫秒）
   * @returns {Promise} 动画完成的Promise
   */
  createDelayedAnimation(leftElement, rightElement, delay = 0, animationDuration = 400) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // 同步执行左右两边的动画
          await Promise.all([
            this.createFadeOutAnimation(leftElement, animationDuration),
            this.createParabolicDisappearAnimation(rightElement, animationDuration)
          ]);

          // 实际移除右边的元素
          if (rightElement && rightElement.parentNode) {
            rightElement.parentNode.removeChild(rightElement);
          }

          resolve();
        } catch (error) {
          console.error('延迟动画执行出错:', error);
          resolve();
        }
      }, delay);
    });
  }

  /**
   * 创建抛物线消失动画 - 右上方抛物线轨迹
   * @param {HTMLElement} element - 要执行抛物线消失的元素
   * @param {number} animationDuration - 动画时长（毫秒）
   * @returns {Promise} 动画完成的Promise
   */
  createParabolicDisappearAnimation(element, animationDuration = 400) {
    return new Promise((resolve) => {
      try {
        // 获取元素位置
        const rect = element.getBoundingClientRect();

        // 创建飞行元素
        const flyingElement = element.cloneNode(true);
        flyingElement.className = 'flying-element';

        // 设置飞行元素的初始位置
        flyingElement.style.cssText = `
          position: fixed;
          left: ${rect.left}px;
          top: ${rect.top}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          z-index: 1000;
          pointer-events: none;
          font-size: ${getComputedStyle(element).fontSize};
        `;

        // 添加到页面
        document.body.appendChild(flyingElement);

        console.log(`🚀 抛物线消失动画: 从(${rect.left}, ${rect.top}) 向右上方消失`);

        // 启动抛物线消失动画
        requestAnimationFrame(() => {
          flyingElement.style.animation = `flyToTarget ${animationDuration}ms ease-out forwards`;
        });

        // 动画完成后清理
        setTimeout(() => {
          try {
            if (flyingElement && flyingElement.parentNode) {
              flyingElement.parentNode.removeChild(flyingElement);
            }
            resolve();
          } catch (cleanupError) {
            console.error('抛物线动画清理出错:', cleanupError);
            resolve();
          }
        }, animationDuration);

      } catch (error) {
        console.error('创建抛物线消失动画出错:', error);
        resolve();
      }
    });
  }

  /**
   * 计算减法场景的动态布局
   * @param {number} totalCount - 总物品数量
   * @param {number} removeCount - 移除物品数量
   * @returns {Object} 布局信息
   */
  calculateDynamicLayout(totalCount, removeCount) {
    // 基础位置
    const numberDragTop = 80;
    const basketsStartTop = 180;

    // 计算篮子区域高度
    // 篮子高度基于物品数量动态计算，参考createAdaptiveBasket的逻辑
    const maxItemsCount = Math.max(totalCount, removeCount);
    const minBasketHeight = 120;
    const maxBasketHeight = 200;
    const baseHeight = 140;
    const heightIncrement = Math.min(15, maxItemsCount * 4);
    const basketHeight = Math.min(maxBasketHeight, baseHeight + heightIncrement);

    // 篮子区域总高度（包括标签和间距）
    const basketLabelHeight = 25; // 篮子标签高度
    const basketsAreaHeight = basketLabelHeight + basketHeight;
    const basketsAreaBottom = basketsStartTop + basketsAreaHeight;

    // 计算各区域位置
    const minGap = 30; // 最小间距
    const questionAreaHeight = 60; // 题目区域高度
    const answerAreaHeight = 80; // 答案区域高度
    const bottomMargin = 10; // 底部边距

    // 题目区域紧跟篮子区域
    const questionTop = basketsAreaBottom + minGap;

    // 答案区域紧跟题目区域
    const answerTop = questionTop + questionAreaHeight + minGap;

    // 容器总高度
    const minContainerHeight = answerTop + answerAreaHeight + bottomMargin;

    console.log(`减法场景动态布局计算: 总${totalCount}个, 移除${removeCount}个, 篮子高度${basketHeight}px, 篮子区域高度${basketsAreaHeight}px, 题目位置${questionTop}px, 答案位置${answerTop}px, 建议容器高度${minContainerHeight}px`);

    return {
      numberDragTop,
      basketsStartTop,
      basketsAreaHeight,
      basketsAreaBottom,
      questionTop,
      answerTop,
      minContainerHeight,
      basketHeight
    };
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SharingScene;
}
