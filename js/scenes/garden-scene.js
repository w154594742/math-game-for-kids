/**
 * 乘法场景类 - 花园场景
 * 实现乘法运算的可视化学习场景
 */

class GardenScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);
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

    // 为容器添加乘法场景类名
    container.classList.add('garden-scene');

    // 创建标题区域（在数字拖拽区上方）
    this.createTitleHeader(container);

    // 随机选择物品类型（使用SceneManager中的旧方法）
    const itemType = this.sceneManager.getRandomMultiplicationItem();
    console.log('乘法场景选择的物品类型:', itemType);
    
    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
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
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GardenScene;
}
