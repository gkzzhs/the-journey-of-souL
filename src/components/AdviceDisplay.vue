<template>
  <div class="advice-modal" :class="{ 'show': show }">
    <div class="modal-content">
      <div class="close-button" @click="$emit('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <div class="advice-container glass-card">
        <div class="advice-content" :class="`theme-${emotionTheme}`">
          <div class="advice-header">
            <div class="emotion-icon">{{ emotionIcon }}</div>
            <div class="emotion-title">{{ emotionTitle }}</div>
          </div>
          
          <div class="advice-body">
            <div class="analysis-section">
              <h3>心理分析</h3>
              <p>{{ analysis }}</p>
            </div>
            
            <div class="keywords-section">
              <div class="keywords">
                <span v-for="(keyword, index) in keywords" :key="index" 
                      :class="`keyword-${index + 1}`">{{ keyword }}</span>
              </div>
            </div>
            
            <div class="advice-section">
              <h3>心灵建议</h3>
              <p>{{ advice }}</p>
            </div>
          </div>
          
          <div class="advice-footer">
            <button class="generate-ticket-btn" @click="$emit('generate-ticket')">
              生成心灵车票
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdviceDisplay',
  props: {
    emotion: {
      type: Object,
      default: () => ({
        main: '',
        sub: ''
      })
    },
    analysis: {
      type: String,
      default: ''
    },
    advice: {
      type: String,
      default: ''
    },
    keywords: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emotionThemes: {
        '开心': {
          theme: 'sunshine',
          icon: '😊',
          title: '快乐时光'
        },
        '焦虑': {
          theme: 'healing',
          icon: '😰',
          title: '平静心灵'
        },
        '平静': {
          theme: 'ocean',
          icon: '😌',
          title: '内心平和'
        },
        '难过': {
          theme: 'comfort',
          icon: '😢',
          title: '温暖慰藉'
        },
        '生气': {
          theme: 'release',
          icon: '😠',
          title: '情绪释放'
        },
        '疲惫': {
          theme: 'rest',
          icon: '😩',
          title: '休息充电'
        }
      }
    };
  },
  computed: {
    emotionTheme() {
      return this.emotion.main ? this.emotionThemes[this.emotion.main].theme : 'default';
    },
    emotionIcon() {
      return this.emotion.main ? this.emotionThemes[this.emotion.main].icon : '🙂';
    },
    emotionTitle() {
      return this.emotion.main ? this.emotionThemes[this.emotion.main].title : '心灵建议';
    }
  }
};
</script>

<style scoped>
.advice-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.advice-modal.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  padding: 20px;
  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  transform: translateY(20px);
  opacity: 0;
  animation: slideIn 0.5s forwards 0.2s;
}

@keyframes slideIn {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.advice-content {
  padding: 25px;
  color: #333;
}

.advice-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.emotion-icon {
  font-size: 2.5rem;
  margin-right: 15px;
}

.emotion-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.advice-body {
  margin-bottom: 25px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
  padding-left: 5px;
}

.advice-body::-webkit-scrollbar {
  width: 6px;
}

.advice-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.advice-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.analysis-section,
.advice-section {
  margin-bottom: 20px;
}

.analysis-section h3,
.advice-section h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #4B5563;
}

.analysis-section p,
.advice-section p {
  line-height: 1.6;
  color: #1F2937;
}

.keywords-section {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.keywords span {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
}

.keyword-1 {
  background-color: #3B82F6;
}

.keyword-2 {
  background-color: #10B981;
}

.keyword-3 {
  background-color: #F59E0B;
}

.advice-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.generate-ticket-btn {
  background-color: #3B82F6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.generate-ticket-btn:hover {
  background-color: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
}

.generate-ticket-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* 主题样式 */
.theme-sunshine {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
}

.theme-healing {
  background: linear-gradient(135deg, rgba(147, 112, 219, 0.1), rgba(138, 43, 226, 0.1));
}

.theme-ocean {
  background: linear-gradient(135deg, rgba(135, 206, 235, 0.1), rgba(70, 130, 180, 0.1));
}

.theme-comfort {
  background: linear-gradient(135deg, rgba(70, 130, 180, 0.1), rgba(30, 58, 138, 0.1));
}

.theme-release {
  background: linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(220, 38, 38, 0.1));
}

.theme-rest {
  background: linear-gradient(135deg, rgba(112, 128, 144, 0.1), rgba(47, 79, 79, 0.1));
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
  
  .advice-content {
    padding: 20px;
  }
  
  .emotion-icon {
    font-size: 2rem;
  }
  
  .emotion-title {
    font-size: 1.3rem;
  }
}
</style>