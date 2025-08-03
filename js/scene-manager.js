/**
 * 场景管理器 - 负责游戏场景的渲染和管理
 * 处理四种不同的数学运算场景
 */

class SceneManager {
  constructor() {
    this.currentScene = null;
    this.sceneConfig = {
      addition: 'shopping',
      subtraction: 'sharing',
      multiplication: 'garden',
      division: 'party'
    };

    // 场景元素缓存
    this.sceneElements = new Map();

    // 初始化配置（在场景类之前）
    this.itemsConfig = new SceneItemsConfig();

    // 初始化场景类（传递共享配置）
    try {
      console.log('开始初始化场景类...');
      this.scenes = {
        shopping: new ShoppingScene(this, this.itemsConfig),
        sharing: new SharingScene(this, this.itemsConfig),
        garden: new GardenScene(this, this.itemsConfig),
        party: new PartyScene(this, this.itemsConfig)
      };
      console.log('场景类初始化完成:', this.scenes);

      // 检查场景类是否有render方法
      Object.keys(this.scenes).forEach(key => {
        const scene = this.scenes[key];
        console.log(`${key}场景:`, scene, '有render方法:', typeof scene.render === 'function');
      });
    } catch (error) {
      console.error('场景类初始化失败:', error);
      this.scenes = {};
    }




    // 学习伙伴配置
    this.characters = {
      bear: { icon: '🐻', name: '小熊' },
      cat: { icon: '🐱', name: '小猫' },
      rabbit: { icon: '🐰', name: '小兔' }
    };

    // 乘法场景物品类型配置（丰富的随机性）
    this.multiplicationItems = [
      // 水果系列
      { container: '🧺', containerName: '篮子', item: '🍎', itemName: '苹果' },
      { container: '🧺', containerName: '篮子', item: '🍓', itemName: '草莓' },
      { container: '🧺', containerName: '篮子', item: '🍇', itemName: '葡萄' },
      { container: '🧺', containerName: '篮子', item: '🍊', itemName: '橙子' },
      { container: '🧺', containerName: '篮子', item: '🍌', itemName: '香蕉' },

      // 玩具系列
      { container: '📦', containerName: '盒子', item: '🧸', itemName: '玩具熊' },
      { container: '📦', containerName: '盒子', item: '🚗', itemName: '小汽车' },
      { container: '📦', containerName: '盒子', item: '⚽', itemName: '足球' },
      { container: '📦', containerName: '盒子', item: '🎲', itemName: '骰子' },
      { container: '📦', containerName: '盒子', item: '🪀', itemName: '悠悠球' },

      // 食物系列
      { container: '🎁', containerName: '礼盒', item: '🍪', itemName: '饼干' },
      { container: '🎁', containerName: '礼盒', item: '🧁', itemName: '纸杯蛋糕' },
      { container: '🎁', containerName: '礼盒', item: '🍬', itemName: '糖果' },
      { container: '🎁', containerName: '礼盒', item: '🍭', itemName: '棒棒糖' },
      { container: '🎁', containerName: '礼盒', item: '🥨', itemName: '椒盐卷饼' },

      // 学习用品系列
      { container: '👜', containerName: '袋子', item: '✏️', itemName: '铅笔' },
      { container: '👜', containerName: '袋子', item: '📚', itemName: '书本' },
      { container: '👜', containerName: '袋子', item: '🖍️', itemName: '蜡笔' },
      { container: '👜', containerName: '袋子', item: '📝', itemName: '笔记本' },
      { container: '👜', containerName: '袋子', item: '🎨', itemName: '画笔' },

      // 花朵系列
      { container: '🪣', containerName: '花盆', item: '🌸', itemName: '樱花' },
      { container: '🪣', containerName: '花盆', item: '🌻', itemName: '向日葵' },
      { container: '🪣', containerName: '花盆', item: '🌷', itemName: '郁金香' },
      { container: '🪣', containerName: '花盆', item: '🌹', itemName: '玫瑰' },
      { container: '🪣', containerName: '花盆', item: '🌺', itemName: '木槿花' }
    ];

    // 加法场景物品类型配置（丰富的随机性）
    this.additionItems = [
      // 水果系列
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        items: [
          { icon: '🍎', name: '苹果' },
          { icon: '🍊', name: '橙子' }
        ]
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        items: [
          { icon: '🍓', name: '草莓' },
          { icon: '🍇', name: '葡萄' }
        ]
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        items: [
          { icon: '🍌', name: '香蕉' },
          { icon: '🥝', name: '猕猴桃' }
        ]
      },

      // 蔬菜系列
      {
        container: '🥬',
        containerName: '菜篮',
        theme: '蔬菜',
        items: [
          { icon: '🥕', name: '胡萝卜' },
          { icon: '🥒', name: '黄瓜' }
        ]
      },
      {
        container: '🥬',
        containerName: '菜篮',
        theme: '蔬菜',
        items: [
          { icon: '🍅', name: '番茄' },
          { icon: '🥬', name: '白菜' }
        ]
      },
      {
        container: '🥬',
        containerName: '菜篮',
        theme: '蔬菜',
        items: [
          { icon: '🌽', name: '玉米' },
          { icon: '🥔', name: '土豆' }
        ]
      },

      // 玩具系列
      {
        container: '📦',
        containerName: '玩具盒',
        theme: '玩具',
        items: [
          { icon: '🧸', name: '玩具熊' },
          { icon: '🚗', name: '小汽车' }
        ]
      },
      {
        container: '📦',
        containerName: '玩具盒',
        theme: '玩具',
        items: [
          { icon: '⚽', name: '足球' },
          { icon: '🏀', name: '篮球' }
        ]
      },
      {
        container: '📦',
        containerName: '玩具盒',
        theme: '玩具',
        items: [
          { icon: '🎲', name: '骰子' },
          { icon: '🪀', name: '悠悠球' }
        ]
      },

      // 学习用品系列
      {
        container: '👜',
        containerName: '书包',
        theme: '学习用品',
        items: [
          { icon: '📚', name: '书本' },
          { icon: '✏️', name: '铅笔' }
        ]
      },
      {
        container: '👜',
        containerName: '书包',
        theme: '学习用品',
        items: [
          { icon: '🖍️', name: '蜡笔' },
          { icon: '📝', name: '笔记本' }
        ]
      },
      {
        container: '👜',
        containerName: '书包',
        theme: '学习用品',
        items: [
          { icon: '🎨', name: '画笔' },
          { icon: '📐', name: '尺子' }
        ]
      },

      // 食物系列
      {
        container: '🎁',
        containerName: '礼盒',
        theme: '食物',
        items: [
          { icon: '🍪', name: '饼干' },
          { icon: '🧁', name: '纸杯蛋糕' }
        ]
      },
      {
        container: '🎁',
        containerName: '礼盒',
        theme: '食物',
        items: [
          { icon: '🍬', name: '糖果' },
          { icon: '🍭', name: '棒棒糖' }
        ]
      },
      {
        container: '🎁',
        containerName: '礼盒',
        theme: '食物',
        items: [
          { icon: '🥨', name: '椒盐卷饼' },
          { icon: '🍩', name: '甜甜圈' }
        ]
      },

      // 花朵系列
      {
        container: '🪣',
        containerName: '花盆',
        theme: '花朵',
        items: [
          { icon: '🌸', name: '樱花' },
          { icon: '🌻', name: '向日葵' }
        ]
      },
      {
        container: '🪣',
        containerName: '花盆',
        theme: '花朵',
        items: [
          { icon: '🌷', name: '郁金香' },
          { icon: '🌹', name: '玫瑰' }
        ]
      },
      {
        container: '🪣',
        containerName: '花盆',
        theme: '花朵',
        items: [
          { icon: '🌺', name: '木槿花' },
          { icon: '🌼', name: '雏菊' }
        ]
      }
    ];

    // 除法场景物品类型配置（生活化场景）
    this.divisionItems = [
      // 聚会食物系列
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '聚会食物',
        item: { icon: '🎂', name: '蛋糕' },
        scenario: '聚会分享',
        questionTemplate: '{character}准备了{total}个{itemName}，要平均分给{plateCount}个小朋友，每个小朋友能分到几个{itemName}？'
      },
      {
        container: '👜',
        containerName: '袋子',
        theme: '聚会食物',
        item: { icon: '🍬', name: '糖果' },
        scenario: '聚会分享',
        questionTemplate: '{character}买了{total}颗{itemName}，要平均装进{plateCount}个袋子里，每个袋子装几颗{itemName}？'
      },
      {
        container: '🎁',
        containerName: '礼盒',
        theme: '聚会食物',
        item: { icon: '🍪', name: '饼干' },
        scenario: '聚会分享',
        questionTemplate: '奶奶做了{total}块{itemName}，要平均分给{plateCount}个小朋友，每个小朋友能吃几块{itemName}？'
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '聚会食物',
        item: { icon: '🧁', name: '纸杯蛋糕' },
        scenario: '聚会分享',
        questionTemplate: '{character}做了{total}个{itemName}，要平均装进{plateCount}个篮子，每个篮子装几个{itemName}？'
      },
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '聚会食物',
        item: { icon: '🍭', name: '棒棒糖' },
        scenario: '聚会分享',
        questionTemplate: '{character}买了{total}个{itemName}，要平均分给{plateCount}个小朋友，每个小朋友能得到几个{itemName}？'
      },

      // 水果系列
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '水果',
        item: { icon: '🍎', name: '苹果' },
        scenario: '用餐分配',
        questionTemplate: '妈妈买了{total}个{itemName}，要平均分给{plateCount}个盘子，每个盘子放几个{itemName}？'
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        item: { icon: '🍊', name: '橙子' },
        scenario: '用餐分配',
        questionTemplate: '{character}摘了{total}个{itemName}，要平均装进{plateCount}个篮子，每个篮子装几个{itemName}？'
      },
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '水果',
        item: { icon: '🍓', name: '草莓' },
        scenario: '用餐分配',
        questionTemplate: '{character}采了{total}个{itemName}，要平均分给{plateCount}个盘子，每个盘子放几个{itemName}？'
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        item: { icon: '🍇', name: '葡萄' },
        scenario: '用餐分配',
        questionTemplate: '爷爷摘了{total}串{itemName}，要平均装进{plateCount}个篮子，每个篮子装几串{itemName}？'
      },
      {
        container: '🍽️',
        containerName: '盘子',
        theme: '水果',
        item: { icon: '🍌', name: '香蕉' },
        scenario: '用餐分配',
        questionTemplate: '{character}买了{total}根{itemName}，要平均分给{plateCount}个盘子，每个盘子放几根{itemName}？'
      },
      {
        container: '🧺',
        containerName: '篮子',
        theme: '水果',
        item: { icon: '🥝', name: '猕猴桃' },
        scenario: '用餐分配',
        questionTemplate: '{character}买了{total}个{itemName}，要平均装进{plateCount}个篮子，每个篮子装几个{itemName}？'
      }
    ];

    // 场景视觉配置（重命名以避免与场景类实例冲突）
    this.sceneConfigs = {
      shopping: {
        name: '快乐购物',
        background: 'linear-gradient(135deg, #FFE5B4, #FFCC99)',
        icon: '🛒',
        description: '在商店里购买物品'
      },
      sharing: {
        name: '分享时光',
        background: 'linear-gradient(135deg, #E5F3FF, #B3D9FF)',
        icon: '🍪',
        description: '和朋友分享食物'
      },
      garden: {
        name: '花园种植',
        background: 'linear-gradient(135deg, #E5FFE5, #B3FFB3)',
        icon: '🌸',
        description: '在花园里种植花朵'
      },
      party: {
        name: '公平分享',
        background: 'linear-gradient(135deg, #FFE5F1, #FFB3D9)',
        icon: '🎂',
        description: '在派对上分享蛋糕'
      }
    };
  }

  /**
   * 获取当前选择的学习伙伴信息
   * @returns {Object} 学习伙伴信息
   */
  getSelectedCharacter() {
    // 尝试从UIManager获取选择的角色
    if (window.app && window.app.uiManager && window.app.uiManager.selectedCharacter) {
      const characterKey = window.app.uiManager.selectedCharacter;
      return this.characters[characterKey] || this.characters.bear; // 默认小熊
    }

    // 尝试从localStorage获取
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter && this.characters[savedCharacter]) {
      return this.characters[savedCharacter];
    }

    // 默认返回小熊
    return this.characters.bear;
  }

  /**
   * 随机选择一种减法物品类型
   * @returns {Object} 减法物品类型信息
   */
  getRandomSubtractionItem() {
    const randomIndex = Math.floor(Math.random() * this.subtractionItems.length);
    return this.subtractionItems[randomIndex];
  }

  /**
   * 随机选择一种除法物品类型
   * @returns {Object} 除法物品类型信息
   */
  getRandomDivisionItem() {
    const randomIndex = Math.floor(Math.random() * this.divisionItems.length);
    return this.divisionItems[randomIndex];
  }

  /**
   * 随机选择一种乘法物品类型
   * @returns {Object} 乘法物品类型信息
   */
  getRandomMultiplicationItem() {
    const randomIndex = Math.floor(Math.random() * this.multiplicationItems.length);
    return this.multiplicationItems[randomIndex];
  }

  /**
   * 随机选择一种加法物品类型组合
   * @returns {Object} 加法物品类型信息
   */
  getRandomAdditionItem() {
    const randomIndex = Math.floor(Math.random() * this.additionItems.length);
    return this.additionItems[randomIndex];
  }

  /**
   * 加载场景
   * @param {string} operationType - 运算类型
   * @param {Object} question - 题目对象
   * @returns {Promise} 场景加载完成的Promise
   */
  async loadScene(operationType, question) {
    const sceneType = this.sceneConfig[operationType];
    if (!sceneType) {
      console.error('未知的运算类型:', operationType);
      return Promise.reject(new Error('未知的运算类型'));
    }

    try {
      // 清理当前场景
      this.clearCurrentScene();
      
      // 渲染新场景
      await this.renderScene(sceneType, question);
      
      this.currentScene = {
        type: sceneType,
        operationType: operationType,
        question: question
      };
      
      console.log(`场景加载完成: ${sceneType}`);
      return Promise.resolve();
      
    } catch (error) {
      console.error('场景加载失败:', error);
      return Promise.reject(error);
    }
  }

  /**
   * 渲染场景
   * @param {string} sceneType - 场景类型
   * @param {Object} question - 题目对象
   */
  async renderScene(sceneType, question) {
    const sceneContainer = document.getElementById('scene-container');
    if (!sceneContainer) {
      throw new Error('场景容器未找到');
    }

    // 清空容器
    sceneContainer.innerHTML = '';

    // 设置当前场景信息
    this.currentScene = {
      type: sceneType,
      question: question,
      container: sceneContainer
    };

    try {
      // 使用场景类渲染
      console.log('尝试获取场景类:', sceneType, '可用场景:', Object.keys(this.scenes));
      const scene = this.scenes[sceneType];
      console.log('获取到的场景对象:', scene);

      if (!scene) {
        throw new Error(`未找到场景类: ${sceneType}`);
      }

      console.log('场景对象类型:', typeof scene, '有render方法:', typeof scene.render === 'function');
      if (typeof scene.render !== 'function') {
        throw new Error(`场景类 ${sceneType} 没有render方法`);
      }

      await scene.render(sceneContainer, question);
      console.log(`场景渲染完成: ${sceneType}`, question);
    } catch (error) {
      console.error('场景渲染失败:', error);
      throw error;
    }
  }

  /**
   * 渲染场景背景
   * @param {string} sceneType - 场景类型
   * @param {HTMLElement} container - 容器元素
   */
  renderBackground(sceneType, container) {
    const sceneConfig = this.sceneConfigs[sceneType];
    if (!sceneConfig) return;

    // 设置背景
    container.style.background = sceneConfig.background;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    // 添加游戏标题到场景顶部
    this.addGameTitle(container);
  }

  /**
   * 添加游戏标题到场景顶部
   * @param {HTMLElement} container - 容器
   */
  addGameTitle(container) {
    const titleHeader = document.createElement('header');
    titleHeader.className = 'scene-game-header';
    titleHeader.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255,255,255,0.95);
      padding: 15px 20px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 5;
      border-bottom: 3px solid #4CAF50;
    `;

    const title = document.createElement('h1');
    title.style.cssText = `
      margin: 0;
      font-size: 24px;
      color: #333;
      font-weight: bold;
    `;
    title.textContent = '🎮 趣味数学小天地';

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.style.cssText = `
      margin: 5px 0 0 0;
      font-size: 14px;
      color: #666;
      font-weight: normal;
    `;
    subtitle.textContent = '在游戏中快乐学习数学！';

    titleHeader.appendChild(title);
    titleHeader.appendChild(subtitle);
    container.appendChild(titleHeader);
  }

  /**
   * 渲染购物场景 - 加法概念：随机物品 + 数字拖拽答题
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async renderShoppingScene(container, question) {
    const num1 = question.num1;
    const num2 = question.num2;
    const answer = question.answer;

    // 随机选择物品类型组合
    const itemGroup = this.getRandomAdditionItem();
    console.log('加法场景选择的物品组合:', itemGroup);

    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    console.log('加法场景选择的学习伙伴:', character);

    // 创建数字拖拽区（顶部）
    this.createNumberDragArea(container);

    // 创建左边容器（第一种物品）
    const leftBasket = this.createAdaptiveBasket('left', num1, itemGroup.items[0], itemGroup);
    container.appendChild(leftBasket);

    // 创建右边容器（第二种物品）
    const rightBasket = this.createAdaptiveBasket('right', num2, itemGroup.items[1], itemGroup);
    container.appendChild(rightBasket);

    // 创建中间题目（下移，避免重叠）
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      position: absolute;
      top: 400px;
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
      border: 2px solid #FFD700;
      z-index: 5;
      max-width: 500px;
      line-height: 1.4;
    `;
    questionText.innerHTML = `${character.name}收集了${num1}个${itemGroup.items[0].name}和${num2}个${itemGroup.items[1].name}，总共收集了多少个${itemGroup.theme}？`;
    container.appendChild(questionText);

    // 创建结果放置区（固定在题目下方）
    this.createAnswerDropArea(container, answer, 480);

    // 添加商店装饰
    this.addShoppingDecorations(container);
  }

  /**
   * 创建数字拖拽区
   * @param {HTMLElement} container - 容器
   * @param {number} topPosition - 可选的顶部位置，默认100px
   */
  createNumberDragArea(container, topPosition = 100) {
    const numberArea = document.createElement('div');
    numberArea.className = 'number-drag-area';
    numberArea.style.cssText = `
      position: absolute;
      top: ${topPosition}px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      background: rgba(255,255,255,0.95);
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10;
      border: 2px solid #2196F3;
    `;

    // 创建0-9数字
    for (let i = 0; i <= 9; i++) {
      const numberBox = document.createElement('div');
      numberBox.className = 'draggable-number';
      numberBox.draggable = true;
      numberBox.dataset.number = i;
      numberBox.textContent = i;

      numberBox.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        cursor: grab;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        user-select: none;
      `;

      // 添加拖拽事件
      this.addNumberDragEvents(numberBox);

      numberArea.appendChild(numberBox);
    }

    container.appendChild(numberArea);
  }

  /**
   * 创建水果篮
   * @param {string} position - 位置 (left/right)
   * @param {number} count - 水果数量
   * @param {string} fruit - 水果图标
   * @param {string} label - 标签
   * @returns {HTMLElement} 篮子元素
   */
  createFruitBasket(position, count, fruit, label) {
    const basket = document.createElement('div');
    basket.className = `fruit-basket basket-${position}`;

    // 根据水果数量动态调整篮子大小
    const minWidth = 150;
    const minHeight = 120;
    const maxFruitsPerRow = 5;
    const rows = Math.ceil(count / maxFruitsPerRow);
    const cols = Math.min(count, maxFruitsPerRow);

    const basketWidth = Math.max(minWidth, cols * 30 + 40);
    const basketHeight = Math.max(minHeight, rows * 30 + 60);

    const leftPos = position === 'left' ? '80px' : 'auto';
    const rightPos = position === 'right' ? '80px' : 'auto';

    basket.style.cssText = `
      position: absolute;
      top: 180px;
      ${position === 'left' ? 'left' : 'right'}: ${position === 'left' ? leftPos : rightPos};
      width: ${basketWidth}px;
      height: ${Math.min(basketHeight, 150)}px;
      background: #8B4513;
      border-radius: 12px 12px 4px 4px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      overflow: hidden;
    `;

    // 篮子标签
    const basketLabel = document.createElement('div');
    basketLabel.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: white;
      margin-bottom: 10px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    `;
    basketLabel.textContent = label;
    basket.appendChild(basketLabel);

    // 水果容器（智能布局）
    const fruitContainer = document.createElement('div');

    // 智能计算网格布局
    let gridCols;
    if (count <= 4) {
      gridCols = Math.min(count, 2); // 1-4个水果，最多2列
    } else if (count <= 9) {
      gridCols = 3; // 5-9个水果，3列
    } else {
      gridCols = 4; // 10+个水果，4列
    }

    fruitContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${gridCols}, 1fr);
      gap: 3px;
      justify-items: center;
      align-items: center;
      width: 100%;
      flex: 1;
      padding: 5px;
      max-height: 100px;
      overflow: hidden;
    `;

    // 创建水果（仅展示，不可拖拽）
    // 根据水果数量调整字体大小
    const fontSize = count <= 4 ? 22 : count <= 9 ? 18 : 16;

    for (let i = 0; i < count; i++) {
      const fruitElement = document.createElement('div');
      fruitElement.style.cssText = `
        font-size: ${fontSize}px;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        line-height: 1;
      `;
      fruitElement.textContent = fruit;
      fruitContainer.appendChild(fruitElement);
    }

    basket.appendChild(fruitContainer);
    return basket;
  }

  /**
   * 创建自适应篮子（用于加法场景）
   * @param {HTMLElement} container - 容器
   * @param {string} position - 位置 (left/right)
   * @param {number} count - 物品数量
   * @param {Object} item - 物品信息 {icon, name}
   * @param {Object} itemGroup - 物品组合信息
   */
  createAdaptiveBasket(container, position, count, item, itemGroup) {
    const basket = document.createElement('div');
    basket.className = `adaptive-basket basket-${position}`;

    // 计算自适应高度和宽度
    const itemsPerRow = 10; // 固定每行10个
    const rows = Math.ceil(count / itemsPerRow);
    const baseHeight = 70; // 标签和内边距（增加）
    const rowHeight = 22;   // 每行高度（稍微减少）
    const containerHeight = baseHeight + (rows * rowHeight);

    // 计算宽度（确保能容纳10个物品）
    const minWidth = 280; // 增加最小宽度
    const itemWidth = 22; // 减少单个物品宽度
    const padding = 20; // 内边距
    const gap = 2; // 间距
    const basketWidth = Math.max(minWidth, itemsPerRow * itemWidth + (itemsPerRow - 1) * gap + padding * 2);

    const leftPos = position === 'left' ? '80px' : 'auto';
    const rightPos = position === 'right' ? '80px' : 'auto';

    basket.style.cssText = `
      position: absolute;
      top: 180px;
      ${position === 'left' ? 'left' : 'right'}: ${position === 'left' ? leftPos : rightPos};
      width: ${basketWidth}px;
      height: ${containerHeight}px;
      background: #8B4513;
      border-radius: 12px 12px 4px 4px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      overflow: hidden;
    `;

    // 篮子标签
    const basketLabel = document.createElement('div');
    basketLabel.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: white;
      margin-bottom: 10px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    `;
    basketLabel.textContent = `${item.name}${itemGroup.containerName}`;
    basket.appendChild(basketLabel);

    // 物品容器（固定10列布局）
    const itemContainer = document.createElement('div');
    itemContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 2px;
      justify-items: center;
      align-items: center;
      width: 100%;
      flex: 1;
      padding: 8px;
      box-sizing: border-box;
    `;

    // 创建物品（固定每行10个）
    for (let i = 0; i < count; i++) {
      const itemElement = document.createElement('div');
      itemElement.style.cssText = `
        font-size: 16px;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        line-height: 1;
      `;
      itemElement.textContent = item.icon;
      itemContainer.appendChild(itemElement);
    }

    basket.appendChild(itemContainer);
    container.appendChild(basket);
  }

  /**
   * 创建减法场景专用的"要吃掉"容器
   * @param {HTMLElement} container - 容器
   * @param {string} position - 位置 (right)
   * @param {number} count - 物品数量
   * @param {Object} item - 物品信息 {icon, name}
   * @param {Object} itemGroup - 物品组合信息
   * @param {Object} character - 学习伙伴信息
   * @param {string} randomAction - 随机选择的动作（可选）
   */
  createSubtractionEatBasket(container, position, count, item, itemGroup, character, randomAction) {
    const basket = document.createElement('div');
    basket.className = `subtraction-eat-basket basket-${position}`;

    // 计算自适应高度和宽度
    const itemsPerRow = 10; // 固定每行10个
    const rows = Math.ceil(count / itemsPerRow);
    const baseHeight = 70; // 标签和内边距（增加）
    const rowHeight = 22;   // 每行高度（稍微减少）
    const containerHeight = baseHeight + (rows * rowHeight);

    // 计算宽度（确保能容纳10个物品）
    const minWidth = 280; // 增加最小宽度
    const itemWidth = 22; // 减少单个物品宽度
    const padding = 20; // 内边距
    const gap = 2; // 间距
    const basketWidth = Math.max(minWidth, itemsPerRow * itemWidth + (itemsPerRow - 1) * gap + padding * 2);

    const rightPos = '80px';

    basket.style.cssText = `
      position: absolute;
      top: 180px;
      right: ${rightPos};
      width: ${basketWidth}px;
      height: ${containerHeight}px;
      background: #8B4513;
      border-radius: 12px 12px 4px 4px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      overflow: hidden;
    `;

    // 篮子标签（学习伙伴 + 动作）
    const basketLabel = document.createElement('div');
    basketLabel.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: white;
      margin-bottom: 10px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    `;
    // 使用传递的randomAction，如果没有则使用默认的rightLabel
    const actionText = randomAction || itemGroup.rightLabel;
    basketLabel.textContent = `${character.icon}${actionText}`;
    basket.appendChild(basketLabel);

    // 物品容器（固定10列布局）
    const itemContainer = document.createElement('div');
    itemContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 2px;
      justify-items: center;
      align-items: center;
      width: 100%;
      flex: 1;
      padding: 8px;
      box-sizing: border-box;
    `;

    // 创建物品（固定每行10个）
    for (let i = 0; i < count; i++) {
      const itemElement = document.createElement('div');
      itemElement.style.cssText = `
        font-size: 16px;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        line-height: 1;
      `;
      itemElement.textContent = item.icon;
      itemContainer.appendChild(itemElement);
    }

    basket.appendChild(itemContainer);
    container.appendChild(basket);
  }

  /**
   * 创建物品展示区（用于减法场景）
   * @param {string} position - 位置 (left/right)
   * @param {number} count - 物品数量
   * @param {string} item - 物品图标
   * @param {string} label - 标签
   * @returns {HTMLElement} 展示区元素
   */
  createItemDisplay(position, count, item, label) {
    const display = document.createElement('div');
    display.className = `item-display display-${position}`;

    // 根据物品数量动态调整大小
    const minWidth = 150;
    const minHeight = 120;
    const maxItemsPerRow = 5;
    const rows = Math.ceil(count / maxItemsPerRow);
    const cols = Math.min(count, maxItemsPerRow);

    const displayWidth = Math.max(minWidth, cols * 30 + 40);
    const displayHeight = Math.max(minHeight, rows * 30 + 60);

    const leftPos = position === 'left' ? '80px' : 'auto';
    const rightPos = position === 'right' ? '80px' : 'auto';

    display.style.cssText = `
      position: absolute;
      top: 130px;
      ${position === 'left' ? 'left' : 'right'}: ${position === 'left' ? leftPos : rightPos};
      width: ${displayWidth}px;
      height: ${Math.min(displayHeight, 120)}px;
      background: ${position === 'left' ? '#FFE4B5' : '#F0E68C'};
      border-radius: 12px 12px 4px 4px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      overflow: visible;
      border: 2px solid ${position === 'left' ? '#DEB887' : '#DAA520'};
    `;

    // 标签
    const displayLabel = document.createElement('div');
    displayLabel.style.cssText = `
      font-size: 12px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
    `;
    displayLabel.textContent = label;
    display.appendChild(displayLabel);

    // 物品容器
    const itemContainer = document.createElement('div');
    itemContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${Math.min(count, maxItemsPerRow)}, 1fr);
      gap: 5px;
      justify-items: center;
      align-items: center;
      width: 100%;
      flex: 1;
      padding: 5px;
    `;

    // 创建物品（仅展示，不可拖拽）
    for (let i = 0; i < count; i++) {
      const itemElement = document.createElement('div');
      itemElement.style.cssText = `
        font-size: 20px;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
      `;
      itemElement.textContent = item;
      itemContainer.appendChild(itemElement);
    }

    display.appendChild(itemContainer);
    return display;
  }

  /**
   * 创建网格展示区（用于乘法场景）
   * @param {string} position - 位置 (left/right)
   * @param {number} count - 数量
   * @param {string} item - 物品图标
   * @param {string} label - 标签
   * @returns {HTMLElement} 展示区元素
   */
  createGridDisplay(position, count, item, label) {
    const display = document.createElement('div');
    display.className = `grid-display display-${position}`;

    const displayWidth = 150;
    const displayHeight = 120;

    const leftPos = position === 'left' ? '80px' : 'auto';
    const rightPos = position === 'right' ? '80px' : 'auto';

    display.style.cssText = `
      position: absolute;
      top: 130px;
      ${position === 'left' ? 'left' : 'right'}: ${position === 'left' ? leftPos : rightPos};
      width: ${displayWidth}px;
      height: ${displayHeight}px;
      background: ${position === 'left' ? '#E6FFE6' : '#FFF8DC'};
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      overflow: visible;
      border: 2px solid ${position === 'left' ? '#90EE90' : '#F0E68C'};
    `;

    // 标签
    const displayLabel = document.createElement('div');
    displayLabel.style.cssText = `
      font-size: 12px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
    `;
    displayLabel.textContent = label;
    display.appendChild(displayLabel);

    // 网格容器
    const gridContainer = document.createElement('div');

    if (position === 'left') {
      // 左边显示行概念（垂直排列）
      gridContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex: 1;
      `;

      for (let i = 0; i < count; i++) {
        const row = document.createElement('div');
        row.style.cssText = `
          display: flex;
          gap: 4px;
          font-size: 16px;
        `;
        row.innerHTML = `${item} 第${i+1}行`;
        gridContainer.appendChild(row);
      }
    } else {
      // 右边显示列概念（水平排列）
      gridContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex: 1;
        padding: 5px;
      `;

      for (let i = 0; i < count; i++) {
        const col = document.createElement('div');
        col.style.cssText = `
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        col.textContent = item;
        gridContainer.appendChild(col);
      }
    }

    display.appendChild(gridContainer);
    return display;
  }

  /**
   * 创建容器展示区（用于乘法场景）
   * @param {HTMLElement} container - 主容器
   * @param {number} containerCount - 容器数量
   * @param {number} itemsPerContainer - 每个容器内物品数量
   * @param {Object} itemType - 物品类型信息
   */
  createContainersDisplay(container, containerCount, itemsPerContainer, itemType) {
    const containersArea = document.createElement('div');
    containersArea.className = 'containers-display';

    // 根据容器数量决定布局（最多两行）
    const maxRows = 2;
    const containersPerRow = containerCount <= 3 ? containerCount : Math.ceil(containerCount / maxRows);
    const actualRows = Math.min(maxRows, Math.ceil(containerCount / containersPerRow));

    console.log(`容器布局计算: 总数${containerCount}, 每行${containersPerRow}, 行数${actualRows}`);

    containersArea.style.cssText = `
      position: absolute;
      top: 180px;
      left: 50%;
      transform: translateX(-50%);
      display: grid;
      grid-template-columns: repeat(${containersPerRow}, 1fr);
      grid-template-rows: repeat(${actualRows}, auto);
      justify-items: center;
      align-items: center;
      gap: 15px;
      max-width: 600px;
      z-index: 5;
      min-height: 150px;
    `;

    // 创建每个容器
    for (let i = 0; i < containerCount; i++) {
      const singleContainer = this.createSingleContainer(i, itemsPerContainer, itemType);
      containersArea.appendChild(singleContainer);
    }

    container.appendChild(containersArea);
  }

  /**
   * 创建单个容器
   * @param {number} index - 容器索引
   * @param {number} itemCount - 容器内物品数量
   * @param {Object} itemType - 物品类型信息
   * @returns {HTMLElement} 容器元素
   */
  createSingleContainer(index, itemCount, itemType) {
    const containerElement = document.createElement('div');
    containerElement.className = 'single-container';

    // 根据物品数量智能调整容器大小（增大基础尺寸）
    const minSize = 100;
    const maxSize = 140;
    const baseSize = 110;
    const sizeIncrement = Math.min(8, itemCount * 3); // 每个物品增加3px，最多增加24px
    const containerSize = Math.min(maxSize, baseSize + sizeIncrement);

    containerElement.style.cssText = `
      width: ${containerSize}px;
      height: ${containerSize}px;
      background: rgba(255,255,255,0.95);
      border: 3px solid #8B4513;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      position: relative;
      overflow: hidden;
    `;

    // 容器图标（顶部）
    const containerIcon = document.createElement('div');
    containerIcon.style.cssText = `
      font-size: 24px;
      margin-bottom: 5px;
    `;
    containerIcon.textContent = itemType.container;
    containerElement.appendChild(containerIcon);

    // 物品网格容器
    const itemsGrid = document.createElement('div');

    // 智能计算网格布局
    let gridCols, gridRows;
    if (itemCount <= 4) {
      gridCols = Math.min(itemCount, 2); // 1-4个物品，最多2列
    } else if (itemCount <= 9) {
      gridCols = 3; // 5-9个物品，3列
    } else {
      gridCols = 4; // 10+个物品，4列
    }
    gridRows = Math.ceil(itemCount / gridCols);

    // 根据物品数量调整字体大小
    const fontSize = itemCount <= 4 ? 18 : itemCount <= 9 ? 16 : 14;

    itemsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${gridCols}, 1fr);
      gap: 2px;
      justify-items: center;
      align-items: center;
      flex: 1;
      width: 100%;
      min-height: 40px;
      overflow: visible;
    `;

    // 创建容器内的物品
    for (let j = 0; j < itemCount; j++) {
      const item = document.createElement('div');
      item.style.cssText = `
        font-size: ${fontSize}px;
        user-select: none;
        line-height: 1;
      `;
      // 兼容两种数据结构：旧的item是字符串，新的item是对象
      item.textContent = typeof itemType.item === 'string' ? itemType.item : itemType.item.icon;
      itemsGrid.appendChild(item);
    }

    containerElement.appendChild(itemsGrid);
    return containerElement;
  }

  /**
   * 创建答案放置区
   * @param {HTMLElement} container - 容器
   * @param {number} answer - 正确答案
   * @param {number} position - 位置值（可选，默认330px）
   * @param {boolean} useBottom - 是否使用bottom定位（可选，默认false）
   */
  createAnswerDropArea(container, answer, position = 330, useBottom = false) {
    const answerArea = document.createElement('div');
    answerArea.className = 'answer-drop-area';

    const positionStyle = useBottom ? `bottom: ${position}px;` : `top: ${position}px;`;

    answerArea.style.cssText = `
      position: absolute;
      ${positionStyle}
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.95);
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.3);
      z-index: 10;
      border: 2px solid #4CAF50;
      max-width: 400px;
    `;

    // 答案标签
    const answerLabel = document.createElement('div');
    answerLabel.style.cssText = `
      font-size: 18px;
      font-weight: bold;
      color: #333;
    `;
    answerLabel.textContent = '答案：';
    answerArea.appendChild(answerLabel);

    // 根据答案位数创建数字框
    const answerStr = answer.toString();
    const digitCount = answerStr.length;
    console.log(`创建答案框：答案=${answer}, 位数=${digitCount}`);

    for (let i = 0; i < digitCount; i++) {
      const digitBox = document.createElement('div');
      digitBox.className = 'answer-digit-box';
      digitBox.id = `answer-digit-${i}`;
      digitBox.dataset.position = i;
      digitBox.dataset.filled = 'false';

      digitBox.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px dashed #4CAF50;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        background: white;
        transition: all 0.3s ease;
      `;

      // 添加拖拽目标事件
      this.addAnswerBoxDropEvents(digitBox, answer);

      answerArea.appendChild(digitBox);
    }

    // 添加清除按钮
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-answer-btn';
    clearButton.style.cssText = `
      padding: 8px 15px;
      background: #FF6B6B;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: 10px;
    `;
    clearButton.textContent = '清除';
    clearButton.onclick = () => this.clearAnswer();
    answerArea.appendChild(clearButton);

    container.appendChild(answerArea);
  }

  /**
   * 添加数字拖拽事件
   * @param {HTMLElement} numberBox - 数字框元素
   */
  addNumberDragEvents(numberBox) {
    numberBox.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', numberBox.dataset.number);
      numberBox.style.opacity = '0.5';
    });

    numberBox.addEventListener('dragend', (e) => {
      numberBox.style.opacity = '1';
    });

    // 鼠标悬停效果
    numberBox.addEventListener('mouseenter', () => {
      numberBox.style.transform = 'scale(1.1)';
      numberBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });

    numberBox.addEventListener('mouseleave', () => {
      numberBox.style.transform = 'scale(1)';
      numberBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    });
  }

  /**
   * 添加答案框拖拽目标事件
   * @param {HTMLElement} digitBox - 数字框
   * @param {number} correctAnswer - 正确答案
   */
  addAnswerBoxDropEvents(digitBox, correctAnswer) {
    digitBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      digitBox.style.borderColor = '#FFD700';
      digitBox.style.backgroundColor = 'rgba(255,215,0,0.1)';
    });

    digitBox.addEventListener('dragleave', (e) => {
      digitBox.style.borderColor = '#4CAF50';
      digitBox.style.backgroundColor = 'white';
    });

    digitBox.addEventListener('drop', (e) => {
      e.preventDefault();

      const droppedNumber = e.dataTransfer.getData('text/plain');

      // 如果框已经有数字，先清除
      if (digitBox.dataset.filled === 'true') {
        digitBox.textContent = '';
        digitBox.dataset.filled = 'false';
      }

      // 放置新数字
      digitBox.textContent = droppedNumber;
      digitBox.dataset.filled = 'true';
      digitBox.dataset.value = droppedNumber;

      // 重置样式
      digitBox.style.borderColor = '#4CAF50';
      digitBox.style.backgroundColor = 'white';
      digitBox.style.borderStyle = 'solid';

      // 检查答案
      this.checkNumberAnswer(correctAnswer);
    });
  }

  /**
   * 检查数字答案
   * @param {number} correctAnswer - 正确答案
   */
  checkNumberAnswer(correctAnswer) {
    const digitBoxes = document.querySelectorAll('.answer-digit-box');
    let userAnswer = '';
    let allFilled = true;

    digitBoxes.forEach(box => {
      if (box.dataset.filled === 'true') {
        userAnswer += box.dataset.value;
      } else {
        allFilled = false;
      }
    });

    if (allFilled) {
      const userAnswerNum = parseInt(userAnswer);

      if (userAnswerNum === correctAnswer) {
        // 答案正确
        digitBoxes.forEach(box => {
          box.style.borderColor = '#4CAF50';
          box.style.backgroundColor = 'rgba(76,175,80,0.1)';
        });

        // 显示成功提示
        setTimeout(() => {
          const questionText = document.querySelector('.question-text');
          if (questionText) {
            questionText.innerHTML = `
              <div style="color: #4CAF50;">🎉 答案正确！</div>
              <div style="font-size: 16px; margin-top: 10px;">一共有 ${correctAnswer} 个水果</div>
            `;
          }

          // 自动提交答案
          if (window.app) {
            window.app.submitAnswer(correctAnswer);
          }
        }, 500);

      } else {
        // 答案错误
        digitBoxes.forEach(box => {
          box.style.borderColor = '#FF6B6B';
          box.style.backgroundColor = 'rgba(255,107,107,0.1)';
        });

        // 显示错误提示
        this.showErrorMessage(userAnswerNum, correctAnswer);

        // 2秒后重置
        setTimeout(() => {
          this.clearAnswer();
        }, 2000);
      }
    }
  }

  /**
   * 显示错误提示
   * @param {number} userAnswer - 用户答案
   * @param {number} correctAnswer - 正确答案
   */
  showErrorMessage(userAnswer, correctAnswer) {
    // 创建错误提示框
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #FF6B6B;
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 6px 20px rgba(255,107,107,0.4);
      z-index: 20;
      animation: errorShake 0.5s ease-in-out;
    `;

    errorMessage.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 10px;">❌ 答案错误</div>
      <div style="font-size: 16px; margin-top: 10px;">请重新尝试</div>
    `;

    // 添加到容器
    const container = document.querySelector('.scene-container');
    if (container) {
      container.appendChild(errorMessage);
    }

    // 2秒后移除
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage);
      }
    }, 2000);
  }

  /**
   * 清除答案
   */
  clearAnswer() {
    const digitBoxes = document.querySelectorAll('.answer-digit-box');
    digitBoxes.forEach(box => {
      box.textContent = '';
      box.dataset.filled = 'false';
      box.dataset.value = '';
      box.style.borderColor = '#4CAF50';
      box.style.backgroundColor = 'white';
      box.style.borderStyle = 'dashed';
    });
  }





  /**
   * 渲染分享场景 - 减法概念：数字拖拽答题
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async renderSharingScene(container, question) {
    const num1 = question.num1; // 总数
    const num2 = question.num2; // 要吃掉的数量
    const answer = question.answer;

    // 随机选择物品类型
    const itemType = this.getRandomSubtractionItem();
    console.log('减法场景选择的物品类型:', itemType);

    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    console.log('减法场景选择的学习伙伴:', character);

    // 创建数字拖拽区（顶部）
    this.createNumberDragArea(container);

    // 创建左边容器（显示总数）
    const totalBasket = this.createAdaptiveBasket('left', num1, itemType.item, itemType);
    container.appendChild(totalBasket);

    // 创建右边容器（显示学习伙伴要吃掉的数量）
    const eatBasket = this.createSubtractionEatBasket('right', num2, itemType.item, itemType, character);
    container.appendChild(eatBasket);

    // 创建中间题目（下移，避免重叠）
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      position: absolute;
      top: 400px;
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
      border: 2px solid #FFD700;
      z-index: 5;
      max-width: 500px;
      line-height: 1.4;
    `;
    // 随机选择一个动作
    const randomAction = itemType.actions[Math.floor(Math.random() * itemType.actions.length)];
    questionText.innerHTML = `${character.name}有${num1}个${itemType.item.name}，${randomAction}${num2}个，还剩多少个${itemType.item.name}？`;
    container.appendChild(questionText);

    // 创建结果放置区（固定在题目下方）
    this.createAnswerDropArea(container, answer, 480);

    // 添加野餐装饰
    this.addSharingDecorations(container);
  }



  /**
   * 渲染花园场景 - 乘法概念：容器内物品展示 + 数字拖拽答题
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async renderGardenScene(container, question) {
    const num1 = question.num1; // 容器数量
    const num2 = question.num2; // 每个容器内物品数量
    const answer = question.answer;

    // 随机选择物品类型
    const itemType = this.getRandomMultiplicationItem();
    console.log('乘法场景选择的物品类型:', itemType);

    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
    console.log('乘法场景选择的学习伙伴:', character);

    // 创建数字拖拽区（顶部）
    this.createNumberDragArea(container);

    // 创建容器展示区
    this.createContainersDisplay(container, num1, num2, itemType);

    // 创建中间题目（下移50px）
    const questionTop = 400; // 固定位置，确保不重叠
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      position: absolute;
      top: ${questionTop}px;
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
      border: 2px solid #FFD700;
      z-index: 5;
      max-width: 500px;
      line-height: 1.4;
    `;
    questionText.innerHTML = `${character.name}准备了${num1}个${itemType.itemName}${itemType.containerName}，每个${itemType.containerName}里有${num2}个${itemType.itemName}，总共有多少个${itemType.itemName}？`;
    container.appendChild(questionText);

    // 创建结果放置区（固定在题目下方）
    const answerTop = 480; // 固定位置，在题目下方
    this.createAnswerDropArea(container, answer, answerTop);

    // 添加花园装饰
    this.addGardenDecorations(container);
  }





  // 注意：除法场景现在由 PartyScene 类处理
  // 废弃的 renderPartyScene 方法已被移除，使用 js/scenes/party-scene.js 中的实现



  /**
   * 添加蛋糕拖拽事件
   * @param {HTMLElement} cakeElement - 蛋糕元素
   */
  addCakeDragEvents(cakeElement) {
    cakeElement.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', cakeElement.id);
      cakeElement.style.opacity = '0.5';
    });

    cakeElement.addEventListener('dragend', (e) => {
      cakeElement.style.opacity = '1';
    });

    // 鼠标悬停效果
    cakeElement.addEventListener('mouseenter', () => {
      cakeElement.style.transform = 'scale(1.1) rotate(-10deg)';
    });

    cakeElement.addEventListener('mouseleave', () => {
      cakeElement.style.transform = 'scale(1) rotate(0deg)';
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
   * @returns {Object} 位置信息 {x, y}
   */
  calculatePlatePosition(index, layout, plateSize) {
    const row = Math.floor(index / layout.cols);
    const col = index % layout.cols;

    // 动态调整水平间距，防止重叠
    const horizontalSpacing = layout.cols <= 3 ? 25 : 18; // 大幅减小间距
    const verticalSpacing = 25;   // 保持垂直间距
    const baseX = 80;             // 基础右边距
    const baseY = 160;            // 基础顶部距离

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
    const totalCorrect = totalItems === (this.currentScene?.question?.num1 || 0);

    if (allEqual && totalCorrect) {
      if (!this.currentScene || !this.currentScene.question) return;

      const question = this.currentScene.question;
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
   * 添加购物场景装饰
   * @param {HTMLElement} container - 容器
   */
  addShoppingDecorations(container) {
    // 移除所有装饰元素，保持简洁的界面
  }

  /**
   * 添加分享场景装饰
   * @param {HTMLElement} container - 容器
   */
  addSharingDecorations(container) {
    // 移除所有装饰元素，保持简洁的界面
  }

  /**
   * 添加派对场景装饰
   * @param {HTMLElement} container - 容器
   */
  addPartyDecorations(container) {
    // 移除所有装饰元素，保持简洁的界面
  }

  /**
   * 添加花园场景装饰
   * @param {HTMLElement} container - 容器
   */
  addGardenDecorations(container) {
    // 添加太阳
    const sun = document.createElement('div');
    sun.style.cssText = `
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 40px;
      animation: rotate 10s linear infinite;
    `;
    sun.textContent = '☀️';
    container.appendChild(sun);

    // 添加云朵
    const clouds = ['☁️', '⛅', '☁️'];
    clouds.forEach((cloud, index) => {
      const decoration = document.createElement('div');
      decoration.style.cssText = `
        position: absolute;
        top: ${30 + index * 15}px;
        left: ${100 + index * 80}px;
        font-size: 24px;
        opacity: 0.8;
        animation: drift 15s ease-in-out infinite;
        animation-delay: ${index * 2}s;
      `;
      decoration.textContent = cloud;
      container.appendChild(decoration);
    });

    // 添加蝴蝶
    const butterfly = document.createElement('div');
    butterfly.style.cssText = `
      position: absolute;
      top: 150px;
      left: 200px;
      font-size: 20px;
      animation: flutter 4s ease-in-out infinite;
    `;
    butterfly.textContent = '🦋';
    container.appendChild(butterfly);
  }

  /**
   * 添加派对场景装饰
   * @param {HTMLElement} container - 容器
   */
  addPartyDecorations(container) {
    // 添加彩带
    const streamers = document.createElement('div');
    streamers.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 40px;
      background: repeating-linear-gradient(
        90deg,
        #FF69B4,
        #FF69B4 20px,
        #FFD700 20px,
        #FFD700 40px,
        #00CED1 40px,
        #00CED1 60px
      );
      opacity: 0.8;
    `;
    container.appendChild(streamers);

    // 添加气球
    const balloons = ['🎈', '🎈', '🎈', '🎈'];
    balloons.forEach((balloon, index) => {
      const decoration = document.createElement('div');
      decoration.style.cssText = `
        position: absolute;
        top: ${60 + index * 10}px;
        left: ${50 + index * 60}px;
        font-size: 24px;
        animation: sway 3s ease-in-out infinite;
        animation-delay: ${index * 0.5}s;
      `;
      decoration.textContent = balloon;
      container.appendChild(decoration);
    });

    // 添加生日帽
    const hat = document.createElement('div');
    hat.style.cssText = `
      position: absolute;
      top: 80px;
      right: 50px;
      font-size: 30px;
      animation: wiggle 2s ease-in-out infinite;
    `;
    hat.textContent = '🎉';
    container.appendChild(hat);
  }

  /**
   * 生成拖拽元素
   * @param {Object} question - 题目对象
   */
  generateDragElements(question) {
    const container = document.getElementById('drag-elements');
    if (!container) return;

    container.innerHTML = '';

    // 根据运算类型生成不同的拖拽元素
    const elements = this.createDragElementsForOperation(question);

    elements.forEach((element, index) => {
      const dragElement = document.createElement('div');
      dragElement.className = 'drag-element';
      dragElement.draggable = true;
      dragElement.dataset.value = element.value;
      dragElement.dataset.type = element.type;
      dragElement.id = `drag-element-${index}`;

      dragElement.style.cssText = `
        width: 50px;
        height: 50px;
        background: ${element.color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: grab;
        margin: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: transform 0.2s ease;
      `;

      dragElement.textContent = element.icon;

      // 添加拖拽事件监听器
      this.addDragEventListeners(dragElement);

      container.appendChild(dragElement);
    });
  }

  /**
   * 根据运算类型创建拖拽元素
   * @param {Object} question - 题目对象
   * @returns {Array} 拖拽元素数组
   */
  createDragElementsForOperation(question) {
    const elements = [];
    const operationType = question.type;

    switch (operationType) {
      case 'addition':
        // 加法：创建足够的物品供拖拽
        const totalItems = question.num1 + question.num2;
        const items = ['🍎', '🍌', '🥕', '🧸', '📚'];
        for (let i = 0; i < totalItems; i++) {
          elements.push({
            value: 1,
            type: 'item',
            icon: items[i % items.length],
            color: '#FFE5B4'
          });
        }
        break;

      case 'subtraction':
        // 减法：创建初始数量的物品
        const initialItems = question.num1;
        const foods = ['🍪', '🧁', '🍰', '🥤', '🍇'];
        for (let i = 0; i < initialItems; i++) {
          elements.push({
            value: 1,
            type: 'food',
            icon: foods[i % foods.length],
            color: '#E5F3FF'
          });
        }
        break;

      case 'multiplication':
        // 乘法：创建花朵用于排列
        const flowers = question.num1 * question.num2;
        const flowerTypes = ['🌸', '🌺', '🌻', '🌷', '🌹'];
        for (let i = 0; i < flowers; i++) {
          elements.push({
            value: 1,
            type: 'flower',
            icon: flowerTypes[i % flowerTypes.length],
            color: '#E5FFE5'
          });
        }
        break;

      case 'division':
        // 除法：创建需要分配的物品
        const cakes = question.num1;
        for (let i = 0; i < cakes; i++) {
          elements.push({
            value: 1,
            type: 'cake',
            icon: '🎂',
            color: '#FFE5F1'
          });
        }
        break;
    }

    return elements;
  }

  /**
   * 创建拖拽目标区域
   * @param {Object} question - 题目对象
   */
  createDropZones(question) {
    const container = document.getElementById('drop-zones');
    if (!container) return;

    container.innerHTML = '';

    // 根据运算类型创建不同的目标区域
    const zones = this.createDropZonesForOperation(question);

    zones.forEach((zone, index) => {
      const dropZone = document.createElement('div');
      dropZone.className = 'drop-zone';
      dropZone.id = `drop-zone-${index}`;
      dropZone.dataset.type = zone.type;
      dropZone.dataset.capacity = zone.capacity;
      dropZone.dataset.current = '0';

      dropZone.style.cssText = `
        width: ${zone.width}px;
        height: ${zone.height}px;
        border: 3px dashed ${zone.borderColor};
        border-radius: 12px;
        background: ${zone.background};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px;
        position: relative;
        transition: all 0.3s ease;
      `;

      // 添加标签
      const label = document.createElement('div');
      label.className = 'drop-zone-label';
      label.style.cssText = `
        font-size: 12px;
        font-weight: bold;
        color: ${zone.textColor};
        margin-bottom: 5px;
      `;
      label.textContent = zone.label;
      dropZone.appendChild(label);

      // 添加计数显示
      const counter = document.createElement('div');
      counter.className = 'drop-zone-counter';
      counter.style.cssText = `
        font-size: 18px;
        font-weight: bold;
        color: ${zone.textColor};
      `;
      counter.textContent = `0/${zone.capacity}`;
      dropZone.appendChild(counter);

      // 添加拖拽目标事件监听器
      this.addDropEventListeners(dropZone);

      container.appendChild(dropZone);
    });
  }

  /**
   * 根据运算类型创建拖拽目标区域
   * @param {Object} question - 题目对象
   * @returns {Array} 目标区域数组
   */
  createDropZonesForOperation(question) {
    const zones = [];
    const operationType = question.type;

    switch (operationType) {
      case 'addition':
        zones.push({
          type: 'cart',
          capacity: question.answer,
          width: 120,
          height: 100,
          borderColor: '#FF6B6B',
          background: 'rgba(255,107,107,0.1)',
          textColor: '#FF6B6B',
          label: '购物车'
        });
        break;

      case 'subtraction':
        // 为每个朋友创建一个盘子
        for (let i = 0; i < question.num2; i++) {
          zones.push({
            type: 'plate',
            capacity: 1,
            width: 80,
            height: 80,
            borderColor: '#4ECDC4',
            background: 'rgba(78,205,196,0.1)',
            textColor: '#4ECDC4',
            label: `朋友${i + 1}`
          });
        }
        break;

      case 'multiplication':
        // 创建网格区域
        const rows = question.num1;
        const cols = question.num2;
        for (let i = 0; i < rows * cols; i++) {
          zones.push({
            type: 'plot',
            capacity: 1,
            width: 60,
            height: 60,
            borderColor: '#4CAF50',
            background: 'rgba(76,175,80,0.1)',
            textColor: '#4CAF50',
            label: `位置${i + 1}`
          });
        }
        break;

      case 'division':
        // 为每个人创建一个盘子
        for (let i = 0; i < question.num2; i++) {
          zones.push({
            type: 'plate',
            capacity: question.answer,
            width: 80,
            height: 80,
            borderColor: '#FF1493',
            background: 'rgba(255,20,147,0.1)',
            textColor: '#FF1493',
            label: `盘子${i + 1}`
          });
        }
        break;
    }

    return zones;
  }

  /**
   * 添加拖拽事件监听器
   * @param {HTMLElement} element - 拖拽元素
   */
  addDragEventListeners(element) {
    element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', element.id);
      element.classList.add('dragging');
    });

    element.addEventListener('dragend', (e) => {
      element.classList.remove('dragging');
    });

    // 触摸设备支持
    let isDragging = false;
    let startX, startY;

    element.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      element.classList.add('dragging');
      e.preventDefault();
    });

    element.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      element.style.position = 'fixed';
      element.style.left = touch.clientX - 25 + 'px';
      element.style.top = touch.clientY - 25 + 'px';
      element.style.zIndex = '1000';
      e.preventDefault();
    });

    element.addEventListener('touchend', (e) => {
      if (!isDragging) return;

      isDragging = false;
      element.classList.remove('dragging');

      // 查找触摸结束位置下的拖拽目标
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('.drop-zone');

      if (dropZone) {
        this.handleDrop(element, dropZone);
      }

      // 重置样式
      element.style.position = '';
      element.style.left = '';
      element.style.top = '';
      element.style.zIndex = '';
    });
  }

  /**
   * 添加拖拽目标事件监听器
   * @param {HTMLElement} dropZone - 拖拽目标区域
   */
  addDropEventListeners(dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      const dragElementId = e.dataTransfer.getData('text/plain');
      const dragElement = document.getElementById(dragElementId);

      if (dragElement) {
        this.handleDrop(dragElement, dropZone);
      }
    });
  }

  /**
   * 处理拖拽放置
   * @param {HTMLElement} dragElement - 拖拽元素
   * @param {HTMLElement} dropZone - 目标区域
   */
  handleDrop(dragElement, dropZone) {
    const current = parseInt(dropZone.dataset.current);
    const capacity = parseInt(dropZone.dataset.capacity);

    if (current >= capacity) {
      // 目标区域已满
      this.showDropFeedback(dropZone, false, '已满');
      return;
    }

    // 移动元素到目标区域
    const newCurrent = current + 1;
    dropZone.dataset.current = newCurrent;

    // 更新计数显示
    const counter = dropZone.querySelector('.drop-zone-counter');
    if (counter) {
      counter.textContent = `${newCurrent}/${capacity}`;
    }

    // 移除拖拽元素
    dragElement.remove();

    // 在目标区域显示小图标
    const miniIcon = document.createElement('div');
    miniIcon.style.cssText = `
      position: absolute;
      top: ${20 + (newCurrent - 1) * 15}px;
      left: ${10 + (newCurrent - 1) * 15}px;
      font-size: 16px;
      z-index: 1;
    `;
    miniIcon.textContent = dragElement.textContent;
    dropZone.appendChild(miniIcon);

    // 显示成功反馈
    this.showDropFeedback(dropZone, true);

    // 检查是否完成
    this.checkCompletion();
  }

  /**
   * 显示拖拽反馈
   * @param {HTMLElement} dropZone - 目标区域
   * @param {boolean} success - 是否成功
   * @param {string} message - 消息
   */
  showDropFeedback(dropZone, success, message = '') {
    if (success) {
      dropZone.classList.add('filled');
      setTimeout(() => {
        dropZone.classList.remove('filled');
      }, 500);
    } else {
      dropZone.classList.add('error-feedback');
      setTimeout(() => {
        dropZone.classList.remove('error-feedback');
      }, 500);

      if (message) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--error-color);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1000;
        `;
        feedback.textContent = message;
        dropZone.appendChild(feedback);

        setTimeout(() => {
          feedback.remove();
        }, 2000);
      }
    }
  }

  /**
   * 检查完成状态
   */
  checkCompletion() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allFilled = true;
    let totalPlaced = 0;

    dropZones.forEach(zone => {
      const current = parseInt(zone.dataset.current);
      const capacity = parseInt(zone.dataset.capacity);
      totalPlaced += current;

      if (current < capacity) {
        allFilled = false;
      }
    });

    if (allFilled || this.isValidAnswer(totalPlaced)) {
      // 完成拖拽，提交答案
      setTimeout(() => {
        if (window.app) {
          window.app.submitAnswer(totalPlaced);
        }
      }, 500);
    }
  }

  /**
   * 验证答案是否有效
   * @param {number} answer - 答案
   * @returns {boolean} 是否有效
   */
  isValidAnswer(answer) {
    if (!this.currentScene || !this.currentScene.question) {
      return false;
    }

    const question = this.currentScene.question;
    return answer === question.answer;
  }

  /**
   * 清理当前场景
   */
  clearCurrentScene() {
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

    this.currentScene = null;
    this.sceneElements.clear();
  }

  /**
   * 调整布局（响应式）
   */
  adjustLayout() {
    if (!this.currentScene) return;

    const sceneContainer = document.getElementById('scene-container');
    if (!sceneContainer) return;

    // 根据屏幕尺寸调整场景元素
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // 移动端布局调整
      const dragElements = sceneContainer.querySelectorAll('.drag-element');
      dragElements.forEach(element => {
        element.style.width = '40px';
        element.style.height = '40px';
        element.style.fontSize = '20px';
      });

      const dropZones = sceneContainer.querySelectorAll('.drop-zone');
      dropZones.forEach(zone => {
        const currentWidth = parseInt(zone.style.width);
        zone.style.width = Math.max(currentWidth * 0.8, 60) + 'px';
        const currentHeight = parseInt(zone.style.height);
        zone.style.height = Math.max(currentHeight * 0.8, 60) + 'px';
      });
    }
  }

  /**
   * 播放场景动画
   * @param {string} animationType - 动画类型
   */
  playSceneAnimation(animationType) {
    const sceneContainer = document.getElementById('scene-container');
    if (!sceneContainer) return;

    switch (animationType) {
      case 'success':
        sceneContainer.classList.add('celebration');
        setTimeout(() => {
          sceneContainer.classList.remove('celebration');
        }, 1000);
        break;

      case 'error':
        sceneContainer.classList.add('error-feedback');
        setTimeout(() => {
          sceneContainer.classList.remove('error-feedback');
        }, 500);
        break;

      case 'hint':
        // 高亮显示提示元素
        const dragElements = sceneContainer.querySelectorAll('.drag-element');
        dragElements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add('float-hint');
            setTimeout(() => {
              element.classList.remove('float-hint');
            }, 1000);
          }, index * 200);
        });
        break;
    }
  }

  /**
   * 获取场景信息
   * @returns {Object} 场景信息
   */
  getSceneInfo() {
    if (!this.currentScene) {
      return null;
    }

    return {
      type: this.currentScene.type,
      operationType: this.currentScene.operationType,
      question: this.currentScene.question,
      config: this.sceneConfigs[this.currentScene.type]
    };
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SceneManager;
}
