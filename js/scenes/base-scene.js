/**
 * 基础场景类 - 所有场景的基类
 * 提供共享的工具方法和基础功能
 */

class BaseScene {
  constructor(sceneManager, itemsConfig) {
    this.sceneManager = sceneManager;
    this.itemsConfig = itemsConfig;
  }

  /**
   * 渲染场景 - 子类必须实现
   * @param {HTMLElement} container - 容器
   * @param {Object} question - 题目
   */
  async render(container, question) {
    throw new Error('子类必须实现render方法');
  }

  /**
   * 获取选中的学习伙伴
   * @returns {Object} 学习伙伴信息
   */
  getSelectedCharacter() {
    return this.sceneManager.getSelectedCharacter();
  }

  /**
   * 创建数字拖拽区
   * @param {HTMLElement} container - 容器
   */
  createNumberDragArea(container) {
    return this.sceneManager.createNumberDragArea(container);
  }

  /**
   * 创建答案拖拽区
   * @param {HTMLElement} container - 容器
   * @param {number} answer - 答案
   * @param {number} position - 位置值
   * @param {boolean} useBottom - 是否使用bottom定位
   */
  createAnswerDropArea(container, answer, position, useBottom = false) {
    return this.sceneManager.createAnswerDropArea(container, answer, position, useBottom);
  }

  /**
   * 使元素可拖拽
   * @param {HTMLElement} element - 元素
   */
  makeDraggable(element) {
    return this.sceneManager.makeDraggable(element);
  }

  /**
   * 添加蛋糕拖拽事件
   * @param {HTMLElement} cake - 蛋糕元素
   */
  addCakeDragEvents(cake) {
    return this.sceneManager.addCakeDragEvents(cake);
  }

  /**
   * 创建自适应篮子
   * @param {HTMLElement} container - 容器
   * @param {Object} itemGroup - 物品组合
   * @param {string} position - 位置
   * @param {number} targetCount - 目标数量
   * @param {number} top - 顶部位置
   */
  createAdaptiveBasket(container, itemGroup, position, targetCount, top) {
    return this.sceneManager.createAdaptiveBasket(container, itemGroup, position, targetCount, top);
  }

  /**
   * 创建减法吃掉篮子
   * @param {HTMLElement} container - 容器
   * @param {Object} itemGroup - 物品组合
   * @param {number} targetCount - 目标数量
   */
  createSubtractionEatBasket(container, itemGroup, targetCount) {
    return this.sceneManager.createSubtractionEatBasket(container, itemGroup, targetCount);
  }

  /**
   * 创建乘法容器
   * @param {HTMLElement} container - 容器
   * @param {Object} itemType - 物品类型
   * @param {number} containerCount - 容器数量
   * @param {number} itemsPerContainer - 每个容器的物品数量
   */
  createMultiplicationContainers(container, itemType, containerCount, itemsPerContainer) {
    return this.sceneManager.createMultiplicationContainers(container, itemType, containerCount, itemsPerContainer);
  }

  /**
   * 添加购物装饰
   * @param {HTMLElement} container - 容器
   */
  addShoppingDecorations(container) {
    return this.sceneManager.addShoppingDecorations(container);
  }

  /**
   * 添加分享装饰
   * @param {HTMLElement} container - 容器
   */
  addSharingDecorations(container) {
    return this.sceneManager.addSharingDecorations(container);
  }

  /**
   * 添加花园装饰
   * @param {HTMLElement} container - 容器
   */
  addGardenDecorations(container) {
    return this.sceneManager.addGardenDecorations(container);
  }

  /**
   * 添加派对装饰
   * @param {HTMLElement} container - 容器
   */
  addPartyDecorations(container) {
    return this.sceneManager.addPartyDecorations(container);
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseScene;
}
