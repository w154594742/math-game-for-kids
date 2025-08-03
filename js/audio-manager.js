/**
 * 音效管理器 - 负责游戏音效的播放和控制
 * 支持音效预加载、播放控制和音量管理
 */

class AudioManager {
  constructor() {
    this.isEnabled = true;
    this.volume = 0.7;
    this.audioContext = null;
    this.audioBuffers = new Map();
    this.audioSources = new Map();
    this.isInitialized = false;
    
    // 音效配置
    this.soundConfig = {
      success: {
        frequency: 523.25, // C5
        duration: 0.3,
        type: 'sine'
      },
      error: {
        frequency: 220, // A3
        duration: 0.5,
        type: 'sawtooth'
      },
      click: {
        frequency: 800,
        duration: 0.1,
        type: 'square'
      },
      achievement: {
        frequencies: [523.25, 659.25, 783.99], // C5, E5, G5
        duration: 0.8,
        type: 'sine'
      },
      streak: {
        frequency: 1046.5, // C6
        duration: 0.2,
        type: 'triangle'
      }
    };
  }

  /**
   * 初始化音效管理器
   * @returns {Promise} 初始化完成的Promise
   */
  async init() {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 预生成音效
      await this.preloadSounds();
      
      this.isInitialized = true;
      console.log('音效管理器初始化完成');
      
    } catch (error) {
      console.warn('音效管理器初始化失败:', error);
      this.isEnabled = false;
    }
  }

  /**
   * 预加载音效
   * @returns {Promise} 预加载完成的Promise
   */
  async preloadSounds() {
    const soundPromises = Object.keys(this.soundConfig).map(soundName => {
      return this.generateSound(soundName);
    });
    
    await Promise.all(soundPromises);
    console.log('音效预加载完成');
  }

  /**
   * 生成音效
   * @param {string} soundName - 音效名称
   * @returns {Promise} 生成完成的Promise
   */
  async generateSound(soundName) {
    if (!this.audioContext) return;
    
    const config = this.soundConfig[soundName];
    if (!config) return;
    
    try {
      let buffer;
      
      if (config.frequencies) {
        // 和弦音效
        buffer = await this.generateChord(config.frequencies, config.duration, config.type);
      } else {
        // 单音音效
        buffer = await this.generateTone(config.frequency, config.duration, config.type);
      }
      
      this.audioBuffers.set(soundName, buffer);
      
    } catch (error) {
      console.warn(`生成音效失败: ${soundName}`, error);
    }
  }

  /**
   * 生成单音
   * @param {number} frequency - 频率
   * @param {number} duration - 持续时间
   * @param {string} type - 波形类型
   * @returns {Promise<AudioBuffer>} 音频缓冲区
   */
  async generateTone(frequency, duration, type = 'sine') {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }
      
      // 应用包络（淡入淡出）
      const envelope = this.calculateEnvelope(t, duration);
      data[i] = sample * envelope * this.volume;
    }
    
    return buffer;
  }

  /**
   * 生成和弦
   * @param {Array} frequencies - 频率数组
   * @param {number} duration - 持续时间
   * @param {string} type - 波形类型
   * @returns {Promise<AudioBuffer>} 音频缓冲区
   */
  async generateChord(frequencies, duration, type = 'sine') {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      // 混合多个频率
      frequencies.forEach(frequency => {
        switch (type) {
          case 'sine':
            sample += Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            sample += Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
            break;
          case 'sawtooth':
            sample += 2 * (t * frequency - Math.floor(t * frequency + 0.5));
            break;
          case 'triangle':
            sample += 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
            break;
        }
      });
      
      // 平均化和弦
      sample /= frequencies.length;
      
      // 应用包络
      const envelope = this.calculateEnvelope(t, duration);
      data[i] = sample * envelope * this.volume;
    }
    
    return buffer;
  }

  /**
   * 计算包络（淡入淡出）
   * @param {number} time - 当前时间
   * @param {number} duration - 总持续时间
   * @returns {number} 包络值
   */
  calculateEnvelope(time, duration) {
    const attackTime = 0.01; // 淡入时间
    const releaseTime = 0.1;  // 淡出时间
    
    if (time < attackTime) {
      // 淡入
      return time / attackTime;
    } else if (time > duration - releaseTime) {
      // 淡出
      return (duration - time) / releaseTime;
    } else {
      // 持续
      return 1;
    }
  }

  /**
   * 播放音效
   * @param {string} soundName - 音效名称
   * @param {Object} options - 播放选项
   */
  playSound(soundName, options = {}) {
    if (!this.isEnabled || !this.isInitialized || !this.audioContext) {
      return;
    }
    
    // 检查音频上下文状态
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    const buffer = this.audioBuffers.get(soundName);
    if (!buffer) {
      console.warn(`音效不存在: ${soundName}`);
      return;
    }
    
    try {
      // 创建音频源
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      
      // 创建增益节点用于音量控制
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = options.volume || this.volume;
      
      // 连接音频节点
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 播放音效
      source.start(0);
      
      // 存储音频源以便后续控制
      const sourceId = Date.now() + Math.random();
      this.audioSources.set(sourceId, source);
      
      // 播放结束后清理
      source.onended = () => {
        this.audioSources.delete(sourceId);
      };
      
    } catch (error) {
      console.warn(`播放音效失败: ${soundName}`, error);
    }
  }

  /**
   * 播放成功音效
   */
  playSuccess() {
    this.playSound('success');
  }

  /**
   * 播放错误音效
   */
  playError() {
    this.playSound('error');
  }

  /**
   * 播放点击音效
   */
  playClick() {
    this.playSound('click');
  }

  /**
   * 播放成就音效
   */
  playAchievement() {
    this.playSound('achievement');
  }

  /**
   * 播放连击音效
   */
  playStreak() {
    this.playSound('streak');
  }

  /**
   * 设置音效开关
   * @param {boolean} enabled - 是否启用音效
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`音效${enabled ? '启用' : '禁用'}`);
  }

  /**
   * 设置音量
   * @param {number} volume - 音量 (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`音量设置为: ${this.volume}`);
  }

  /**
   * 停止所有音效
   */
  stopAllSounds() {
    this.audioSources.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        // 忽略已经停止的音频源
      }
    });
    this.audioSources.clear();
  }

  /**
   * 获取音效状态
   * @returns {Object} 音效状态信息
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      isInitialized: this.isInitialized,
      volume: this.volume,
      audioContextState: this.audioContext ? this.audioContext.state : 'not created',
      loadedSounds: Array.from(this.audioBuffers.keys()),
      activeSources: this.audioSources.size
    };
  }

  /**
   * 销毁音效管理器
   */
  destroy() {
    // 停止所有音效
    this.stopAllSounds();
    
    // 关闭音频上下文
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // 清理缓存
    this.audioBuffers.clear();
    this.audioSources.clear();
    
    this.isInitialized = false;
    console.log('音效管理器已销毁');
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
