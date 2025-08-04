/**
 * 乘法场景类 - 花园场景
 * 实现乘法运算的可视化学习场景
 */

class GardenScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);

    // 提示功能状态管理
    this.isHintInProgress = false;
    this.currentQuestion = null;
    this.currentItemType = null;
    this.currentCharacter = null;
  }

  /**
   * 渲染花园场景（乘法）
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async render(container, question) {
    const containerCount = question.num1;
    const itemsPerContainer = question.num2;
    const totalItems = question.answer;

    // 保存当前题目和物品信息（用于提示功能）
    this.currentQuestion = question;

    // 为容器添加乘法场景类名
    container.classList.add('garden-scene');

    // 创建标题区域（在数字拖拽区上方）
    this.createTitleHeader(container);

    // 随机选择物品类型（使用SceneManager中的旧方法）
    const itemType = this.sceneManager.getRandomMultiplicationItem();
    this.currentItemType = itemType; // 保存物品类型信息
    console.log('乘法场景选择的物品类型:', itemType);

    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    this.currentCharacter = character; // 保存学习伙伴信息
    console.log('乘法场景选择的学习伙伴:', character);

    // 创建数字拖拽区（顶部）
    this.createNumberDragArea(container);

    // 计算动态布局
    const layout = this.calculateDynamicLayout(containerCount, itemsPerContainer);
    console.log('乘法场景动态布局:', layout);

    // 创建乘法容器（使用动态位置）
    this.createContainersDisplayWithLayout(container, containerCount, itemsPerContainer, itemType, layout);

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
      border: 2px solid #9C27B0;
      z-index: 5;
      max-width: 500px;
      line-height: 1.4;
    `;
    questionText.innerHTML = `${character.name}准备了${containerCount}个${itemType.containerName}，每个${itemType.containerName}里有${itemsPerContainer}个${itemType.itemName}，总共有多少个${itemType.itemName}？`;
    container.appendChild(questionText);

    // 创建答案拖拽区（使用动态位置）
    this.createAnswerDropArea(container, totalItems, layout.answerTop);

    // 设置容器的最小高度
    container.style.minHeight = `${layout.minContainerHeight}px`;

    console.log(`花园场景渲染完成: ${containerCount} × ${itemsPerContainer} = ${totalItems}`);
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
   * 计算乘法场景的动态布局
   * @param {number} containerCount - 容器数量
   * @param {number} itemsPerContainer - 每个容器的物品数量
   * @returns {Object} 布局信息
   */
  calculateDynamicLayout(containerCount, itemsPerContainer) {
    // 基础位置
    const numberDragTop = 80;
    const containersStartTop = 180;

    // 计算容器布局
    const maxRows = 2;
    const containersPerRow = containerCount <= 3 ? containerCount : Math.ceil(containerCount / maxRows);
    const actualRows = Math.min(maxRows, Math.ceil(containerCount / containersPerRow));

    // 计算容器尺寸
    const minSize = 100;
    const maxSize = 140;
    const baseSize = 110;
    const sizeIncrement = Math.min(8, itemsPerContainer * 3);
    const containerSize = Math.min(maxSize, baseSize + sizeIncrement);

    // 计算容器区域总高度
    const containerGap = 15; // grid gap
    const containersAreaHeight = actualRows * containerSize + (actualRows - 1) * containerGap;
    const containersAreaBottom = containersStartTop + containersAreaHeight;

    // 计算各区域位置
    const minGap = 30; // 最小间距
    const questionAreaHeight = 60; // 题目区域高度
    const answerAreaHeight = 80; // 答案区域高度

    // 题目区域紧跟容器区域
    const questionTop = containersAreaBottom + minGap;

    // 答案区域紧跟题目区域
    const answerTop = questionTop + questionAreaHeight + minGap;

    // 容器总高度（答案区域下面留10px底部边距）
    const bottomMargin = 10;
    const minContainerHeight = answerTop + answerAreaHeight + bottomMargin;

    console.log(`乘法场景动态布局计算: 容器${containerCount}个, 布局${actualRows}行×${containersPerRow}列, 容器尺寸${containerSize}px, 容器区域高度${containersAreaHeight}px, 题目位置${questionTop}px, 答案位置${answerTop}px, 建议容器高度${minContainerHeight}px`);

    return {
      numberDragTop,
      containersStartTop,
      containersAreaHeight,
      containersAreaBottom,
      questionTop,
      answerTop,
      minContainerHeight,
      containerLayout: {
        rows: actualRows,
        cols: containersPerRow,
        containerSize,
        gap: containerGap
      }
    };
  }

  /**
   * 创建带动态布局的容器展示区
   * @param {HTMLElement} container - 主容器
   * @param {number} containerCount - 容器数量
   * @param {number} itemsPerContainer - 每个容器内物品数量
   * @param {Object} itemType - 物品类型信息
   * @param {Object} layout - 布局信息
   */
  createContainersDisplayWithLayout(container, containerCount, itemsPerContainer, itemType, layout) {
    const containersArea = document.createElement('div');
    containersArea.className = 'containers-display';

    containersArea.style.cssText = `
      position: absolute;
      top: ${layout.containersStartTop}px;
      left: 50%;
      transform: translateX(-50%);
      display: grid;
      grid-template-columns: repeat(${layout.containerLayout.cols}, 1fr);
      grid-template-rows: repeat(${layout.containerLayout.rows}, auto);
      justify-items: center;
      align-items: center;
      gap: ${layout.containerLayout.gap}px;
      max-width: 600px;
      z-index: 5;
      min-height: ${layout.containersAreaHeight}px;
    `;

    // 创建每个容器
    for (let i = 0; i < containerCount; i++) {
      const singleContainer = this.createSingleContainerWithSize(i, itemsPerContainer, itemType, layout.containerLayout.containerSize);
      containersArea.appendChild(singleContainer);
    }

    container.appendChild(containersArea);
  }

  /**
   * 创建指定尺寸的单个容器
   * @param {number} index - 容器索引
   * @param {number} itemCount - 容器内物品数量
   * @param {Object} itemType - 物品类型信息
   * @param {number} containerSize - 容器尺寸
   * @returns {HTMLElement} 容器元素
   */
  createSingleContainerWithSize(index, itemCount, itemType, containerSize) {
    const containerElement = document.createElement('div');
    containerElement.className = 'single-container';

    containerElement.style.cssText = `
      width: ${containerSize}px;
      height: ${containerSize}px;
      background: rgba(255,255,255,0.95);
      border: 3px solid #9C27B0;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      position: relative;
      overflow: hidden;
    `;

    // 容器标签
    const containerLabel = document.createElement('div');
    containerLabel.className = 'container-label';
    containerLabel.style.cssText = `
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: bold;
      color: #9C27B0;
      background: rgba(255,255,255,0.9);
      padding: 2px 6px;
      border-radius: 8px;
      border: 1px solid #9C27B0;
    `;
    containerLabel.textContent = `${itemType.containerName}${index + 1}`;
    containerElement.appendChild(containerLabel);

    // 物品容器
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'container-items';
    itemsContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 3px;
      padding: 15px 5px 5px 5px;
      width: 100%;
      height: 100%;
    `;

    // 添加物品
    for (let i = 0; i < itemCount; i++) {
      const item = document.createElement('div');
      item.className = 'container-item';
      item.style.cssText = `
        font-size: 14px;
        line-height: 1;
        user-select: none;
      `;
      // 兼容两种数据结构：旧的item是字符串，新的item是对象
      item.textContent = typeof itemType.item === 'string' ? itemType.item : itemType.item.icon;
      itemsContainer.appendChild(item);
    }

    containerElement.appendChild(itemsContainer);
    return containerElement;
  }

  /**
   * 显示提示功能 - 插入式逐组计数演示
   */
  async showHint() {
    try {
      // 检查是否正在进行提示
      if (this.isHintInProgress) {
        console.log('提示功能正在进行中，请稍候...');
        return;
      }

      // 检查必要的数据
      if (!this.currentQuestion || !this.currentItemType || !this.currentCharacter) {
        console.error('缺少必要的题目或物品类型信息');
        if (window.uiManager) {
          window.uiManager.showMessage('提示功能暂时不可用，请重新开始题目');
        }
        return;
      }

      console.log('🎯 开始乘法插入式提示演示:', this.currentQuestion);

      // 设置提示状态
      this.setHintState(true);

      // 开始插入式提示动画序列
      await this.startInsertHintAnimation();

      console.log('✅ 乘法插入式提示演示完成');

    } catch (error) {
      console.error('乘法提示功能执行出错:', error);

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
   * 开始插入式提示动画序列
   */
  async startInsertHintAnimation() {
    try {
      console.log('🎬 开始插入式提示动画序列...');

      // 获取所有容器
      const containers = document.querySelectorAll('.garden-scene .single-container');

      if (containers.length === 0) {
        console.error('找不到容器，无法执行动画');
        return;
      }

      // 第1步：创建插入式提示区域并调整布局
      const hintArea = this.createInsertHintArea();
      this.insertHintAreaAndAdjustLayout(hintArea);

      // 第2步：执行逐组计数动画
      await this.performGroupCountingAnimation(containers, hintArea);

      // 第3步：显示最终提示文案
      await this.showFinalHintMessage(hintArea);

      // 第4步：移除提示区域并恢复布局
      await this.removeHintAreaAndRestoreLayout(hintArea);

      console.log('🎬 插入式提示动画序列完成');

    } catch (error) {
      console.error('插入式提示动画序列执行出错:', error);
    } finally {
      // 确保状态恢复
      this.setHintState(false);
    }
  }

  /**
   * 创建插入式提示区域
   * @returns {HTMLElement} 提示区域元素
   */
  createInsertHintArea() {
    const hintArea = document.createElement('div');
    hintArea.className = 'insert-hint-area';
    hintArea.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #9C27B0, #7B1FA2);
      color: white;
      padding: 20px 30px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      text-align: center;
      box-shadow: 0 8px 25px rgba(156, 39, 176, 0.4);
      z-index: 20;
      min-width: 350px;
      min-height: 80px;
      opacity: 0;
      transform: translateX(-50%) scale(0.8);
      transition: all 0.5s ease-out;
      border: 3px solid rgba(255, 255, 255, 0.3);
    `;

    // 初始内容
    hintArea.innerHTML = `
      <div class="hint-title" style="font-size: 20px; margin-bottom: 10px;">🎯 计算总数</div>
      <div class="hint-content" style="font-size: 16px;">准备开始逐组计数...</div>
    `;

    return hintArea;
  }

  /**
   * 插入提示区域并调整布局
   * @param {HTMLElement} hintArea - 提示区域元素
   */
  insertHintAreaAndAdjustLayout(hintArea) {
    try {
      // 计算插入位置（容器展示区底部）
      const layout = this.calculateDynamicLayout(this.currentQuestion.num1, this.currentQuestion.num2);
      const insertTop = layout.containersAreaBottom + 30; // 容器区域底部 + 30px间距

      // 设置提示区域位置
      hintArea.style.top = `${insertTop}px`;

      // 添加到场景容器
      const sceneContainer = document.querySelector('.garden-scene');
      if (sceneContainer) {
        sceneContainer.appendChild(hintArea);

        // 触发进入动画
        requestAnimationFrame(() => {
          hintArea.style.opacity = '1';
          hintArea.style.transform = 'translateX(-50%) scale(1)';
        });
      }

      // 计算需要下移的距离
      const hintAreaHeight = 120; // 提示区域高度（包含padding）
      const moveDistance = hintAreaHeight + 30; // 提示区域高度 + 间距

      // 下移问题区域和答案区域
      this.moveElementsDown(moveDistance);

      console.log(`📍 提示区域已插入到位置: ${insertTop}px, 其他元素下移: ${moveDistance}px`);

    } catch (error) {
      console.error('插入提示区域并调整布局出错:', error);
    }
  }

  /**
   * 下移问题区域和答案区域
   * @param {number} moveDistance - 下移距离
   */
  moveElementsDown(moveDistance) {
    const questionElement = document.querySelector('.garden-scene .question-text');
    const answerElement = document.querySelector('.garden-scene .answer-drop-area');
    const sceneContainer = document.querySelector('.garden-scene');

    // 保存原始位置（用于恢复）
    if (questionElement) {
      this.originalQuestionTop = questionElement.style.top;
      const currentTop = parseInt(questionElement.style.top) || 0;
      const newTop = currentTop + moveDistance;
      questionElement.style.top = `${newTop}px`;
      questionElement.style.transition = 'top 0.5s ease-out';
      console.log(`📝 问题区域下移到: ${newTop}px`);
    }

    if (answerElement) {
      this.originalAnswerTop = answerElement.style.top;
      const currentTop = parseInt(answerElement.style.top) || 0;
      const newTop = currentTop + moveDistance;
      answerElement.style.top = `${newTop}px`;
      answerElement.style.transition = 'top 0.5s ease-out';
      console.log(`🎯 答案区域下移到: ${newTop}px`);
    }

    // 更新场景容器高度
    if (sceneContainer) {
      this.originalContainerHeight = sceneContainer.style.minHeight;
      const currentHeight = parseInt(sceneContainer.style.minHeight) || 600;
      const newHeight = currentHeight + moveDistance;
      sceneContainer.style.minHeight = `${newHeight}px`;
      sceneContainer.style.transition = 'min-height 0.5s ease-out';
      console.log(`📦 场景容器高度更新到: ${newHeight}px`);
    }
  }

  /**
   * 执行逐组计数动画
   * @param {NodeList} containers - 容器元素列表
   * @param {HTMLElement} hintArea - 提示区域元素
   */
  async performGroupCountingAnimation(containers, hintArea) {
    try {
      const containerCount = this.currentQuestion.num1;
      const itemsPerContainer = this.currentQuestion.num2;

      console.log(`🎬 开始逐组计数: ${containerCount}个容器, 每个${itemsPerContainer}个物品`);

      let totalCount = 0;

      // 逐个容器进行计数演示
      for (let i = 0; i < containerCount; i++) {
        const container = containers[i];
        const groupNumber = i + 1;

        console.log(`🎬 第${groupNumber}组计数开始`);

        // 高亮当前容器
        this.highlightContainer(container, true);

        // 更新计数显示
        totalCount += itemsPerContainer;
        this.updateHintAreaContent(hintArea, groupNumber, itemsPerContainer, totalCount);

        // 等待用户观察
        await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2秒观察时间

        // 取消高亮
        this.highlightContainer(container, false);

        // 组间间隔
        if (i < containerCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms间隔
        }
      }

      // 显示最终算式
      await this.showFinalFormula(hintArea, containerCount, itemsPerContainer, totalCount);

      console.log('🎬 逐组计数动画完成');

    } catch (error) {
      console.error('逐组计数动画执行出错:', error);
    }
  }

  /**
   * 高亮容器
   * @param {HTMLElement} container - 容器元素
   * @param {boolean} highlight - 是否高亮
   */
  highlightContainer(container, highlight) {
    if (highlight) {
      container.style.borderColor = '#FFD700';
      container.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.8)';
      container.style.borderWidth = '5px';
      container.style.transform = 'scale(1.05)';
      container.style.transition = 'all 0.3s ease-out';
    } else {
      container.style.borderColor = '#9C27B0';
      container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      container.style.borderWidth = '3px';
      container.style.transform = 'scale(1)';
      container.style.transition = 'all 0.3s ease-out';
    }
  }

  /**
   * 更新提示区域内容
   * @param {HTMLElement} hintArea - 提示区域元素
   * @param {number} groupNumber - 当前组号
   * @param {number} itemsPerGroup - 每组物品数
   * @param {number} totalCount - 累计总数
   */
  updateHintAreaContent(hintArea, groupNumber, itemsPerGroup, totalCount) {
    const contentElement = hintArea.querySelector('.hint-content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div style="margin-bottom: 8px;">第${groupNumber}组：${itemsPerGroup}个</div>
        <div style="font-size: 20px; color: #FFD700; font-weight: bold;">总计：${totalCount}个</div>
      `;

      // 添加数字增长动画效果
      contentElement.style.transform = 'scale(1.1)';
      setTimeout(() => {
        contentElement.style.transform = 'scale(1)';
      }, 300);
    }
  }

  /**
   * 显示最终算式
   * @param {HTMLElement} hintArea - 提示区域元素
   * @param {number} containerCount - 容器数量
   * @param {number} itemsPerContainer - 每容器物品数
   * @param {number} totalCount - 总数
   * @returns {Promise} 显示完成的Promise
   */
  showFinalFormula(hintArea, containerCount, itemsPerContainer, totalCount) {
    return new Promise((resolve) => {
      try {
        const contentElement = hintArea.querySelector('.hint-content');
        if (contentElement) {
          // 显示最终算式
          contentElement.innerHTML = `
            <div style="margin-bottom: 12px; font-size: 16px;">
              ${containerCount}组 × 每组${itemsPerContainer}个 = ${totalCount}个
            </div>
            <div style="font-size: 22px; color: #FFD700; font-weight: bold;">
              ${containerCount} × ${itemsPerContainer} = ${totalCount}
            </div>
          `;

          // 添加强调动画
          contentElement.style.transform = 'scale(1.2)';
          contentElement.style.transition = 'transform 0.5s ease-out';

          setTimeout(() => {
            contentElement.style.transform = 'scale(1)';
            resolve();
          }, 1000);
        } else {
          resolve();
        }

      } catch (error) {
        console.error('显示最终算式出错:', error);
        resolve();
      }
    });
  }

  /**
   * 显示最终提示文案
   * @param {HTMLElement} hintArea - 提示区域元素
   * @returns {Promise} 显示完成的Promise
   */
  async showFinalHintMessage(hintArea) {
    try {
      console.log('💬 显示最终提示文案...');

      // 等待2秒让用户观察算式
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 获取提示文案
      const itemName = typeof this.currentItemType.item === 'string'
        ? this.currentItemType.item
        : this.currentItemType.item.name;
      const hintText = `小朋友，请数一数总共有几个${itemName}吧？`;

      // 更新提示区域内容为最终文案
      const titleElement = hintArea.querySelector('.hint-title');
      const contentElement = hintArea.querySelector('.hint-content');

      if (titleElement && contentElement) {
        titleElement.innerHTML = '💡 提示';
        contentElement.innerHTML = `<div style="font-size: 18px; line-height: 1.4;">${hintText}</div>`;

        // 添加闪烁效果
        hintArea.style.animation = 'pulse 1s ease-in-out 2';
      }

      // 显示3秒
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('💬 最终提示文案显示完成');

    } catch (error) {
      console.error('显示最终提示文案出错:', error);
    }
  }

  /**
   * 移除提示区域并恢复布局
   * @param {HTMLElement} hintArea - 提示区域元素
   * @returns {Promise} 移除完成的Promise
   */
  async removeHintAreaAndRestoreLayout(hintArea) {
    try {
      console.log('🔄 开始移除提示区域并恢复布局...');

      // 提示区域淡出动画
      hintArea.style.opacity = '0';
      hintArea.style.transform = 'translateX(-50%) scale(0.8)';

      // 等待淡出动画完成
      await new Promise(resolve => setTimeout(resolve, 500));

      // 移除提示区域
      if (hintArea && hintArea.parentNode) {
        hintArea.parentNode.removeChild(hintArea);
      }

      // 恢复问题区域和答案区域的原始位置
      this.restoreElementsPosition();

      // 等待布局恢复动画完成
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('🔄 提示区域移除和布局恢复完成');

    } catch (error) {
      console.error('移除提示区域并恢复布局出错:', error);
    }
  }

  /**
   * 恢复元素原始位置
   */
  restoreElementsPosition() {
    try {
      const questionElement = document.querySelector('.garden-scene .question-text');
      const answerElement = document.querySelector('.garden-scene .answer-drop-area');
      const sceneContainer = document.querySelector('.garden-scene');

      if (questionElement && this.originalQuestionTop) {
        questionElement.style.top = this.originalQuestionTop;
        questionElement.style.transition = 'top 0.5s ease-out';
        console.log(`📝 问题区域恢复到原始位置: ${this.originalQuestionTop}`);
      }

      if (answerElement && this.originalAnswerTop) {
        answerElement.style.top = this.originalAnswerTop;
        answerElement.style.transition = 'top 0.5s ease-out';
        console.log(`🎯 答案区域恢复到原始位置: ${this.originalAnswerTop}`);
      }

      if (sceneContainer && this.originalContainerHeight) {
        sceneContainer.style.minHeight = this.originalContainerHeight;
        sceneContainer.style.transition = 'min-height 0.5s ease-out';
        console.log(`📦 场景容器高度恢复到: ${this.originalContainerHeight}`);
      }

      console.log('🔄 所有元素位置已恢复');

    } catch (error) {
      console.error('恢复元素原始位置出错:', error);
    }
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GardenScene;
}
