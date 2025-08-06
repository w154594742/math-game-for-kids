/**
 * 数据管理器 - 负责用户数据的存储和管理
 * 使用LocalStorage进行本地数据持久化
 */

class DataManager {
  constructor() {
    this.storageKey = 'mathGameData';
    this.userData = this.loadUserData();
    this.defaultData = this.getDefaultUserData();
  }

  /**
   * 获取默认用户数据结构
   * @returns {Object} 默认用户数据
   */
  getDefaultUserData() {
    return {
      profile: {
        name: '小朋友',
        avatar: 'default',
        level: 1,
        totalScore: 0,
        createdAt: new Date().toISOString(),
        lastPlayedAt: new Date().toISOString()
      },
      progress: {
        addition: { level: 1, accuracy: 0, totalQuestions: 0, correctAnswers: 0 },
        subtraction: { level: 1, accuracy: 0, totalQuestions: 0, correctAnswers: 0 },
        multiplication: { level: 0, accuracy: 0, totalQuestions: 0, correctAnswers: 0 },
        division: { level: 0, accuracy: 0, totalQuestions: 0, correctAnswers: 0 }
      },
      achievements: [],
      settings: {
        soundEnabled: true,
        difficulty: 'auto',
        sessionLength: 10,
        theme: 'default',
        eyeCareMode: false,
        animationLevel: 'full' // 'full', 'reduced', 'minimal'
      },
      statistics: {
        totalPlayTime: 0,
        totalGamesPlayed: 0,
        bestScore: 0,
        longestStreak: 0,
        dailyStats: {}
      },
      errors: []
    };
  }

  /**
   * 加载用户数据
   * @returns {Object} 用户数据
   */
  loadUserData() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 合并默认数据，确保数据结构完整
        return this.mergeWithDefaults(parsedData);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
    
    // 如果没有保存的数据或加载失败，返回默认数据
    return this.getDefaultUserData();
  }

  /**
   * 合并默认数据
   * @param {Object} savedData - 保存的数据
   * @returns {Object} 合并后的数据
   */
  mergeWithDefaults(savedData) {
    const defaultData = this.getDefaultUserData();
    
    // 深度合并对象
    const merge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          merge(target[key], source[key]);
        } else if (target[key] === undefined) {
          target[key] = source[key];
        }
      }
      return target;
    };
    
    return merge(savedData, defaultData);
  }

  /**
   * 保存用户数据
   * @param {Object} data - 要保存的数据
   * @returns {boolean} 保存是否成功
   */
  saveUserData(data = null) {
    try {
      const dataToSave = data || this.userData;
      dataToSave.profile.lastPlayedAt = new Date().toISOString();
      
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      console.log('用户数据保存成功');
      return true;
    } catch (error) {
      console.error('保存用户数据失败:', error);
      return false;
    }
  }

  /**
   * 更新游戏进度
   * @param {string} operationType - 运算类型
   * @param {Object} gameResult - 游戏结果
   */
  updateProgress(operationType, gameResult) {
    if (!this.userData.progress[operationType]) {
      this.userData.progress[operationType] = {
        level: 1,
        accuracy: 0,
        totalQuestions: 0,
        correctAnswers: 0
      };
    }

    const progress = this.userData.progress[operationType];
    
    // 更新统计数据
    progress.totalQuestions += gameResult.totalQuestions;
    progress.correctAnswers += gameResult.correctAnswers;
    progress.accuracy = Math.round((progress.correctAnswers / progress.totalQuestions) * 100);
    
    // 更新总分
    this.userData.profile.totalScore += gameResult.score;
    
    // 更新最佳记录
    if (gameResult.score > this.userData.statistics.bestScore) {
      this.userData.statistics.bestScore = gameResult.score;
    }
    
    if (gameResult.maxStreak > this.userData.statistics.longestStreak) {
      this.userData.statistics.longestStreak = gameResult.maxStreak;
    }
    
    // 更新游戏次数
    this.userData.statistics.totalGamesPlayed++;
    
    // 更新每日统计
    this.updateDailyStats(gameResult);
    
    // 检查成就
    this.checkAchievements(operationType, gameResult);
    
    // 保存数据
    this.saveUserData();
    
    console.log('进度更新完成:', operationType, gameResult);
  }

  /**
   * 更新每日统计
   * @param {Object} gameResult - 游戏结果
   */
  updateDailyStats(gameResult) {
    const today = new Date().toDateString();
    
    if (!this.userData.statistics.dailyStats[today]) {
      this.userData.statistics.dailyStats[today] = {
        gamesPlayed: 0,
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        playTime: 0
      };
    }
    
    const dailyStats = this.userData.statistics.dailyStats[today];
    dailyStats.gamesPlayed++;
    dailyStats.totalScore += gameResult.score;
    dailyStats.totalQuestions += gameResult.totalQuestions;
    dailyStats.correctAnswers += gameResult.correctAnswers;
    dailyStats.playTime += gameResult.totalTime;
  }

  /**
   * 检查成就
   * @param {string} operationType - 运算类型
   * @param {Object} gameResult - 游戏结果
   */
  checkAchievements(operationType, gameResult) {
    const achievements = [];
    
    // 首次完成游戏
    if (this.userData.statistics.totalGamesPlayed === 1) {
      achievements.push('first_game');
    }
    
    // 完美答题
    if (gameResult.accuracy === 100) {
      achievements.push('perfect_score');
    }
    
    // 连击成就
    if (gameResult.maxStreak >= 5) {
      achievements.push('streak_master');
    }
    
    // 速度成就
    const avgTime = gameResult.totalTime / gameResult.totalQuestions;
    if (avgTime < 5000) { // 平均5秒内完成
      achievements.push('speed_demon');
    }
    
    // 添加新成就
    achievements.forEach(achievement => {
      if (!this.userData.achievements.includes(achievement)) {
        this.userData.achievements.push(achievement);
        console.log('获得新成就:', achievement);
      }
    });
  }

  /**
   * 获取用户统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    return {
      profile: this.userData.profile,
      progress: this.userData.progress,
      achievements: this.userData.achievements,
      statistics: this.userData.statistics
    };
  }

  /**
   * 更新用户设置
   * @param {Object} newSettings - 新设置
   */
  updateSettings(newSettings) {
    this.userData.settings = { ...this.userData.settings, ...newSettings };
    this.saveUserData();
    console.log('设置更新完成:', newSettings);
  }

  /**
   * 获取用户设置
   * @returns {Object} 用户设置
   */
  getSettings() {
    return this.userData.settings;
  }

  /**
   * 重置用户数据
   * @returns {boolean} 重置是否成功
   */
  resetUserData() {
    try {
      this.userData = this.getDefaultUserData();
      this.saveUserData();
      console.log('用户数据重置完成');
      return true;
    } catch (error) {
      console.error('重置用户数据失败:', error);
      return false;
    }
  }

  /**
   * 导出用户数据
   * @returns {string} JSON格式的用户数据
   */
  exportUserData() {
    return JSON.stringify(this.userData, null, 2);
  }

  /**
   * 导入用户数据
   * @param {string} jsonData - JSON格式的用户数据
   * @returns {boolean} 导入是否成功
   */
  importUserData(jsonData) {
    try {
      const importedData = JSON.parse(jsonData);
      this.userData = this.mergeWithDefaults(importedData);
      this.saveUserData();
      console.log('用户数据导入完成');
      return true;
    } catch (error) {
      console.error('导入用户数据失败:', error);
      return false;
    }
  }

  /**
   * 记录错误信息
   * @param {Object} errorInfo - 错误信息
   */
  recordError(errorInfo) {
    try {
      if (!this.userData.errors) {
        this.userData.errors = [];
      }

      // 添加错误记录
      this.userData.errors.push(errorInfo);

      // 只保留最近的50个错误记录
      if (this.userData.errors.length > 50) {
        this.userData.errors = this.userData.errors.slice(-50);
      }

      // 保存数据
      this.saveUserData();

    } catch (error) {
      console.error('记录错误信息失败:', error);
    }
  }

  /**
   * 获取错误记录
   * @returns {Array} 错误记录列表
   */
  getErrorRecords() {
    return this.userData.errors || [];
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataManager;
}
