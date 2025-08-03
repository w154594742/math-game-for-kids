/**
 * 除法场景类 - 派对场景
 * 实现除法运算的可视化学习场景
 */

class PartyScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);
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

    // 为容器添加除法场景类名
    container.classList.add('party-scene');

    // 随机选择物品类型
    const itemType = this.itemsConfig.getRandomDivisionItem();
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
      plateTitle.textContent = `${itemType.containerName}${i + 1}`;

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
