<template>
  <div class="app-container" :class="`theme-${emotionTheme}`">
    <div class="app-content">
      <header class="app-header">
        <div class="theme-toggle">
          <button @click="toggleTheme" class="theme-toggle-btn" :class="{ 'dark': isDarkMode }">
            <div class="toggle-icon">
              <span v-if="isDarkMode" class="moon-icon">🌙</span>
              <span v-else class="sun-icon">☀️</span>
            </div>
            <span class="toggle-text">{{ isDarkMode ? 'Founder Mode' : 'VC mode' }}</span>
          </button>
        </div>
        <div class="logo">
          <div class="logo-center">
            <img src="./assets/logo.svg" alt="心灵之旅" />
            <h1 class="app-title">心灵之旅</h1>
          </div>
        </div>
      </header>
      
      <!-- 引导动画组件 -->
      <OnboardingGuide @show-all-tickets="showAllTickets" />

      <main>
        <div class="integrated-container">
          <!-- 上部分：情绪输入区域 -->
          <div class="glass-card input-section">
            <h2>今天，你的心情如何?</h2>
            <p class="subtitle">分享你的感受，AI将为你提供个性化的心理健康建议</p>
            
            <div class="emotion-selector">
              <div 
                v-for="emotion in emotions" 
                :key="emotion.name"
                :class="['emotion-item', { active: selectedEmotion === emotion.name }]"
                @click="selectEmotion(emotion.name)"
              >
                <div class="emotion-icon">{{ emotion.icon }}</div>
                <div class="emotion-name">{{ emotion.name }}</div>
              </div>
            </div>

            <div class="input-area">
              <textarea 
                v-model="userInput" 
                placeholder="今天发生了什么？告诉我你的感受..."
                rows="3"
              ></textarea>
              <button class="send-button" @click="getAdvice">发送</button>
            </div>
            
            <!-- 内联显示AI建议 -->
            <div v-if="showInlineAdvice" class="inline-advice-container">
              <div class="advice-content" :class="`theme-${emotionTheme}`">
                <div class="advice-header">
                  <div class="emotion-icon">{{ selectedEmotionObj ? selectedEmotionObj.icon : '🙂' }}</div>
                  <div class="emotion-title">{{ getEmotionTitle(selectedEmotion) }}</div>
                </div>
                
                <div class="advice-body">
                  <div class="analysis-section">
                    <h3>心理分析</h3>
                    <p>{{ adviceData.analysis }}</p>
                  </div>
                  
                  <div class="keywords-section">
                    <div class="keywords">
                      <span v-for="(keyword, index) in adviceData.keywords" :key="index" 
                            :class="`keyword-${index + 1}`">{{ keyword }}</span>
                    </div>
                  </div>
                  
                  <div class="advice-section">
                    <h3>心灵建议</h3>
                    <p>{{ adviceData.advice }}</p>
                  </div>
                </div>
                
                <div class="advice-footer">
                  <button class="generate-ticket-btn" @click="generateTicket">
                    生成心灵车票
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 下部分：票夹历史记录 -->
          <div class="history-section glass-card">
            <div class="history-header">
              <div class="mac-folder">
                <div class="folder-icon">
                  <svg width="36" height="30" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- 文件夹底部 -->
                    <path d="M4 8C4 6.89543 4.89543 6 6 6H14L18 10H42C43.1046 10 44 10.8954 44 12V36C44 37.1046 43.1046 38 42 38H6C4.89543 38 4 37.1046 4 36V8Z" fill="url(#folder_gradient)"/>
                    <!-- 文件夹顶部 -->
                    <path d="M6 6C4.89543 6 4 6.89543 4 8V12H18L14 8H6Z" fill="url(#folder_top_gradient)"/>
                    <defs>
                      <linearGradient id="folder_gradient" x1="24" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#3B82F6"/>
                        <stop offset="1" stop-color="#2563EB"/>
                      </linearGradient>
                      <linearGradient id="folder_top_gradient" x1="11" y1="6" x2="11" y2="12" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#60A5FA"/>
                        <stop offset="1" stop-color="#3B82F6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div class="folder-content">
                  <div class="history-title">我的心灵车票</div>
                  <div class="ticket-count">{{ ticketHistory.length }}个项目</div>
                </div>
              </div>
            </div>
            
            <div class="history-list">
              <div 
                v-for="(ticket, index) in ticketHistory.slice(0, 5)" 
                :key="index" 
                class="history-item"
                @click="viewTicketDetail(ticket)"
              >
                <div class="history-date">{{ ticket.date }}</div>
                <div class="history-flight">
                  <div class="flight-code">{{ ticket.flightCode }}</div>
                  <div class="flight-route">
                    <div class="route-from">{{ ticket.from }}</div>
                    <div class="route-arrow">→</div>
                    <div class="route-to">{{ ticket.to }}</div>
                  </div>
                </div>
                <div class="ticket-message">{{ ticket.message }}</div>
              </div>
              
              <div v-if="ticketHistory.length === 0" class="no-tickets">
                还没有心灵车票，创建你的第一张吧
              </div>
              
              <div v-if="ticketHistory.length > 5" class="view-more" @click="showAllTickets">
                查看更多车票
              </div>
            </div>
          </div>
        </div>

        <AdviceDisplay
          v-if="showAdvice"
          :emotion="{ main: selectedEmotion }"
          :analysis="adviceData.analysis"
          :advice="adviceData.advice"
          :keywords="adviceData.keywords"
          :show="showAdvice"
          @generate-ticket="generateTicket"
          @close="showAdvice = false"
        ></AdviceDisplay>
        
        <TicketGenerator
          v-if="showTicket"
          :emotion="{ main: selectedEmotion }"
          :userInput="userInput"
          :show="showTicket"
          @ticket-generated="addTicketToHistory"
          @close="showTicket = false"
        ></TicketGenerator>

        <TicketHistory 
          v-if="showAllTicketHistory" 
          :tickets="ticketHistory" 
          :show="showAllTicketHistory"
          @close="showAllTicketHistory = false"
        />

        <footer class="app-footer">
          <p>© 2025 心灵之旅 - 关爱心理健康</p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script>
import TicketHistory from './components/TicketHistory.vue';
import TicketGenerator from './components/TicketGenerator.vue';
import OnboardingGuide from './components/OnboardingGuide.vue';
import AdviceDisplay from './components/AdviceDisplay.vue';

export default {
  components: {
    TicketHistory,
    TicketGenerator,
    OnboardingGuide,
    AdviceDisplay
  },
  mounted() {
    // 检查并应用保存的主题偏好
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode === 'true') {
        this.isDarkMode = true;
        document.body.classList.add('dark-mode');
      }
    } catch (e) {
      console.error('无法读取主题偏好:', e);
    }
  },
  data() {
    return {
      emotions: [
        { name: '开心', icon: '😊', color: '#FFD700', gradient: '135deg, #FFD700 0%, #FFA500 100%', theme: 'sunshine' },
        { name: '焦虑', icon: '😰', color: '#9370DB', gradient: '135deg, #9370DB 0%, #8A2BE2 100%', theme: 'healing' },
        { name: '平静', icon: '😌', color: '#87CEEB', gradient: '135deg, #87CEEB 0%, #4682B4 100%', theme: 'ocean' },
        { name: '难过', icon: '😢', color: '#4682B4', gradient: '135deg, #4682B4 0%, #1E3A8A 100%', theme: 'comfort' },
        { name: '生气', icon: '😠', color: '#FF6347', gradient: '135deg, #FF6347 0%, #DC2626 100%', theme: 'release' },
        { name: '疲惫', icon: '😩', color: '#708090', gradient: '135deg, #708090 0%, #2F4F4F 100%', theme: 'rest' }
      ],
      selectedEmotion: '',
      backgroundStyle: {},
      userInput: '',
      showTicket: false,
      showAdvice: false,
      showInlineAdvice: false,
      isDarkMode: false,
      showTicketHistory: false,
      showAllTicketHistory: false,
      selectedTicket: null,
      selectedEmotionObj: null,
      adviceData: {
        analysis: '',
        advice: '',
        keywords: []
      },
      ticketHistory: [
        { date: '3月22日', flightCode: 'MJ481', from: '现实世界', to: '阳光城', message: '今天心情很好', keywords: ['心情', '快乐', '阳光'], aiMessage: '保持这份快乐，它是你生活的阳光' },
        { date: '3月22日', flightCode: 'MJ000', from: '当下', to: '心灵港湾', message: '感到平静', keywords: ['平静', '安宁', '舒适'], aiMessage: '享受这份宁静，它是内心的财富' },
        { date: '3月22日', flightCode: 'MJ888', from: '当下', to: '播种城', message: '有些焦虑', keywords: ['焦虑', '担忧', '压力'], aiMessage: '深呼吸，放松身心，一切都会好起来' },
        { date: '3月22日', flightCode: 'MJ000', from: '当下', to: '心灵港湾', message: '感到平静', keywords: ['平静', '安宁', '舒适'], aiMessage: '享受这份宁静，它是内心的财富' },
        { date: '3月22日', flightCode: 'MJ330', from: '当下', to: '平静湖', message: '今天很放松', keywords: ['放松', '休息', '平静'], aiMessage: '平静是力量的源泉，继续保持这种状态' },
        { date: '3月22日', flightCode: 'MJ000', from: '当下', to: '心灵港湾', message: '感到平静', keywords: ['平静', '安宁', '舒适'], aiMessage: '享受这份宁静，它是内心的财富' },
        { date: '3月22日', flightCode: 'MJ621', from: '当下', to: '温暖岛', message: '有点难过', keywords: ['难过', '伤心', '情绪'], aiMessage: '允许自己感到悲伤，这是情感的自然流动' },
        { date: '3月22日', flightCode: 'MJ000', from: '当下', to: '心灵港湾', message: '感到平静', keywords: ['平静', '安宁', '舒适'], aiMessage: '享受这份宁静，它是内心的财富' }
      ]
    }
  },
  computed: {
    emotionTheme() {
      if (!this.selectedEmotion) return 'default';
      const emotion = this.emotions.find(e => e.name === this.selectedEmotion);
      return emotion ? emotion.theme : 'default';
    }
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      document.body.classList.toggle('dark-mode', this.isDarkMode);
      
      // 保存主题偏好到localStorage
      try {
        localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false');
      } catch (e) {
        console.error('无法保存主题偏好:', e);
      }
      
      // 更新背景动画
      if (this.selectedEmotion) {
        const selectedEmotionObj = this.emotions.find(e => e.name === this.selectedEmotion);
        if (selectedEmotionObj) {
          this.updateBackgroundStyle(selectedEmotionObj);
        }
      }
    },
    
    selectEmotion(emotion) {
      this.selectedEmotion = emotion;
      // 查找选中的情绪对象
      const selectedEmotionObj = this.emotions.find(e => e.name === emotion);
      if (selectedEmotionObj) {
        // 更新背景样式
        this.updateBackgroundStyle(selectedEmotionObj);
      }
    },
    updateBackgroundStyle(emotion) {
      // 创建动态背景样式，深色模式下更暗淡
      let gradientStr = emotion.gradient;
      if (this.isDarkMode) {
        // 在深色模式下调整渐变，使其更暗
        const darkGradient = emotion.gradient.replace(/\d+%/g, (match) => {
          const percentage = parseInt(match);
          return `${Math.max(percentage - 15, 0)}%`;
        });
        gradientStr = darkGradient;
      }
      
      this.backgroundStyle = {
        background: `linear-gradient(${gradientStr})`,
        transition: 'background 1.5s cubic-bezier(0.23, 1, 0.32, 1)',
        filter: this.isDarkMode ? 'brightness(0.8)' : 'brightness(1)'
      };
      
      // 应用样式到DOM元素
      const appContainer = document.querySelector('.app-container');
      if (appContainer) {
        Object.assign(appContainer.style, this.backgroundStyle);
        
        // 根据情绪类型设置不同的动画强度
        let animationIntensity = 1;
        if (emotion.name === '开心') {
          animationIntensity = 1.5; // 开心情绪动画更活跃
        } else if (emotion.name === '焦虑') {
          animationIntensity = 1.3; // 焦虑情绪动画较活跃
        } else if (emotion.name === '生气') {
          animationIntensity = 1.4; // 生气情绪动画较活跃
        } else if (emotion.name === '平静') {
          animationIntensity = 0.8; // 平静情绪动画较缓慢
        } else if (emotion.name === '疲惫') {
          animationIntensity = 0.6; // 疲惫情绪动画最缓慢
        }
        
        // 深色模式下降低动画强度
        if (this.isDarkMode) {
          animationIntensity *= 0.6;
        }
        
        // 更新伪元素动画
        document.documentElement.style.setProperty('--emotion-color', emotion.color);
        document.documentElement.style.setProperty('--emotion-gradient', gradientStr);
        document.documentElement.style.setProperty('--animation-intensity', animationIntensity);
        
        // 添加动画类，触发动画重置
        appContainer.classList.remove('animate-background');
        setTimeout(() => {
          appContainer.classList.add('animate-background');
        }, 10);
      }
    },
    // 获取情绪标题
    getEmotionTitle(emotion) {
      const emotionTitles = {
        '开心': '快乐时光',
        '焦虑': '平静心灵',
        '平静': '内心平和',
        '难过': '温暖慰藉',
        '生气': '情绪释放',
        '疲惫': '休息充电'
      };
      return emotion ? emotionTitles[emotion] : '心灵建议';
    },
    
    async getAdvice() {
      // 检查是否选择了情绪
      if (!this.selectedEmotion) {
        alert('请先选择一个情绪');
        return;
      }
      
      // 检查是否输入了内容
      if (!this.userInput.trim()) {
        alert('请输入你的感受');
        return;
      }
      
      // 显示加载动画
      this.showInlineAdvice = true;
      this.adviceData = {
        analysis: '分析中...',
        advice: '生成建议中...',
        keywords: ['加载', '中', '...'] 
      };
      
      try {
        // 调用DeepSeek API分析用户感悟
        const { analyzeUserInput } = await import('./services/apiService');
        console.log('发送用户输入到API:', this.userInput);
        const analysis = await analyzeUserInput(this.userInput, this.selectedEmotion);
        console.log('API返回的分析结果:', analysis);
        
        // 验证API返回的数据
        if (!analysis) {
          throw new Error('API返回数据为空');
        }
        
        // 设置建议数据，确保每个字段都有值
        this.adviceData = {
          analysis: analysis.analysis || `基于你的感受"${this.userInput}"，我理解你正在经历${this.selectedEmotion}的情绪`,
          advice: analysis.advice || '记录你的心情，关注心理健康',
          keywords: Array.isArray(analysis.keywords) && analysis.keywords.length > 0 ? 
                    analysis.keywords : 
                    this.userInput.split(/[,，、\s]+/).filter(w => w.length >= 2).slice(0, 3) || ['感受', this.selectedEmotion, '情绪']
        };
        
        // 获取选中的情绪对象
        this.selectedEmotionObj = this.emotions.find(e => e.name === this.selectedEmotion);
        
        // 显示内联建议，不显示弹窗
        this.showAdvice = false;
      } catch (error) {
        console.error('获取心理建议失败:', error);
        
        // 提供更友好的错误处理，不直接显示错误弹窗
        this.adviceData = {
          analysis: `我理解你正在经历${this.selectedEmotion}的情绪。基于你的输入"${this.userInput}"，我想提供一些个性化的建议。`,
          advice: '目前我们的系统正在维护中，但我们仍然希望能够帮助你处理当前的情绪。建议你尝试深呼吸、冥想或与亲友交流，这些方法对缓解情绪都有很好的效果。',
          keywords: [this.selectedEmotion, '情绪', '自我关怀']
        };
        
        // 获取选中的情绪对象
        this.selectedEmotionObj = this.emotions.find(e => e.name === this.selectedEmotion);
      }
    },
    
    generateTicket() {
      // 关闭建议弹窗
      this.showAdvice = false;
      
      // 先重置再显示车票，确保每次都能触发watch
      this.showTicket = false;
      setTimeout(() => {
        this.showTicket = true;
      }, 50);
    },
    
    addTicketToHistory(ticket) {
      // 将新生成的车票添加到历史记录中
      this.ticketHistory.unshift(ticket);
    },
    
    showAllTickets() {
      // 显示完整的车票历史记录
      this.showAllTicketHistory = true;
    },
    
    viewTicketDetail(ticket) {
      // 查看单个车票详情
      this.selectedTicket = ticket;
      // 这里可以添加显示详情的逻辑，例如弹出详情模态框
      this.showAllTicketHistory = true;
    }
  }
}
</script>

<style>
@import './assets/main.css';

.app-container {
  min-height: 100vh;
  transition: background-color 0.3s ease;
  position: relative;
  overflow-x: hidden;
  background-color: #ffffff;
}

.app-container.dark-mode {
  background-color: #121212;
}

/* 动态背景圆点 */
.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

/* 添加动态彩色圆点 */
@keyframes float-circle {
  0% { transform: translate(0, 0); }
  25% { transform: translate(10px, 10px); }
  50% { transform: translate(0, 20px); }
  75% { transform: translate(-10px, 10px); }
  100% { transform: translate(0, 0); }
}

.app-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, var(--circle-color-1, rgba(74, 222, 128, 0.2)) 0%, transparent 8%),
    radial-gradient(circle at 80% 30%, var(--circle-color-2, rgba(249, 115, 22, 0.2)) 0%, transparent 8%),
    radial-gradient(circle at 30% 70%, var(--circle-color-3, rgba(59, 130, 246, 0.2)) 0%, transparent 8%),
    radial-gradient(circle at 70% 80%, var(--circle-color-4, rgba(139, 92, 246, 0.2)) 0%, transparent 8%),
    radial-gradient(circle at 50% 50%, var(--circle-color-5, rgba(236, 72, 153, 0.2)) 0%, transparent 8%);
  background-size: 120% 120%;
  background-position: 0 0;
  opacity: 0.7;
  z-index: -1;
  animation: float-circle 15s ease-in-out infinite;
}

.theme-sunshine .app-container::after {
  --circle-color-1: rgba(255, 215, 0, 0.3);
  --circle-color-2: rgba(255, 165, 0, 0.3);
  --circle-color-3: rgba(255, 140, 0, 0.3);
  --circle-color-4: rgba(255, 127, 80, 0.3);
  --circle-color-5: rgba(255, 99, 71, 0.3);
  animation-duration: 20s;
}

.theme-healing .app-container::after {
  --circle-color-1: rgba(147, 112, 219, 0.3);
  --circle-color-2: rgba(138, 43, 226, 0.3);
  --circle-color-3: rgba(148, 0, 211, 0.3);
  --circle-color-4: rgba(153, 50, 204, 0.3);
  --circle-color-5: rgba(186, 85, 211, 0.3);
  animation-duration: 25s;
}

.theme-ocean .app-container::after {
  --circle-color-1: rgba(135, 206, 235, 0.3);
  --circle-color-2: rgba(70, 130, 180, 0.3);
  --circle-color-3: rgba(100, 149, 237, 0.3);
  --circle-color-4: rgba(30, 144, 255, 0.3);
  --circle-color-5: rgba(0, 191, 255, 0.3);
  animation-duration: 18s;
}

.theme-comfort .app-container::after {
  --circle-color-1: rgba(70, 130, 180, 0.3);
  --circle-color-2: rgba(30, 58, 138, 0.3);
  --circle-color-3: rgba(59, 130, 246, 0.3);
  --circle-color-4: rgba(37, 99, 235, 0.3);
  --circle-color-5: rgba(29, 78, 216, 0.3);
  animation-duration: 22s;
}

.theme-release .app-container::after {
  --circle-color-1: rgba(255, 99, 71, 0.3);
  --circle-color-2: rgba(220, 38, 38, 0.3);
  --circle-color-3: rgba(239, 68, 68, 0.3);
  --circle-color-4: rgba(248, 113, 113, 0.3);
  --circle-color-5: rgba(252, 165, 165, 0.3);
  animation-duration: 15s;
}

.theme-rest .app-container::after {
  --circle-color-1: rgba(112, 128, 144, 0.3);
  --circle-color-2: rgba(47, 79, 79, 0.3);
  --circle-color-3: rgba(119, 136, 153, 0.3);
  --circle-color-4: rgba(176, 196, 222, 0.3);
  --circle-color-5: rgba(211, 211, 211, 0.3);
  animation-duration: 30s;
}

body.dark-mode .app-container::after {
  opacity: 0.5;
}

/* 深色模式样式 */
body.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

body.dark-mode .app-container {
  background-color: rgba(18, 18, 18, 0.8);
}

body.dark-mode .glass-card {
  background: rgba(30, 30, 30, 0.7);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

body.dark-mode .input-section h2,
body.dark-mode .history-title,
body.dark-mode .passenger-value,
body.dark-mode .message {
  color: #e0e0e0;
}

body.dark-mode .subtitle,
body.dark-mode .passenger-label,
body.dark-mode .ticket-count {
  color: #a0a0a0;
}

body.dark-mode textarea {
  background: rgba(40, 40, 40, 0.8);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

body.dark-mode .history-item {
  background: rgba(40, 40, 40, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

body.dark-mode .theme-toggle-btn {
  background: rgba(30, 30, 30, 0.8);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 主题切换按钮样式 */
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
}

.theme-toggle-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 整合容器样式 */
.integrated-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

/* 输入区域样式 */
.input-section {
  margin-bottom: 0;
}

/* 内联建议容器样式 */
.inline-advice-container {
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
}

.inline-advice-container .advice-content {
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
}

.inline-advice-container .advice-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.inline-advice-container .emotion-icon {
  font-size: 32px;
  margin-bottom: 8px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.inline-advice-container .emotion-title {
  font-size: 1.3rem;
  font-weight: 600;
}

.inline-advice-container .advice-body {
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
  padding-left: 5px;
}

.inline-advice-container .advice-body::-webkit-scrollbar {
  width: 6px;
}

.inline-advice-container .advice-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.inline-advice-container .advice-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.inline-advice-container .analysis-section,
.inline-advice-container .advice-section {
  margin-bottom: 15px;
}

.inline-advice-container h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #4B5563;
}

.inline-advice-container p {
  line-height: 1.5;
  color: #1F2937;
}

.inline-advice-container .keywords-section {
  margin: 15px 0;
  display: flex;
  justify-content: center;
}

.inline-advice-container .keywords {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.inline-advice-container .keywords span {
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
}

.inline-advice-container .keyword-1 {
  background-color: #3B82F6;
  animation: pulse 1.5s infinite ease-in-out;
}

.inline-advice-container .keyword-2 {
  background-color: #10B981;
  animation: pulse 1.5s infinite ease-in-out 0.5s;
}

.inline-advice-container .keyword-3 {
  background-color: #F59E0B;
  animation: pulse 1.5s infinite ease-in-out 1s;
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(0.95); }
}

.inline-advice-container .advice-footer {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.inline-advice-container .generate-ticket-btn {
  background-color: #3B82F6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.inline-advice-container .generate-ticket-btn:hover {
  background-color: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
}

.inline-advice-container .generate-ticket-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* 历史记录区域样式 */
.history-section {
  padding: 20px;
}

.history-section .history-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.mac-folder {
  display: flex;
  align-items: center;
}

.folder-icon {
  margin-right: 10px;
}

.folder-content {
  display: flex;
  flex-direction: column;
}

.history-title {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.ticket-count {
  font-size: 12px;
  color: #666;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.history-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.history-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.history-flight {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.flight-code {
  font-weight: 500;
  font-size: 14px;
  color: #3B82F6;
}

.flight-route {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #333;
}

.route-arrow {
  margin: 0 5px;
  color: #999;
}

.ticket-message {
  font-size: 13px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-tickets {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.view-more {
  text-align: center;
  padding: 10px;
  color: #3B82F6;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-more:hover {
  color: #2563EB;
  text-decoration: underline;
}
</style>