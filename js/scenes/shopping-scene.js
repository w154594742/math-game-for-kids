/**
 * 加法场景类 - 购物场景
 * 实现加法运算的可视化学习场景
 */

class ShoppingScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);

    // 提示功能状态管理
    this.isHintInProgress = false;
    this.currentQuestion = null;
    this.currentItemGroup = null;
    this.currentCharacter = null;
  }

  /**
   * 渲染购物场景（加法）
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async render(container, question) {
    const leftCount = question.num1;
    const rightCount = question.num2;
    const totalCount = question.answer;

    // 保存当前题目和物品信息（用于提示功能）
    this.currentQuestion = question;

    // 为容器添加购物场景类名
    container.classList.add('shopping-scene');

    // 创建标题区域（在数字拖拽区上方）
    this.createTitleHeader(container);

    // 随机选择物品组合（使用SceneManager中的方法）
    const itemGroup = this.sceneManager.getRandomAdditionItem();
    this.currentItemGroup = itemGroup; // 保存物品组合信息
    console.log('加法场景选择的物品组合:', itemGroup);
    console.log('items数组:', itemGroup.items);
    console.log('items[0]:', itemGroup.items[0]);
    console.log('items[1]:', itemGroup.items[1]);
    console.log('items数组长度:', itemGroup.items ? itemGroup.items.length : 'items不存在');

    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    this.currentCharacter = character; // 保存学习伙伴信息
    console.log('加法场景选择的学习伙伴:', character);

    // 创建数字拖拽区（顶部）
    this.createNumberDragArea(container);

    // 计算动态布局
    const layout = this.calculateDynamicLayout(leftCount, rightCount);
    console.log('加法场景动态布局:', layout);

    // 创建左边篮子（第一种物品）
    this.sceneManager.createAdaptiveBasket(container, 'left', leftCount, itemGroup.items[0], itemGroup);

    // 创建右边篮子（第二种物品）
    this.sceneManager.createAdaptiveBasket(container, 'right', rightCount, itemGroup.items[1], itemGroup);

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
      border: 2px solid #4CAF50;
      z-index: 5;
      max-width: 500px;
      line-height: 1.4;
    `;
    questionText.innerHTML = `${character.name}收集了${leftCount}个${itemGroup.items[0].name}和${rightCount}个${itemGroup.items[1].name}，总共收集了多少个${itemGroup.theme}？`;
    container.appendChild(questionText);

    // 创建答案拖拽区（使用动态位置）
    this.createAnswerDropArea(container, totalCount, layout.answerTop);

    // 设置容器的最小高度
    container.style.minHeight = `${layout.minContainerHeight}px`;

    // 重置动态布局状态（用于新题目）
    this.resetDynamicLayoutState(container);

    // 添加交互效果
    this.addInteractiveEffects(container);

    console.log(`购物场景渲染完成: ${leftCount} + ${rightCount} = ${totalCount}`);
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
   * 添加交互效果
   * @param {HTMLElement} container - 容器
   */
  addInteractiveEffects(container) {
    // 为所有可点击元素添加波纹效果
    const clickableElements = container.querySelectorAll('.number-box, .adaptive-basket, .answer-drop-area');

    clickableElements.forEach(element => {
      element.addEventListener('click', (e) => {
        this.createRippleEffect(e, element);
      });

      // 添加悬停效果
      element.addEventListener('mouseenter', () => {
        element.style.transform = (element.style.transform || '') + ' scale(1.05)';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = element.style.transform.replace(' scale(1.05)', '');
      });
    });

    // 为篮子内的物品添加特殊效果
    const items = container.querySelectorAll('.basket-items .item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.2) rotate(10deg)';
        item.style.filter = 'brightness(1.3) drop-shadow(0 4px 15px rgba(255, 215, 0, 0.8))';
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        item.style.filter = '';
      });
    });
  }

  /**
   * 创建波纹效果
   * @param {Event} e - 点击事件
   * @param {HTMLElement} element - 目标元素
   */
  createRippleEffect(e, element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.style.position = 'relative';
    element.appendChild(ripple);

    // 移除波纹效果
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * 创建成功烟花效果
   * @param {HTMLElement} container - 容器
   */
  createFireworkEffect(container) {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = 'firework-effect';

        const x = Math.random() * container.offsetWidth;
        const y = Math.random() * container.offsetHeight;

        firework.style.left = x + 'px';
        firework.style.top = y + 'px';

        container.appendChild(firework);

        setTimeout(() => {
          if (firework.parentNode) {
            firework.parentNode.removeChild(firework);
          }
        }, 1000);
      }, i * 100);
    }
  }

  /**
   * 计算加法场景的动态布局
   * @param {number} leftCount - 左边篮子物品数量
   * @param {number} rightCount - 右边篮子物品数量
   * @returns {Object} 布局信息
   */
  calculateDynamicLayout(leftCount, rightCount) {
    // 基础位置
    const numberDragTop = 80;
    const basketsStartTop = 180;

    // 计算篮子区域高度
    // 篮子高度基于物品数量动态计算，参考createAdaptiveBasket的逻辑
    const maxItemsCount = Math.max(leftCount, rightCount);
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

    console.log(`加法场景动态布局计算: 左${leftCount}个, 右${rightCount}个, 篮子高度${basketHeight}px, 篮子区域高度${basketsAreaHeight}px, 题目位置${questionTop}px, 答案位置${answerTop}px, 建议容器高度${minContainerHeight}px`);

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

  /**
   * 重置动态布局状态（用于新题目）
   * @param {HTMLElement} container - 场景容器
   */
  resetDynamicLayoutState(container) {
    try {
      // 清除之前的收集区域（如果存在）
      const existingCollectionArea = container.querySelector('.collection-area');
      if (existingCollectionArea) {
        existingCollectionArea.remove();
        console.log('🔄 清除之前的收集区域');
      }

      // 重置容器的transition，确保新题目时立即应用新高度
      container.style.transition = 'none';

      // 强制重新计算布局
      requestAnimationFrame(() => {
        container.style.transition = 'min-height 0.3s ease-out';
      });

      console.log('🔄 动态布局状态已重置');

    } catch (error) {
      console.error('重置动态布局状态出错:', error);
    }
  }

  /**
   * 显示提示功能 - 自动演示加法合并过程
   */
  async showHint() {
    try {
      // 检查是否正在进行提示
      if (this.isHintInProgress) {
        console.log('提示功能正在进行中，请稍候...');
        return;
      }

      // 检查必要的数据
      if (!this.currentQuestion || !this.currentItemGroup || !this.currentCharacter) {
        console.error('缺少必要的题目或物品类型信息');
        if (window.uiManager) {
          window.uiManager.showMessage('提示功能暂时不可用，请重新开始题目');
        }
        return;
      }

      console.log('🎯 开始加法提示演示:', this.currentQuestion);

      // 设置提示状态
      this.setHintState(true);

      // 获取当前题目信息
      const leftCount = this.currentQuestion.num1;
      const rightCount = this.currentQuestion.num2;
      const totalCount = this.currentQuestion.answer;

      console.log(`提示演示: ${leftCount} + ${rightCount} = ${totalCount}`);

      // 开始合并收集动画序列
      await this.startCollectionAnimation();

      // 显示提示文案
      await this.showHintMessage();

      console.log('✅ 加法提示演示完成');

    } catch (error) {
      console.error('加法提示功能执行出错:', error);

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
   * 开始合并收集动画序列
   */
  async startCollectionAnimation() {
    try {
      console.log('🎬 开始合并收集动画序列...');

      // 获取左右篮子
      const leftBasket = document.querySelector('.shopping-scene .basket-left');
      const rightBasket = document.querySelector('.shopping-scene .basket-right');

      if (!leftBasket || !rightBasket) {
        console.error('找不到左右篮子，无法执行动画');
        return;
      }

      // 创建中央收集区域
      const collectionArea = this.createCollectionArea();

      // 获取左右篮子中的物品元素
      const leftItemsContainer = leftBasket.children[1]; // 第二个子元素是物品容器
      const rightItemsContainer = rightBasket.children[1]; // 第二个子元素是物品容器

      if (!leftItemsContainer || !rightItemsContainer) {
        console.error('找不到物品容器，无法执行动画');
        return;
      }

      const leftItems = Array.from(leftItemsContainer.children);
      const rightItems = Array.from(rightItemsContainer.children);

      console.log(`🎬 收集动画: 左边${leftItems.length}个物品, 右边${rightItems.length}个物品`);

      // 阶段1：收集左边篮子的物品
      await this.collectItemsFromBasket(leftItems, leftBasket, collectionArea, '左边');

      // 阶段2：收集右边篮子的物品
      await this.collectItemsFromBasket(rightItems, rightBasket, collectionArea, '右边');

      // 阶段3：隐藏左右篮子
      await this.hideBasketsWithAnimation(leftBasket, rightBasket);

      console.log('🎬 合并收集动画序列完成');

    } catch (error) {
      console.error('收集动画序列执行出错:', error);
    }
  }

  /**
   * 创建中央收集区域
   * @returns {HTMLElement} 收集区域元素
   */
  createCollectionArea() {
    // 计算收集区域的位置（与篮子区域同一水平线）
    const layout = this.calculateDynamicLayout(this.currentQuestion.num1, this.currentQuestion.num2);
    const collectionTop = layout.basketsStartTop; // 与篮子区域同一水平线

    const collectionArea = document.createElement('div');
    collectionArea.className = 'collection-area';
    collectionArea.style.cssText = `
      position: absolute;
      top: ${collectionTop}px;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      min-height: 120px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      border: 4px solid #FF8C00;
      border-radius: 20px;
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      grid-auto-rows: 30px;
      justify-items: center;
      align-items: center;
      gap: 6px;
      padding: 15px;
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
      z-index: 15;
      opacity: 0;
      transform: translateX(-50%) scale(0.8);
      transition: all 0.5s ease-out;
      overflow: visible;
    `;

    // 添加数据属性用于动态布局计算
    collectionArea.setAttribute('data-initial-top', collectionTop);
    collectionArea.setAttribute('data-item-count', '0');

    // 添加收集区域标签
    const label = document.createElement('div');
    label.className = 'collection-label';
    label.style.cssText = `
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      background: #FF8C00;
      color: white;
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 14px;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
    `;
    label.textContent = '收集区域';
    collectionArea.appendChild(label);

    // 添加到场景容器
    const sceneContainer = document.querySelector('.shopping-scene');
    if (sceneContainer) {
      sceneContainer.appendChild(collectionArea);

      // 触发进入动画
      requestAnimationFrame(() => {
        collectionArea.style.opacity = '1';
        collectionArea.style.transform = 'translateX(-50%) scale(1)';
      });
    }

    return collectionArea;
  }

  /**
   * 获取收集动画配置 - 根据元素数量智能选择策略
   * @param {number} elementCount - 元素数量
   * @returns {Object} 动画配置
   */
  getCollectionAnimationConfig(elementCount) {
    if (elementCount <= 3) {
      // 少量元素：保持精致的逐个动画
      return {
        strategy: 'sequential',
        animationDuration: 800,
        interval: 150,
        description: '精致逐个收集'
      };
    } else if (elementCount <= 6) {
      // 中等元素：分组批量执行
      return {
        strategy: 'grouped',
        animationDuration: 700,
        interval: 120,
        groupSize: 2,
        description: '分组批量收集'
      };
    } else {
      // 大量元素：波浪式批量动画
      return {
        strategy: 'wave',
        animationDuration: 600,
        waveDelay: 120,
        description: '波浪批量收集'
      };
    }
  }

  /**
   * 从篮子收集物品到中央区域
   * @param {Array} items - 物品元素数组
   * @param {HTMLElement} basket - 篮子元素
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {string} side - 篮子位置（左边/右边）
   */
  async collectItemsFromBasket(items, basket, collectionArea, side) {
    try {
      console.log(`🎬 开始收集${side}篮子的物品...`);

      // 获取智能动画配置
      const config = this.getCollectionAnimationConfig(items.length);
      console.log(`🎬 ${side}篮子使用策略: ${config.description} (${items.length}个物品)`);

      // 高亮篮子
      this.highlightBasket(basket, true);

      // 根据策略执行不同的收集动画
      switch (config.strategy) {
        case 'sequential':
          await this.executeSequentialCollection(items, collectionArea, config);
          break;
        case 'grouped':
          await this.executeGroupedCollection(items, collectionArea, config);
          break;
        case 'wave':
          await this.executeWaveCollection(items, collectionArea, config);
          break;
        default:
          console.error('未知的动画策略:', config.strategy);
          // 降级到逐个动画
          await this.executeSequentialCollection(items, collectionArea, config);
      }

      // 取消高亮
      this.highlightBasket(basket, false);

      console.log(`🎬 ${side}篮子物品收集完成`);

    } catch (error) {
      console.error(`收集${side}篮子物品出错:`, error);
    }
  }

  /**
   * 执行逐个收集动画（少量元素）
   * @param {Array} items - 物品元素数组
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {Object} config - 动画配置
   */
  async executeSequentialCollection(items, collectionArea, config) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`🎬 逐个收集第${i + 1}/${items.length}个物品`);

      await this.createCollectionAnimation(item, collectionArea, config.animationDuration);

      // 收集间隔
      if (i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, config.interval));
      }
    }
  }

  /**
   * 执行分组收集动画（中等元素）
   * @param {Array} items - 物品元素数组
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {Object} config - 动画配置
   */
  async executeGroupedCollection(items, collectionArea, config) {
    const groupSize = config.groupSize;
    const groups = [];

    // 将物品分组
    for (let i = 0; i < items.length; i += groupSize) {
      groups.push(items.slice(i, i + groupSize));
    }

    console.log(`🎬 分组收集: ${groups.length}组，每组${groupSize}个`);

    // 逐组执行，组内并行
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const group = groups[groupIndex];
      const groupPromises = [];

      // 组内并行启动动画
      for (let itemIndex = 0; itemIndex < group.length; itemIndex++) {
        const item = group[itemIndex];
        const delay = itemIndex * 100; // 组内小延迟
        groupPromises.push(
          this.createDelayedCollectionAnimation(item, collectionArea, delay, config.animationDuration)
        );
      }

      // 等待当前组完成
      await Promise.all(groupPromises);
      console.log(`🎬 第${groupIndex + 1}/${groups.length}组收集完成`);

      // 组间间隔
      if (groupIndex < groups.length - 1) {
        await new Promise(resolve => setTimeout(resolve, config.interval));
      }
    }
  }

  /**
   * 执行波浪收集动画（大量元素）
   * @param {Array} items - 物品元素数组
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {Object} config - 动画配置
   */
  async executeWaveCollection(items, collectionArea, config) {
    console.log(`🌊 波浪收集: ${items.length}个物品，延迟${config.waveDelay}ms`);

    const animationPromises = [];

    // 批量启动所有动画，设置不同延迟
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const delay = i * config.waveDelay; // 波浪延迟
      animationPromises.push(
        this.createDelayedCollectionAnimation(item, collectionArea, delay, config.animationDuration)
      );
    }

    // 等待所有动画完成
    await Promise.all(animationPromises);
    const totalTime = (items.length - 1) * config.waveDelay + config.animationDuration;
    console.log(`🌊 波浪收集完成，总耗时约: ${totalTime}ms`);
  }

  /**
   * 高亮篮子
   * @param {HTMLElement} basket - 篮子元素
   * @param {boolean} highlight - 是否高亮
   */
  highlightBasket(basket, highlight) {
    if (highlight) {
      basket.style.borderColor = '#FFD700';
      basket.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
      basket.style.borderWidth = '4px';
    } else {
      basket.style.borderColor = '#4CAF50';
      basket.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      basket.style.borderWidth = '3px';
    }
  }

  /**
   * 创建延迟收集动画
   * @param {HTMLElement} item - 要收集的物品元素
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {number} delay - 延迟时间（毫秒）
   * @param {number} animationDuration - 动画时长（毫秒）
   * @returns {Promise} 动画完成的Promise
   */
  createDelayedCollectionAnimation(item, collectionArea, delay, animationDuration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.createCollectionAnimation(item, collectionArea, animationDuration)
          .then(resolve)
          .catch(resolve);
      }, delay);
    });
  }

  /**
   * 创建收集动画 - 从篮子到收集区域的弧形飞行
   * @param {HTMLElement} item - 要收集的物品元素
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {number} animationDuration - 动画时长（毫秒），默认800ms
   * @returns {Promise} 动画完成的Promise
   */
  createCollectionAnimation(item, collectionArea, animationDuration = 800) {
    return new Promise((resolve) => {
      try {
        // 获取起点和终点位置
        const itemRect = item.getBoundingClientRect();
        const collectionRect = collectionArea.getBoundingClientRect();

        // 创建飞行元素
        const flyingItem = item.cloneNode(true);
        flyingItem.className = 'flying-collection-item';

        // 设置飞行元素的初始位置
        flyingItem.style.cssText = `
          position: fixed;
          left: ${itemRect.left}px;
          top: ${itemRect.top}px;
          width: ${itemRect.width}px;
          height: ${itemRect.height}px;
          z-index: 1000;
          pointer-events: none;
          font-size: ${getComputedStyle(item).fontSize};
          transition: none;
        `;

        // 添加到页面
        document.body.appendChild(flyingItem);

        // 计算目标位置（收集区域中心）
        const targetX = collectionRect.left + collectionRect.width / 2 - itemRect.width / 2;
        const targetY = collectionRect.top + collectionRect.height / 2 - itemRect.height / 2;

        // 计算移动距离
        const deltaX = targetX - itemRect.left;
        const deltaY = targetY - itemRect.top;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        console.log(`🚀 收集动画: 从(${itemRect.left}, ${itemRect.top}) 到 (${targetX}, ${targetY}), 距离: ${distance.toFixed(2)}px`);

        // 确保有足够的移动距离才执行动画
        if (distance < 10) {
          console.warn('🚀 移动距离太小，跳过动画');
          this.completeCollectionAnimation(item, collectionArea, flyingItem);
          resolve();
          return;
        }

        // 启动收集动画（使用传入的动画时长）
        requestAnimationFrame(() => {
          flyingItem.style.transition = `all ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
          flyingItem.style.left = `${targetX}px`;
          flyingItem.style.top = `${targetY}px`;
          flyingItem.style.transform = 'scale(1.3) rotate(15deg)';
          flyingItem.style.opacity = '0.8';
          flyingItem.style.filter = 'brightness(1.2) drop-shadow(0 4px 8px rgba(255,215,0,0.6))';
        });

        // 动画完成后处理
        setTimeout(() => {
          this.completeCollectionAnimation(item, collectionArea, flyingItem);
          resolve();
        }, animationDuration); // 使用传入的动画时长

      } catch (error) {
        console.error('创建收集动画出错:', error);
        resolve();
      }
    });
  }

  /**
   * 完成收集动画的后续处理
   * @param {HTMLElement} originalItem - 原始物品元素
   * @param {HTMLElement} collectionArea - 收集区域
   * @param {HTMLElement} flyingItem - 飞行元素
   */
  completeCollectionAnimation(originalItem, collectionArea, flyingItem) {
    try {
      // 隐藏原始物品
      originalItem.style.visibility = 'hidden';

      // 在收集区域中添加物品
      const collectedItem = originalItem.cloneNode(true);
      collectedItem.className = 'collected-item';
      collectedItem.style.cssText = `
        visibility: visible;
        font-size: 24px;
        transition: all 0.3s ease;
        transform: none;
        filter: none;
        opacity: 1;
        cursor: default;
        user-select: none;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // 添加到收集区域（Grid布局会自动排列）
      collectionArea.appendChild(collectedItem);

      // 更新元素计数
      const currentCount = parseInt(collectionArea.getAttribute('data-item-count') || '0');
      collectionArea.setAttribute('data-item-count', (currentCount + 1).toString());

      // 添加入场动画效果
      collectedItem.style.transform = 'scale(0.5)';
      collectedItem.style.opacity = '0';

      requestAnimationFrame(() => {
        collectedItem.style.transform = 'scale(1)';
        collectedItem.style.opacity = '1';

        // 在元素添加完成后，触发布局更新
        setTimeout(() => {
          this.updateLayoutAfterCollection(collectionArea);
        }, 100); // 等待元素完全渲染
      });

      // 清理飞行元素
      if (flyingItem && flyingItem.parentNode) {
        flyingItem.parentNode.removeChild(flyingItem);
      }

      console.log('🚀 收集动画完成并清理');

    } catch (cleanupError) {
      console.error('收集动画清理出错:', cleanupError);
    }
  }

  /**
   * 收集后更新布局 - 动态重排问题和答案区域
   * @param {HTMLElement} collectionArea - 收集区域元素
   */
  updateLayoutAfterCollection(collectionArea) {
    try {
      // 计算收集区域的实际高度
      const actualHeight = this.calculateCollectionAreaHeight(collectionArea);
      const initialTop = parseInt(collectionArea.getAttribute('data-initial-top'));
      const collectionBottom = initialTop + actualHeight;

      console.log(`🔄 动态布局更新: 收集区域高度${actualHeight}px, 底部位置${collectionBottom}px`);

      // 重新计算问题和答案区域的位置
      const minGap = 30;
      const questionAreaHeight = 60;
      const answerAreaHeight = 80;
      const bottomMargin = 10;

      const newQuestionTop = collectionBottom + minGap;
      const newAnswerTop = newQuestionTop + questionAreaHeight + minGap;
      const newContainerHeight = newAnswerTop + answerAreaHeight + bottomMargin;

      // 更新问题区域位置
      this.repositionQuestionArea(newQuestionTop);

      // 更新答案区域位置
      this.repositionAnswerArea(newAnswerTop);

      // 更新场景容器高度
      this.updateSceneContainerHeight(newContainerHeight);

      console.log(`🔄 布局更新完成: 问题区域${newQuestionTop}px, 答案区域${newAnswerTop}px, 容器高度${newContainerHeight}px`);

    } catch (error) {
      console.error('动态布局更新出错:', error);
    }
  }

  /**
   * 计算收集区域的实际高度
   * @param {HTMLElement} collectionArea - 收集区域元素
   * @returns {number} 实际高度
   */
  calculateCollectionAreaHeight(collectionArea) {
    // 获取收集区域的实际渲染高度
    const rect = collectionArea.getBoundingClientRect();
    const computedStyle = getComputedStyle(collectionArea);

    // 包含padding和border的总高度
    const paddingTop = parseInt(computedStyle.paddingTop);
    const paddingBottom = parseInt(computedStyle.paddingBottom);
    const borderTop = parseInt(computedStyle.borderTopWidth);
    const borderBottom = parseInt(computedStyle.borderBottomWidth);

    const actualHeight = rect.height;

    console.log(`📏 收集区域高度计算: 实际高度${actualHeight}px (包含padding: ${paddingTop + paddingBottom}px, border: ${borderTop + borderBottom}px)`);

    return actualHeight;
  }

  /**
   * 重新定位问题区域
   * @param {number} newTop - 新的top位置
   */
  repositionQuestionArea(newTop) {
    const questionElement = document.querySelector('.shopping-scene .question-text');
    if (questionElement) {
      questionElement.style.top = `${newTop}px`;
      questionElement.style.transition = 'top 0.3s ease-out';
      console.log(`📝 问题区域重新定位到: ${newTop}px`);
    }
  }

  /**
   * 重新定位答案区域
   * @param {number} newTop - 新的top位置
   */
  repositionAnswerArea(newTop) {
    const answerElement = document.querySelector('.shopping-scene .answer-drop-area');
    if (answerElement) {
      answerElement.style.top = `${newTop}px`;
      answerElement.style.transition = 'top 0.3s ease-out';
      console.log(`🎯 答案区域重新定位到: ${newTop}px`);
    }
  }

  /**
   * 更新场景容器高度
   * @param {number} newHeight - 新的容器高度
   */
  updateSceneContainerHeight(newHeight) {
    const sceneContainer = document.querySelector('.shopping-scene');
    if (sceneContainer) {
      sceneContainer.style.minHeight = `${newHeight}px`;
      sceneContainer.style.transition = 'min-height 0.3s ease-out';
      console.log(`📦 场景容器高度更新到: ${newHeight}px`);
    }
  }

  /**
   * 隐藏左右篮子的动画
   * @param {HTMLElement} leftBasket - 左边篮子
   * @param {HTMLElement} rightBasket - 右边篮子
   * @returns {Promise} 动画完成的Promise
   */
  hideBasketsWithAnimation(leftBasket, rightBasket) {
    return new Promise((resolve) => {
      try {
        console.log('🎬 开始隐藏左右篮子...');

        // 同时淡出两个篮子
        leftBasket.style.transition = 'all 0.6s ease-out';
        rightBasket.style.transition = 'all 0.6s ease-out';

        requestAnimationFrame(() => {
          leftBasket.style.opacity = '0';
          leftBasket.style.transform = 'scale(0.8)';
          rightBasket.style.opacity = '0';
          rightBasket.style.transform = 'scale(0.8)';
        });

        // 动画完成后处理
        setTimeout(() => {
          leftBasket.style.visibility = 'hidden';
          rightBasket.style.visibility = 'hidden';
          console.log('🎬 左右篮子隐藏完成');
          resolve();
        }, 600);

      } catch (error) {
        console.error('隐藏篮子动画出错:', error);
        resolve();
      }
    });
  }

  /**
   * 显示提示文案并恢复状态
   */
  async showHintMessage() {
    try {
      console.log('💬 显示加法提示文案...');

      // 获取提示文案（类似减法场景的询问式风格）
      const themeName = this.currentItemGroup.theme;
      const hintText = `小朋友，请数一数现在收集区域里有几个${themeName}吧？`;

      console.log('提示文案:', hintText);

      // 创建提示文案显示元素
      const hintMessageElement = this.createHintMessageElement(hintText);

      // 显示提示文案
      await this.displayHintMessage(hintMessageElement);

      console.log('💬 加法提示文案显示完成');

    } catch (error) {
      console.error('显示加法提示文案出错:', error);
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
    hintElement.className = 'addition-hint-message';
    hintElement.textContent = hintText;

    // 设置样式（绿色主题，符合加法场景）
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
        const sceneContainer = document.querySelector('.shopping-scene');
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

        console.log('💬 加法提示文案已显示，3秒后自动消失');

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
              console.log('💬 加法提示文案已移除');
              resolve();
            } catch (cleanupError) {
              console.error('加法提示文案清理出错:', cleanupError);
              resolve();
            }
          }, 500); // 退出动画时长

        }, 3000); // 显示3秒

      } catch (error) {
        console.error('显示加法提示文案出错:', error);
        resolve();
      }
    });
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingScene;
}
