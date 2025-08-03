/**
 * 拖拽交互管理器 - 负责处理拖拽交互逻辑
 * 支持鼠标和触摸设备的拖拽操作
 */

class DragDropManager {
  constructor() {
    this.dragElements = [];
    this.dropZones = [];
    this.isDragging = false;
    this.currentDragElement = null;
    this.dragOffset = { x: 0, y: 0 };
    this.touchIdentifier = null;
    
    // 拖拽配置
    this.config = {
      dragThreshold: 5, // 拖拽阈值（像素）
      snapDistance: 20, // 吸附距离
      animationDuration: 300, // 动画时长
      enableHapticFeedback: true // 触觉反馈
    };
    
    // 事件监听器缓存
    this.eventListeners = new Map();
  }

  /**
   * 初始化拖拽功能
   * @param {Array} elements - 拖拽元素数组
   * @param {Array} zones - 拖拽目标区域数组
   */
  initDragAndDrop(elements, zones) {
    this.dragElements = elements || [];
    this.dropZones = zones || [];
    
    // 为拖拽元素添加事件监听器
    this.dragElements.forEach(element => {
      this.addDragListeners(element);
    });
    
    // 为拖拽目标区域添加事件监听器
    this.dropZones.forEach(zone => {
      this.addDropListeners(zone);
    });
    
    console.log(`拖拽功能初始化完成: ${this.dragElements.length} 个拖拽元素, ${this.dropZones.length} 个目标区域`);
  }

  /**
   * 添加拖拽元素事件监听器
   * @param {HTMLElement} element - 拖拽元素
   */
  addDragListeners(element) {
    // 鼠标事件
    const mouseDownHandler = (e) => this.handleDragStart(e, element);
    const mouseMoveHandler = (e) => this.handleDragMove(e);
    const mouseUpHandler = (e) => this.handleDragEnd(e);
    
    element.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    
    // 触摸事件
    const touchStartHandler = (e) => this.handleTouchStart(e, element);
    const touchMoveHandler = (e) => this.handleTouchMove(e);
    const touchEndHandler = (e) => this.handleTouchEnd(e);
    
    element.addEventListener('touchstart', touchStartHandler, { passive: false });
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler);
    
    // 缓存事件监听器以便后续移除
    this.eventListeners.set(element, {
      mousedown: mouseDownHandler,
      mousemove: mouseMoveHandler,
      mouseup: mouseUpHandler,
      touchstart: touchStartHandler,
      touchmove: touchMoveHandler,
      touchend: touchEndHandler
    });
    
    // 防止默认的拖拽行为
    element.draggable = false;
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
  }

  /**
   * 添加拖拽目标区域事件监听器
   * @param {HTMLElement} zone - 目标区域
   */
  addDropListeners(zone) {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.handleDragOver(e, zone);
    });
    
    zone.addEventListener('dragleave', (e) => {
      this.handleDragLeave(e, zone);
    });
    
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.handleDrop(e, zone);
    });
  }

  /**
   * 处理拖拽开始（鼠标）
   * @param {MouseEvent} event - 鼠标事件
   * @param {HTMLElement} element - 拖拽元素
   */
  handleDragStart(event, element) {
    if (event.button !== 0) return; // 只处理左键
    
    event.preventDefault();
    
    this.isDragging = true;
    this.currentDragElement = element;
    
    // 计算拖拽偏移
    const rect = element.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    // 添加拖拽样式
    element.classList.add('dragging');
    
    // 创建拖拽预览
    this.createDragPreview(element, event.clientX, event.clientY);
    
    console.log('开始拖拽:', element.id);
  }

  /**
   * 处理触摸开始
   * @param {TouchEvent} event - 触摸事件
   * @param {HTMLElement} element - 拖拽元素
   */
  handleTouchStart(event, element) {
    if (event.touches.length !== 1) return; // 只处理单点触摸
    
    event.preventDefault();
    
    const touch = event.touches[0];
    this.touchIdentifier = touch.identifier;
    
    this.isDragging = true;
    this.currentDragElement = element;
    
    // 计算拖拽偏移
    const rect = element.getBoundingClientRect();
    this.dragOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    // 添加拖拽样式
    element.classList.add('dragging');
    
    // 创建拖拽预览
    this.createDragPreview(element, touch.clientX, touch.clientY);
    
    // 触觉反馈
    if (this.config.enableHapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    console.log('开始触摸拖拽:', element.id);
  }

  /**
   * 处理拖拽移动（鼠标）
   * @param {MouseEvent} event - 鼠标事件
   */
  handleDragMove(event) {
    if (!this.isDragging || !this.currentDragElement) return;
    
    event.preventDefault();
    
    // 更新拖拽预览位置
    this.updateDragPreview(event.clientX, event.clientY);
    
    // 检查拖拽目标
    this.checkDropTargets(event.clientX, event.clientY);
  }

  /**
   * 处理触摸移动
   * @param {TouchEvent} event - 触摸事件
   */
  handleTouchMove(event) {
    if (!this.isDragging || !this.currentDragElement) return;
    
    const touch = Array.from(event.touches).find(t => t.identifier === this.touchIdentifier);
    if (!touch) return;
    
    event.preventDefault();
    
    // 更新拖拽预览位置
    this.updateDragPreview(touch.clientX, touch.clientY);
    
    // 检查拖拽目标
    this.checkDropTargets(touch.clientX, touch.clientY);
  }

  /**
   * 处理拖拽结束（鼠标）
   * @param {MouseEvent} event - 鼠标事件
   */
  handleDragEnd(event) {
    if (!this.isDragging || !this.currentDragElement) return;
    
    this.finalizeDrag(event.clientX, event.clientY);
  }

  /**
   * 处理触摸结束
   * @param {TouchEvent} event - 触摸事件
   */
  handleTouchEnd(event) {
    if (!this.isDragging || !this.currentDragElement) return;
    
    const touch = Array.from(event.changedTouches).find(t => t.identifier === this.touchIdentifier);
    if (!touch) return;
    
    this.finalizeDrag(touch.clientX, touch.clientY);
    this.touchIdentifier = null;
  }

  /**
   * 创建拖拽预览
   * @param {HTMLElement} element - 原始元素
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  createDragPreview(element, x, y) {
    // 移除之前的预览
    this.removeDragPreview();
    
    // 创建预览元素
    this.dragPreview = element.cloneNode(true);
    this.dragPreview.id = 'drag-preview';
    this.dragPreview.style.cssText = `
      position: fixed;
      left: ${x - this.dragOffset.x}px;
      top: ${y - this.dragOffset.y}px;
      pointer-events: none;
      z-index: 10000;
      opacity: 0.8;
      transform: scale(1.1);
      transition: none;
    `;
    
    document.body.appendChild(this.dragPreview);
  }

  /**
   * 更新拖拽预览位置
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  updateDragPreview(x, y) {
    if (this.dragPreview) {
      this.dragPreview.style.left = (x - this.dragOffset.x) + 'px';
      this.dragPreview.style.top = (y - this.dragOffset.y) + 'px';
    }
  }

  /**
   * 移除拖拽预览
   */
  removeDragPreview() {
    if (this.dragPreview) {
      this.dragPreview.remove();
      this.dragPreview = null;
    }
  }

  /**
   * 检查拖拽目标
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  checkDropTargets(x, y) {
    let targetZone = null;
    let minDistance = Infinity;
    
    this.dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      // 检查是否在区域内或在吸附距离内
      if (this.isPointInRect(x, y, rect) || distance < this.config.snapDistance) {
        if (distance < minDistance) {
          minDistance = distance;
          targetZone = zone;
        }
      }
    });
    
    // 更新目标区域高亮
    this.updateDropZoneHighlight(targetZone);
  }

  /**
   * 检查点是否在矩形内
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {DOMRect} rect - 矩形区域
   * @returns {boolean} 是否在矩形内
   */
  isPointInRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  /**
   * 更新拖拽目标区域高亮
   * @param {HTMLElement} targetZone - 目标区域
   */
  updateDropZoneHighlight(targetZone) {
    // 移除所有高亮
    this.dropZones.forEach(zone => {
      zone.classList.remove('drag-over');
    });
    
    // 添加当前目标的高亮
    if (targetZone) {
      targetZone.classList.add('drag-over');
    }
  }

  /**
   * 完成拖拽操作
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  finalizeDrag(x, y) {
    // 查找最终的拖拽目标
    const targetZone = this.findDropTarget(x, y);
    
    if (targetZone) {
      // 执行拖拽放置
      this.executeDrop(this.currentDragElement, targetZone);
    } else {
      // 拖拽取消，返回原位置
      this.cancelDrag();
    }
    
    // 清理拖拽状态
    this.cleanupDrag();
  }

  /**
   * 查找拖拽目标
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @returns {HTMLElement|null} 目标区域
   */
  findDropTarget(x, y) {
    for (const zone of this.dropZones) {
      const rect = zone.getBoundingClientRect();
      if (this.isPointInRect(x, y, rect)) {
        return zone;
      }
    }
    return null;
  }

  /**
   * 执行拖拽放置
   * @param {HTMLElement} dragElement - 拖拽元素
   * @param {HTMLElement} dropZone - 目标区域
   */
  executeDrop(dragElement, dropZone) {
    // 验证拖拽是否有效
    if (this.validateDrop(dragElement, dropZone)) {
      // 触觉反馈
      if (this.config.enableHapticFeedback && navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
      
      // 通知场景管理器处理拖拽结果
      if (window.app && window.app.sceneManager) {
        window.app.sceneManager.handleDrop(dragElement, dropZone);
      }
      
      console.log('拖拽成功:', dragElement.id, '→', dropZone.id);
    } else {
      console.log('拖拽无效:', dragElement.id, '→', dropZone.id);
      this.cancelDrag();
    }
  }

  /**
   * 验证拖拽放置
   * @param {HTMLElement} dragElement - 拖拽元素
   * @param {HTMLElement} dropZone - 目标区域
   * @returns {boolean} 是否有效
   */
  validateDrop(dragElement, dropZone) {
    // 检查目标区域是否已满
    const current = parseInt(dropZone.dataset.current) || 0;
    const capacity = parseInt(dropZone.dataset.capacity) || 1;
    
    if (current >= capacity) {
      return false;
    }
    
    // 检查元素类型是否匹配（如果有类型限制）
    const elementType = dragElement.dataset.type;
    const zoneType = dropZone.dataset.type;
    
    if (zoneType && elementType && zoneType !== elementType && zoneType !== 'any') {
      return false;
    }
    
    return true;
  }

  /**
   * 取消拖拽
   */
  cancelDrag() {
    if (this.currentDragElement) {
      // 播放取消动画
      this.currentDragElement.style.transition = `transform ${this.config.animationDuration}ms ease-out`;
      this.currentDragElement.style.transform = 'scale(1)';
      
      setTimeout(() => {
        if (this.currentDragElement) {
          this.currentDragElement.style.transition = '';
          this.currentDragElement.style.transform = '';
        }
      }, this.config.animationDuration);
    }
  }

  /**
   * 清理拖拽状态
   */
  cleanupDrag() {
    // 移除拖拽样式
    if (this.currentDragElement) {
      this.currentDragElement.classList.remove('dragging');
    }
    
    // 移除目标区域高亮
    this.dropZones.forEach(zone => {
      zone.classList.remove('drag-over');
    });
    
    // 移除拖拽预览
    this.removeDragPreview();
    
    // 重置状态
    this.isDragging = false;
    this.currentDragElement = null;
    this.dragOffset = { x: 0, y: 0 };
  }

  /**
   * 处理拖拽悬停
   * @param {DragEvent} event - 拖拽事件
   * @param {HTMLElement} zone - 目标区域
   */
  handleDragOver(event, zone) {
    zone.classList.add('drag-over');
  }

  /**
   * 处理拖拽离开
   * @param {DragEvent} event - 拖拽事件
   * @param {HTMLElement} zone - 目标区域
   */
  handleDragLeave(event, zone) {
    zone.classList.remove('drag-over');
  }

  /**
   * 处理拖拽放置
   * @param {DragEvent} event - 拖拽事件
   * @param {HTMLElement} zone - 目标区域
   */
  handleDrop(event, zone) {
    zone.classList.remove('drag-over');
    // 这里可以添加额外的拖拽处理逻辑
  }

  /**
   * 销毁拖拽管理器
   */
  destroy() {
    // 移除所有事件监听器
    this.eventListeners.forEach((listeners, element) => {
      element.removeEventListener('mousedown', listeners.mousedown);
      document.removeEventListener('mousemove', listeners.mousemove);
      document.removeEventListener('mouseup', listeners.mouseup);
      element.removeEventListener('touchstart', listeners.touchstart);
      document.removeEventListener('touchmove', listeners.touchmove);
      document.removeEventListener('touchend', listeners.touchend);
    });
    
    // 清理状态
    this.cleanupDrag();
    this.eventListeners.clear();
    this.dragElements = [];
    this.dropZones = [];
    
    console.log('拖拽管理器已销毁');
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DragDropManager;
}
