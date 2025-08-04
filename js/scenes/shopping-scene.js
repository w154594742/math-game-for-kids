/**
 * 加法场景类 - 购物场景
 * 实现加法运算的可视化学习场景
 */

class ShoppingScene extends BaseScene {
  constructor(sceneManager, itemsConfig) {
    super(sceneManager, itemsConfig);
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

    // 为容器添加购物场景类名
    container.classList.add('shopping-scene');

    // 创建标题区域（在数字拖拽区上方）
    this.createTitleHeader(container);

    // 随机选择物品组合（使用SceneManager中的方法）
    const itemGroup = this.sceneManager.getRandomAdditionItem();
    console.log('加法场景选择的物品组合:', itemGroup);
    console.log('items数组:', itemGroup.items);
    console.log('items[0]:', itemGroup.items[0]);
    console.log('items[1]:', itemGroup.items[1]);
    console.log('items数组长度:', itemGroup.items ? itemGroup.items.length : 'items不存在');
    
    // 获取学习伙伴信息
    const character = this.getSelectedCharacter();
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
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingScene;
}
