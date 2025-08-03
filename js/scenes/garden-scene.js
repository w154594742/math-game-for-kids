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

    // 创建题目文字
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      position: absolute;
      top: 450px;
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

    // 创建乘法容器
    this.sceneManager.createContainersDisplay(container, containerCount, itemsPerContainer, itemType);

    // 创建答案拖拽区
    this.createAnswerDropArea(container, totalItems, 520);

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
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GardenScene;
}
