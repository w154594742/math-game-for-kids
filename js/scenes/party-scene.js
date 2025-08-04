/**
 * 除法场景类 - 派对场景
 * 实现除法运算的可视化学习场景
 */

class PartyScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);

    // 提示功能状态管理
    this.isHintInProgress = false;
    this.currentQuestion = null;
    this.currentItemType = null;
  }

  /**
   * 渲染派对场景（除法）
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async render(container, question) {
    const totalCakes = question.num1;
    const plateCount = question.num2;
    const cakesPerPlate = Math.floor(totalCakes / plateCount);

    // 保存当前题目和物品类型信息（用于提示功能）
    this.currentQuestion = question;

    // 为容器添加除法场景类名
    container.classList.add('party-scene');

    // 随机选择物品类型
    const itemType = this.itemsConfig.getRandomDivisionItem();
    this.currentItemType = itemType; // 保存物品类型信息
    console.log('除法场景选择的物品类型:', itemType);

    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    console.log('除法场景选择的学习伙伴:', character);

    // 根据盒子数量动态计算布局
    const plateLayout = this.calculatePlateLayout(plateCount);
    const dynamicLayout = this.calculateDynamicLayout(plateCount, plateLayout, totalCakes);

    // 创建标题区域（在数字拖拽区上方）
    this.createTitleHeader(container);

    // 根据内容高度调整容器高度
    this.adjustContainerHeight(container, dynamicLayout.minContainerHeight);

    // 创建数字拖拽区（固定位置，与其他场景一致）
    this.sceneManager.createNumberDragArea(container, 100);

    // 创建生活化题目（使用模板生成）
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      position: absolute !important;
      top: ${dynamicLayout.questionTop}px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: rgba(255,255,255,0.95) !important;
      padding: 12px 20px !important;
      border-radius: 12px !important;
      font-size: 16px !important;
      font-weight: bold !important;
      color: #333 !important;
      text-align: center !important;
      box-shadow: 0 3px 12px rgba(0,0,0,0.2) !important;
      border: 2px solid #FFD700 !important;
      z-index: 15 !important;
      max-width: 400px !important;
      line-height: 1.4 !important;
      word-wrap: break-word !important;
    `;
    
    // 使用模板生成生活化题目
    const questionTemplate = itemType.questionTemplate
      .replace('{character}', character.name)
      .replace('{total}', totalCakes)
      .replace('{plateCount}', plateCount)
      .replace(/{itemName}/g, itemType.item.name);
    
    questionText.innerHTML = questionTemplate;
    container.appendChild(questionText);

    // 创建物品托盘（优化布局：每行9个元素，防止超出）
    const cakeTray = document.createElement('div');
    cakeTray.className = 'cake-tray';
    cakeTray.style.cssText = `
      position: absolute;
      top: ${dynamicLayout.cakeTrayTop}px;
      left: 80px;
      width: 350px;
      background: #FFD700;
      border-radius: 15px;
      padding: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      gap: 4px 6px;
      justify-items: center;
      align-items: center;
    `;

    // 创建物品元素（使用随机选择的物品）
    for (let i = 0; i < totalCakes; i++) {
      const cake = document.createElement('div');
      cake.className = 'draggable-cake';
      cake.draggable = true;
      cake.dataset.value = '1';
      cake.dataset.type = 'cake';
      cake.id = `cake-${i}`;
      cake.style.cssText = `
        font-size: 24px;
        cursor: grab;
        transition: transform 0.2s ease;
        user-select: none;
      `;
      cake.textContent = itemType.item.icon;
      
      this.addCakeDragEvents(cake);
      cakeTray.appendChild(cake);
    }

    // 为物品托盘添加拖拽目标功能（可以从盘子拖回）
    this.initItemTrayDropTarget(cakeTray, itemType);
    
    container.appendChild(cakeTray);

    // 创建盘子（智能布局，避免重叠，标题外置）
    const plateSize = this.calculatePlateSize(plateCount);
    
    for (let i = 0; i < plateCount; i++) {
      const position = this.calculatePlatePosition(i, plateLayout, plateSize, dynamicLayout);

      // 创建盘子容器（包含标题和盘子）
      const plateContainer = document.createElement('div');
      plateContainer.className = 'plate-container';
      plateContainer.style.cssText = `
        position: absolute;
        top: ${position.y - 20}px;
        right: ${position.x}px;
        width: ${plateSize.width}px;
        height: ${plateSize.height + 25}px;
      `;

      // 创建标题（外置在盘子上方）
      const plateTitle = document.createElement('div');
      plateTitle.className = 'plate-title';
      plateTitle.style.cssText = `
        font-size: 11px;
        font-weight: bold;
        color: #FF1493;
        text-align: center;
        margin-bottom: 5px;
        height: 15px;
      `;

      // 计算从左到右的序号（因为使用right定位，需要反转序号）
      const visualIndex = this.calculateVisualIndex(i, plateLayout);
      plateTitle.textContent = `${itemType.containerName}${visualIndex}`;

      // 创建盘子（不包含标题）
      const plate = document.createElement('div');
      plate.className = 'party-plate';
      plate.id = `party-plate-${i}`;
      plate.dataset.cakeCount = '0';
      plate.dataset.plateIndex = i;
      plate.style.cssText = `
        width: ${plateSize.width}px;
        height: ${plateSize.height}px;
        background: white;
        border: 3px dashed #FF1493;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;

      // 创建盘子内部物品容器（移除高度限制，支持任意数量元素）
      const plateItems = document.createElement('div');
      plateItems.id = `plate-items-${i}`;
      plateItems.className = 'plate-items';
      plateItems.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 20px;
        gap: 2px;
        max-width: ${plateSize.width - 20}px;
        justify-items: center;
        align-items: center;
        padding: 5px;
      `;

      plate.appendChild(plateItems);
      plateContainer.appendChild(plateTitle);
      plateContainer.appendChild(plate);

      // 初始化盘子拖拽目标（无数量限制）
      this.initFreePlateDropTarget(plate);

      container.appendChild(plateContainer);
    }

    // 创建答案区域（使用动态顶部定位）
    this.createAnswerDropArea(container, cakesPerPlate, dynamicLayout.answerTop);

    console.log(`派对场景渲染完成: ${totalCakes} ÷ ${plateCount} = ${cakesPerPlate}`);
  }

  /**
   * 显示提示功能 - 自动演示除法分配过程
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

      console.log('🎯 开始除法提示演示:', this.currentQuestion);

      // 设置提示状态
      this.setHintState(true);

      // 获取当前题目信息
      const totalItems = this.currentQuestion.num1;
      const plateCount = this.currentQuestion.num2;
      const itemsPerPlate = this.currentQuestion.answer;

      console.log(`提示演示: ${totalItems} ÷ ${plateCount} = ${itemsPerPlate}`);

      // 开始轮流分配动画序列
      await this.startDistributionAnimation();

      // 显示提示文案
      await this.showHintMessage();

      console.log('✅ 除法提示演示完成');

    } catch (error) {
      console.error('除法提示功能执行出错:', error);

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
   * 开始轮流分配动画序列
   */
  async startDistributionAnimation() {
    try {
      console.log('🎬 开始轮流分配动画序列...');

      // 获取托盘和盒子容器
      const tray = document.querySelector('.party-scene .cake-tray');
      const plates = document.querySelectorAll('.party-scene .party-plate');

      if (!tray || plates.length === 0) {
        console.error('找不到托盘或盒子，无法执行动画');
        return;
      }

      // 获取托盘中的物品元素
      const trayItems = Array.from(tray.children);
      const plateCount = plates.length;

      console.log(`🎬 分配动画: 托盘${trayItems.length}个物品, ${plateCount}个盒子`);

      if (trayItems.length === 0) {
        console.log('🎬 托盘已为空，无需动画');
        return;
      }

      // 获取布局信息用于序号转换
      const plateLayout = this.calculatePlateLayout(plateCount);

      // 执行轮流分配动画
      for (let i = 0; i < trayItems.length; i++) {
        const currentItem = trayItems[i];

        // 计算视觉序号（从1开始，轮流分配）
        const visualPlateIndex = (i % plateCount) + 1;

        // 根据视觉序号获取DOM索引
        const domPlateIndex = this.getDOMIndexFromVisualIndex(visualPlateIndex, plateLayout);
        const targetPlate = plates[domPlateIndex];

        console.log(`🎬 第${i + 1}/${trayItems.length}次分配: 物品 → 盒子${visualPlateIndex} (DOM索引:${domPlateIndex})`);

        // 高亮目标盒子
        this.highlightPlate(targetPlate, true);

        // 执行分配动画
        await this.createDistributionAnimation(currentItem, targetPlate);

        // 取消高亮
        this.highlightPlate(targetPlate, false);

        // 分配间隔
        if (i < trayItems.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300)); // 300ms间隔
        }
      }

      console.log('🎬 轮流分配动画序列完成');

    } catch (error) {
      console.error('分配动画序列执行出错:', error);
    }
  }

  /**
   * 高亮盒子
   * @param {HTMLElement} plate - 盒子元素
   * @param {boolean} highlight - 是否高亮
   */
  highlightPlate(plate, highlight) {
    if (highlight) {
      plate.style.borderColor = '#FFD700';
      plate.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
      plate.style.borderWidth = '4px';
    } else {
      plate.style.borderColor = '#FF1493';
      plate.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      plate.style.borderWidth = '3px';
    }
  }

  /**
   * 创建分配动画 - 从托盘到盒子的直线投递
   * @param {HTMLElement} item - 要分配的物品元素
   * @param {HTMLElement} targetPlate - 目标盒子
   * @returns {Promise} 动画完成的Promise
   */
  createDistributionAnimation(item, targetPlate) {
    return new Promise((resolve) => {
      try {
        // 获取起点和终点位置
        const itemRect = item.getBoundingClientRect();
        const plateRect = targetPlate.getBoundingClientRect();

        console.log(`🚀 动画位置调试: 物品(${itemRect.left}, ${itemRect.top}, ${itemRect.width}x${itemRect.height}), 盒子(${plateRect.left}, ${plateRect.top}, ${plateRect.width}x${plateRect.height})`);

        // 创建飞行元素
        const flyingItem = item.cloneNode(true);
        flyingItem.className = 'flying-distribution-item';

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

        // 计算目标位置（盒子中心）
        const targetX = plateRect.left + plateRect.width / 2 - itemRect.width / 2;
        const targetY = plateRect.top + plateRect.height / 2 - itemRect.height / 2;

        // 计算移动距离
        const deltaX = targetX - itemRect.left;
        const deltaY = targetY - itemRect.top;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        console.log(`🚀 分配动画: 从(${itemRect.left}, ${itemRect.top}) 到 (${targetX}, ${targetY}), 距离: ${distance.toFixed(2)}px`);

        // 确保有足够的移动距离才执行动画
        if (distance < 10) {
          console.warn('🚀 移动距离太小，跳过动画');
          // 直接完成处理
          this.completeDistributionAnimation(item, targetPlate, flyingItem);
          resolve();
          return;
        }

        // 启动分配动画
        requestAnimationFrame(() => {
          flyingItem.style.transition = 'all 0.8s ease-out'; // 增加动画时长
          flyingItem.style.left = `${targetX}px`;
          flyingItem.style.top = `${targetY}px`;
          flyingItem.style.transform = 'scale(1.1)';
          flyingItem.style.opacity = '0.9';
        });

        // 动画完成后处理
        setTimeout(() => {
          this.completeDistributionAnimation(item, targetPlate, flyingItem);
          resolve();
        }, 800); // 与动画时长一致

      } catch (error) {
        console.error('创建分配动画出错:', error);
        resolve();
      }
    });
  }

  /**
   * 完成分配动画的后续处理
   * @param {HTMLElement} originalItem - 原始物品元素
   * @param {HTMLElement} targetPlate - 目标盒子
   * @param {HTMLElement} flyingItem - 飞行元素
   */
  completeDistributionAnimation(originalItem, targetPlate, flyingItem) {
    try {
      // 隐藏原始物品
      originalItem.style.visibility = 'hidden';

      // 在目标盒子中添加物品
      const plateItems = targetPlate.querySelector('.plate-items');
      if (plateItems) {
        const newItem = originalItem.cloneNode(true);
        newItem.style.visibility = 'visible';
        newItem.style.fontSize = '16px'; // 适应盒子内的大小
        newItem.style.transition = 'none'; // 移除transition避免干扰
        plateItems.appendChild(newItem);
      }

      // 清理飞行元素
      if (flyingItem && flyingItem.parentNode) {
        flyingItem.parentNode.removeChild(flyingItem);
      }

      console.log('🚀 分配动画完成并清理');

    } catch (cleanupError) {
      console.error('分配动画清理出错:', cleanupError);
    }
  }

  /**
   * 显示提示文案并恢复状态
   */
  async showHintMessage() {
    try {
      console.log('💬 显示除法提示文案...');

      // 获取提示文案（使用动态模板）
      const containerName = this.currentItemType.containerName;
      const itemName = this.currentItemType.item.name;
      const hintText = `小朋友，请数一数现在每个${containerName}里面有几个${itemName}吧？`;

      console.log('提示文案:', hintText);

      // 创建提示文案显示元素
      const hintMessageElement = this.createHintMessageElement(hintText);

      // 显示提示文案
      await this.displayHintMessage(hintMessageElement);

      console.log('💬 除法提示文案显示完成');

    } catch (error) {
      console.error('显示除法提示文案出错:', error);
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
    hintElement.className = 'division-hint-message';
    hintElement.textContent = hintText;

    // 设置样式
    hintElement.style.cssText = `
      position: absolute;
      top: 480px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #FF1493, #FF69B4);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      text-align: center;
      box-shadow: 0 8px 25px rgba(255, 20, 147, 0.3);
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
        const sceneContainer = document.querySelector('.party-scene');
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

        console.log('💬 除法提示文案已显示，3秒后自动消失');

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
              console.log('💬 除法提示文案已移除');
              resolve();
            } catch (cleanupError) {
              console.error('除法提示文案清理出错:', cleanupError);
              resolve();
            }
          }, 500); // 退出动画时长

        }, 3000); // 显示3秒

      } catch (error) {
        console.error('显示除法提示文案出错:', error);
        resolve();
      }
    });
  }

  /**
   * 计算动态布局位置
   * @param {number} plateCount - 盘子数量
   * @param {Object} plateLayout - 盘子布局信息
   * @param {number} totalCakes - 蛋糕总数
   * @returns {Object} 动态布局信息
   */
  calculateDynamicLayout(plateCount, plateLayout, totalCakes) {
    // 根据盘子数量和布局计算所需的垂直空间
    // 获取实际的盒子尺寸（与calculatePlateSize保持一致）
    const plateSize = this.calculatePlateSize(plateCount);
    const plateHeight = plateSize.height;  // 使用实际的盒子高度
    const plateSpacing = 20;
    const verticalSpacing = 20;  // 盒子间垂直间距
    const totalPlateHeight = plateLayout.rows * plateHeight + (plateLayout.rows - 1) * plateSpacing;

    // 固定区域位置
    const numberDragTop = 100;  // 数字拖拽区固定位置，与其他场景一致
    const cakeTrayTop = 180;    // 蛋糕托盘固定位置
    const plateBaseY = 200;     // 盘子基础位置

    // 计算盘子区域的实际占用高度（考虑容器偏移和标题高度）
    // 最后一行盒子的位置：plateBaseY + (rows-1) * (plateHeight + verticalSpacing)
    // 容器实际top：position.y - 20
    // 容器高度：plateHeight + 25（包含标题）
    const lastRowY = plateBaseY + (plateLayout.rows - 1) * (plateHeight + verticalSpacing);
    const actualContainerTop = lastRowY - 20;  // 容器向上偏移20px
    const containerHeight = plateHeight + 25;  // 容器高度包含25px标题空间
    const plateAreaBottom = actualContainerTop + containerHeight;

    // 动态紧凑布局：各区域紧挨排列
    const minGap = 15;               // 区域间最小间距
    const questionAreaHeight = 60;   // 问题区域高度
    const answerAreaHeight = 80;     // 答案区域高度
    const bottomMargin = 20;         // 底部边距

    // 计算托盘区域的实际高度（考虑CSS Grid的gap）
    const itemsPerRow = 9;           // 每行9个元素
    const itemSize = 24;             // 每个元素大小（与CSS font-size: 24px匹配）
    const trayPadding = 20;          // 托盘内边距（padding: 10px * 2）
    const rowGap = 6;                // CSS gap的垂直间距
    const trayRows = Math.ceil(totalCakes / itemsPerRow);
    // 托盘高度 = 行数 * 元素高度 + (行数-1) * 行间距 + 内边距
    const trayHeight = trayRows * itemSize + (trayRows - 1) * rowGap + trayPadding;
    const trayBottom = cakeTrayTop + trayHeight;

    // 调试信息：输出关键计算值
    console.log('🔍 除法场景布局计算调试信息:');
    console.log(`  托盘: top=${cakeTrayTop}px, height=${trayHeight}px, bottom=${trayBottom}px`);
    console.log(`  托盘详情: ${totalCakes}个物品, ${trayRows}行, 每行${itemsPerRow}个, 元素大小${itemSize}px`);
    console.log(`  盒子: baseY=${plateBaseY}px, rows=${plateLayout.rows}, height=${plateHeight}px, bottom=${plateAreaBottom}px`);
    console.log(`  盒子详情: ${plateCount}个盒子, 实际尺寸${plateSize.width}x${plateSize.height}px, lastRowY=${plateBaseY + (plateLayout.rows - 1) * (plateHeight + verticalSpacing)}px`);

    // 取托盘区域和盒子区域的最大底部位置
    const maxBottom = Math.max(trayBottom, plateAreaBottom);
    console.log(`  最大底部位置: ${maxBottom}px (托盘=${trayBottom}px, 盒子=${plateAreaBottom}px)`);

    // 问题区域位于托盘和盒子区域下方
    const questionTop = maxBottom + minGap;

    // 答案区域紧挨问题区域下方
    const answerTop = questionTop + questionAreaHeight + minGap;

    console.log(`  问题区域: top=${questionTop}px`);
    console.log(`  答案区域: top=${answerTop}px`);

    // 容器高度根据内容动态计算
    const minContainerHeight = answerTop + answerAreaHeight + bottomMargin;

    console.log(`动态布局计算: 盘子${plateCount}个, 布局${plateLayout.rows}行, 盘子区域高度${totalPlateHeight}px, 题目位置${questionTop}px, 答案位置${answerTop}px, 建议容器高度${minContainerHeight}px`);

    return {
      numberDragTop,
      cakeTrayTop,
      plateBaseY,
      questionTop,
      answerTop,
      totalPlateHeight,
      plateAreaBottom,
      minContainerHeight
    };
  }

  /**
   * 计算盘子布局（行列数）
   * @param {number} plateCount - 盘子数量
   * @returns {Object} 布局信息 {rows, cols}
   */
  calculatePlateLayout(plateCount) {
    if (plateCount <= 3) {
      return { rows: 1, cols: plateCount };
    } else if (plateCount <= 6) {
      return { rows: 2, cols: 3 };
    } else if (plateCount <= 9) {
      return { rows: 3, cols: 3 };
    } else {
      return { rows: Math.ceil(plateCount / 4), cols: 4 };
    }
  }

  /**
   * 计算盘子尺寸（进一步增大尺寸以容纳更多元素）
   * @param {number} plateCount - 盘子数量
   * @returns {Object} 尺寸信息 {width, height}
   */
  calculatePlateSize(plateCount) {
    if (plateCount <= 3) {
      return { width: 180, height: 160 }; // 大尺寸，再增大20px
    } else if (plateCount <= 6) {
      return { width: 160, height: 140 }; // 中等尺寸，再增大20px
    } else {
      return { width: 140, height: 120 }; // 紧凑尺寸，再增大20px
    }
  }

  /**
   * 计算盘子位置（减小间距，防止重叠）
   * @param {number} index - 盘子索引
   * @param {Object} layout - 布局信息
   * @param {Object} plateSize - 盘子尺寸
   * @param {Object} dynamicLayout - 动态布局信息
   * @returns {Object} 位置信息 {x, y}
   */
  calculatePlatePosition(index, layout, plateSize, dynamicLayout) {
    const row = Math.floor(index / layout.cols);
    const col = index % layout.cols;

    // 动态调整水平间距，防止重叠
    const horizontalSpacing = layout.cols <= 3 ? 25 : 18; // 大幅减小间距
    const verticalSpacing = 20;   // 减小垂直间距，避免重叠
    const baseX = 80;             // 基础右边距
    const baseY = dynamicLayout.plateBaseY; // 使用动态计算的基础位置

    // 计算位置（从右边开始排列）
    const x = baseX + col * (plateSize.width + horizontalSpacing);
    const y = baseY + row * (plateSize.height + verticalSpacing);

    return { x, y };
  }

  /**
   * 计算视觉序号（从左到右递增）
   * @param {number} index - 循环索引
   * @param {Object} layout - 布局信息
   * @returns {number} 视觉序号
   */
  calculateVisualIndex(index, layout) {
    const row = Math.floor(index / layout.cols);
    const col = index % layout.cols;

    // 由于使用right定位，同一行内的盒子从右到左排列
    // 需要反转列序号，使序号从左到右递增
    const reversedCol = layout.cols - 1 - col;
    const visualIndex = row * layout.cols + reversedCol + 1;

    return visualIndex;
  }

  /**
   * 根据视觉序号获取DOM索引
   * @param {number} visualIndex - 视觉序号（1开始）
   * @param {Object} layout - 布局信息
   * @returns {number} DOM索引（0开始）
   */
  getDOMIndexFromVisualIndex(visualIndex, layout) {
    // 将视觉序号转换为0开始的索引
    const zeroBasedVisualIndex = visualIndex - 1;

    // 计算行和列
    const row = Math.floor(zeroBasedVisualIndex / layout.cols);
    const visualCol = zeroBasedVisualIndex % layout.cols;

    // 反转列序号得到DOM列序号
    const domCol = layout.cols - 1 - visualCol;

    // 计算DOM索引
    const domIndex = row * layout.cols + domCol;

    return domIndex;
  }

  /**
   * 初始化物品托盘拖拽目标（可以从盘子拖回）
   * @param {HTMLElement} tray - 物品托盘元素
   * @param {Object} itemType - 物品类型信息
   */
  initItemTrayDropTarget(tray, itemType) {
    tray.addEventListener('dragover', (e) => {
      e.preventDefault();
      tray.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
    });

    tray.addEventListener('dragleave', (e) => {
      tray.style.backgroundColor = '#FFD700';
    });

    tray.addEventListener('drop', (e) => {
      e.preventDefault();

      const itemId = e.dataTransfer.getData('text/plain');
      const itemElement = document.getElementById(itemId);

      if (itemElement && itemElement.classList.contains('plate-item')) {
        // 创建新的托盘物品元素
        const trayItem = document.createElement('div');
        trayItem.className = 'draggable-cake';
        trayItem.draggable = true;
        trayItem.dataset.value = '1';
        trayItem.dataset.type = 'cake';
        trayItem.id = `cake-${Date.now()}-${Math.random()}`;
        trayItem.style.cssText = `
          font-size: 24px;
          cursor: grab;
          transition: transform 0.2s ease;
          user-select: none;
        `;
        trayItem.textContent = itemType.item.icon;

        // 添加拖拽事件
        this.addCakeDragEvents(trayItem);

        // 添加到托盘中
        tray.appendChild(trayItem);

        // 移除原元素
        itemElement.remove();

        // 检查是否完成平均分配
        this.checkEqualDistribution();
      }

      // 重置样式
      tray.style.backgroundColor = '#FFD700';
    });
  }

  /**
   * 初始化自由拖拽的盘子目标（无数量限制）
   * @param {HTMLElement} plate - 盘子元素
   */
  initFreePlateDropTarget(plate) {
    const plateItemsContainer = plate.querySelector('.plate-items');

    plate.addEventListener('dragover', (e) => {
      e.preventDefault();
      plate.style.borderColor = '#FFD700';
      plate.style.backgroundColor = 'rgba(255,215,0,0.1)';
    });

    plate.addEventListener('dragleave', (e) => {
      plate.style.borderColor = '#FF1493';
      plate.style.backgroundColor = '';
    });

    plate.addEventListener('drop', (e) => {
      e.preventDefault();

      const itemId = e.dataTransfer.getData('text/plain');
      const itemElement = document.getElementById(itemId);

      if (itemElement && (itemElement.classList.contains('draggable-cake') || itemElement.classList.contains('plate-item'))) {
        // 创建新的盘子内物品元素
        const plateItem = document.createElement('div');
        plateItem.className = 'plate-item';
        plateItem.draggable = true;
        plateItem.id = `plate-item-${Date.now()}-${Math.random()}`;
        plateItem.style.cssText = `
          font-size: 18px;
          cursor: grab;
          user-select: none;
          transition: transform 0.2s ease;
        `;
        plateItem.textContent = itemElement.textContent;

        // 添加拖拽事件（可以从盘子中再次拖出）
        this.addPlateItemDragEvents(plateItem);

        // 添加到盘子的物品容器中
        plateItemsContainer.appendChild(plateItem);

        // 移除原元素
        itemElement.remove();

        // 检查是否完成平均分配
        this.checkEqualDistribution();
      }

      // 重置样式
      plate.style.borderColor = '#FF1493';
      plate.style.backgroundColor = '';
    });
  }

  /**
   * 为盘子内的物品添加拖拽事件
   * @param {HTMLElement} plateItem - 盘子内的物品元素
   */
  addPlateItemDragEvents(plateItem) {
    plateItem.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', plateItem.id);
      plateItem.style.opacity = '0.5';
    });

    plateItem.addEventListener('dragend', (e) => {
      plateItem.style.opacity = '1';
    });
  }

  /**
   * 检查是否完成平均分配
   */
  checkEqualDistribution() {
    const plates = document.querySelectorAll('.party-plate');
    const counts = [];
    let totalItems = 0;

    // 统计每个盘子中的物品数量
    plates.forEach(plate => {
      const plateItems = plate.querySelectorAll('.plate-item');
      const count = plateItems.length;
      counts.push(count);
      totalItems += count;
    });

    // 检查是否所有盘子数量相等且总数正确
    const allEqual = counts.length > 0 && counts.every(count => count === counts[0] && count > 0);
    const totalCorrect = totalItems === (this.sceneManager.currentScene?.question?.num1 || 0);

    if (allEqual && totalCorrect) {
      if (!this.sceneManager.currentScene || !this.sceneManager.currentScene.question) return;

      const question = this.sceneManager.currentScene.question;
      const answer = counts[0]; // 每个盘子的数量就是答案

      // 显示成功提示
      setTimeout(() => {
        const questionText = document.querySelector('.question-text');
        if (questionText) {
          questionText.innerHTML = `
            <div style="color: #4CAF50;">🎉 平均分配完成！</div>
            <div style="font-size: 16px; margin-top: 10px;">${question.num1} ÷ ${question.num2} = ${answer}</div>
            <div style="font-size: 14px; color: #666; margin-top: 5px;">每个容器都有 ${answer} 个</div>
          `;
        }

        // 自动提交答案
        if (window.app) {
          window.app.submitAnswer(answer);
        }
      }, 500);
    }
  }

  /**
   * 调整容器高度以适应内容
   * @param {HTMLElement} container - 容器
   * @param {number} minHeight - 最小高度
   */
  adjustContainerHeight(container, minHeight) {
    // 调整场景容器的高度
    const sceneContainer = container.closest('.scene-container') || container;

    // 始终使用计算的最小高度，避免多余空白
    sceneContainer.style.minHeight = minHeight + 'px';
    sceneContainer.style.height = 'auto';
    console.log(`容器高度调整: 设置为${minHeight}px`);
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
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PartyScene;
}
