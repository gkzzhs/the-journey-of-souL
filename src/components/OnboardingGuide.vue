<template>
  <div class="onboarding-container" v-if="showOnboarding">
    <!-- 遮罩层 -->
    <div class="onboarding-overlay" @click="skipOnboarding"></div>
    
    <!-- 步骤弹窗 -->
    <div class="onboarding-modal" :class="{ 'show': showModal }">
      <div class="modal-content glass-card">
        <div class="close-button" @click="skipOnboarding">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- 步骤内容 -->
        <div class="step-content">
          <div v-if="currentStep === 1" class="step-slide">
            <div class="step-icon">✨</div>
            <h2>欢迎体验心灵之旅！</h2>
            <p>这是一个关注心理健康的旅程，让我们一起开始吧。</p>
            <div class="illustration">
              <div class="illustration-icon">🧠 💭 💫</div>
            </div>
            <button class="primary-button" @click="startRecordEmotion">开始记录情绪 🚀</button>
          </div>
          
          <div v-if="currentStep === 2" class="step-slide">
            <div class="step-icon">📝</div>
            <h2>记录你的心情和感受</h2>
            <p>选择一个情绪，分享你的感受，AI将为你提供个性化的心理健康建议。</p>
            <div class="illustration">
              <div class="emoji-row">
                <span>😊</span>
                <span>😌</span>
                <span>😢</span>
                <span>😰</span>
                <span>😠</span>
                <span>😩</span>
              </div>
            </div>
            <div class="highlight-area" ref="emotionInputHighlight"></div>
          </div>
          
          <div v-if="currentStep === 3" class="step-slide">
            <div class="step-icon">🎫</div>
            <h2>查看专属于你的心灵车票</h2>
            <p>每次分享都会生成一张独特的心灵车票，记录你的情感旅程。</p>
            <div class="illustration">
              <div class="ticket-illustration">
                <div class="mini-ticket">
                  <div class="mini-ticket-header"></div>
                  <div class="mini-ticket-body"></div>
                  <div class="mini-ticket-footer"></div>
                </div>
              </div>
            </div>
            <div class="highlight-area" ref="ticketHighlight"></div>
            <button class="primary-button" @click="viewTicketHistory">查看历史车票 🔍</button>
          </div>
        </div>
        
        <!-- 步骤导航 -->
        <div class="step-navigation">
          <div class="step-dots">
            <div 
              v-for="step in 3" 
              :key="step"
              :class="['step-dot', { active: currentStep === step }]"
              @click="goToStep(step)"
            ></div>
          </div>
          <button 
            v-if="currentStep < 3" 
            class="next-button" 
            @click="nextStep"
          >
            下一步
          </button>
          <button 
            v-else 
            class="finish-button" 
            @click="finishOnboarding"
          >
            开始体验 ✨
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OnboardingGuide',
  data() {
    return {
      showOnboarding: false,
      showModal: false,
      currentStep: 1,
      storageKey: 'onboardingCompleted',
      fallbackCookieName: 'onboardingCompleted',
      targetElements: {
        emotionSelector: null,
        inputArea: null,
        historySection: null
      }
    }
  },
  mounted() {
    // 检查是否是首次访问
    this.checkFirstVisit();
    
    // 获取目标DOM元素
    this.$nextTick(() => {
      try {
        this.targetElements.emotionSelector = document.querySelector('.emotion-selector');
        this.targetElements.inputArea = document.querySelector('.input-area');
        this.targetElements.historySection = document.querySelector('.history-section');
        
        console.log('引导动画已加载，目标元素已找到');
      } catch (error) {
        console.error('引导动画加载目标元素失败:', error);
      }
    });
  },
  methods: {
    checkFirstVisit() {
      try {
        // 尝试使用localStorage
        const completed = localStorage.getItem(this.storageKey);
        if (!completed) {
          // 首次访问，显示引导动画
          setTimeout(() => {
            this.showOnboarding = true;
            setTimeout(() => {
              this.showModal = true;
            }, 100);
          }, 1000); // 延迟1秒显示，确保页面完全加载
          console.log('首次访问，显示引导动画');
        } else {
          console.log('非首次访问，不显示引导动画');
        }
      } catch (error) {
        // localStorage不可用，回退到Cookie
        console.warn('localStorage不可用，回退到Cookie:', error);
        this.checkCookie();
      }
    },
    checkCookie() {
      const cookies = document.cookie.split(';');
      const cookieExists = cookies.some(cookie => {
        return cookie.trim().startsWith(`${this.fallbackCookieName}=`);
      });
      
      if (!cookieExists) {
        // 首次访问，显示引导动画
        setTimeout(() => {
          this.showOnboarding = true;
          setTimeout(() => {
            this.showModal = true;
          }, 100);
        }, 1000);
      }
    },
    markAsCompleted() {
      try {
        // 尝试使用localStorage
        localStorage.setItem(this.storageKey, 'true');
      } catch (error) {
        // localStorage不可用，回退到Cookie
        console.warn('localStorage不可用，回退到Cookie:', error);
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 设置Cookie有效期为1年
        document.cookie = `${this.fallbackCookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;
      }
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
        this.highlightTargetElement();
      }
    },
    goToStep(step) {
      this.currentStep = step;
      this.highlightTargetElement();
    },
    highlightTargetElement() {
      this.$nextTick(() => {
        // 移除之前的高亮和样式
        const highlights = document.querySelectorAll('.element-highlight');
        highlights.forEach(el => {
          el.classList.remove('element-highlight');
          el.style.transform = '';
        });
        
        // 根据当前步骤高亮相应元素
        try {
          if (this.currentStep === 2 && this.targetElements.emotionSelector && this.targetElements.inputArea) {
            // 平滑滚动到情绪选择器
            this.targetElements.emotionSelector.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            
            // 添加高亮和动画效果
            setTimeout(() => {
              this.targetElements.emotionSelector.classList.add('element-highlight');
              this.targetElements.inputArea.classList.add('element-highlight');
              
              // 添加轻微的缩放动画
              this.targetElements.emotionSelector.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
              this.targetElements.emotionSelector.style.transform = 'scale(1.02)';
              
              // 聚焦到文本框
              const textareaElement = this.targetElements.inputArea.querySelector('textarea');
              if (textareaElement) {
                this.targetElements.textareaElement = textareaElement;
                setTimeout(() => {
                  textareaElement.focus();
                }, 800);
              }
            }, 400);
          } else if (this.currentStep === 3 && this.targetElements.historySection) {
            // 平滑滚动到历史记录区域
            this.targetElements.historySection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            
            // 添加高亮和动画效果
            setTimeout(() => {
              this.targetElements.historySection.classList.add('element-highlight');
              
              // 添加轻微的缩放动画
              this.targetElements.historySection.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
              this.targetElements.historySection.style.transform = 'scale(1.02)';
              
              setTimeout(() => {
                this.targetElements.historySection.style.transform = 'scale(1)';
              }, 500);
            }, 400);
          }
        } catch (error) {
          console.error('高亮目标元素失败:', error);
        }
      });
    },
    startRecordEmotion() {
      // 跳转到情绪记录页面，并标记引导完成
      this.markAsCompleted();
      this.closeOnboarding();
      
      // 高亮情绪选择器区域并平滑滚动到视图
      if (this.targetElements.emotionSelector) {
        this.targetElements.emotionSelector.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        setTimeout(() => {
          // 添加高亮效果
          this.targetElements.emotionSelector.classList.add('element-highlight');
          
          // 添加轻微的缩放动画
          this.targetElements.emotionSelector.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          this.targetElements.emotionSelector.style.transform = 'scale(1.02)';
          
          setTimeout(() => {
            // 恢复原始大小
            this.targetElements.emotionSelector.style.transform = 'scale(1)';
            
            // 延迟后移除高亮效果
            setTimeout(() => {
              this.targetElements.emotionSelector.classList.remove('element-highlight');
            }, 2500);
          }, 500);
        }, 600);
      }
    },
    viewTicketHistory() {
      // 跳转到车票历史页面，并标记引导完成
      this.markAsCompleted();
      this.closeOnboarding();
      
      // 高亮历史记录区域
      if (this.targetElements.historySection) {
        // 平滑滚动到历史记录区域
        this.targetElements.historySection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        setTimeout(() => {
          // 添加高亮和动画效果
          this.targetElements.historySection.classList.add('element-highlight');
          
          // 添加轻微的缩放动画
          this.targetElements.historySection.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          this.targetElements.historySection.style.transform = 'scale(1.02)';
          
          setTimeout(() => {
            this.targetElements.historySection.style.transform = 'scale(1)';
          }, 500);
        }, 400);
      }
    },
    skipOnboarding() {
      // 用户点击关闭按钮或遮罩层，跳过引导
      this.markAsCompleted();
      this.closeOnboarding();
    },
    finishOnboarding() {
      // 完成引导
      this.markAsCompleted();
      this.closeOnboarding();
    },
    closeOnboarding() {
      // 关闭引导动画
      this.showModal = false;
      
      // 添加淡出动画效果
      const modalElement = document.querySelector('.onboarding-modal');
      if (modalElement) {
        modalElement.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        modalElement.style.opacity = '0';
        modalElement.style.transform = 'scale(0.95) translateY(10px)';
      }
      
      setTimeout(() => {
        this.showOnboarding = false;
      }, 500); // 等待淡出动画完成
    }
  }
}
</script>

<style scoped>
/* 引导动画容器 */
.onboarding-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* 遮罩层 */
.onboarding-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 弹窗样式 */
.onboarding-modal {
  position: relative;
  z-index: 10000;
  width: 90%;
  max-width: 480px;
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.onboarding-modal.show {
  opacity: 1;
  transform: scale(1);
}

/* 弹窗内容 */
.modal-content {
  width: 500px;
  max-width: 90%;
  padding: 30px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  animation: modalFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6B7280;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #111827;
}

/* 步骤内容 */
.step-content {
  padding: 36px 28px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.illustration {
  margin: 20px 0;
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration-icon {
  font-size: 32px;
  letter-spacing: 10px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.emoji-row {
  display: flex;
  gap: 15px;
  font-size: 28px;
}

.emoji-row span {
  animation: pulse 2s infinite;
  animation-delay: calc(var(--i, 0) * 0.2s);
}

.emoji-row span:nth-child(1) { --i: 0; }
.emoji-row span:nth-child(2) { --i: 1; }
.emoji-row span:nth-child(3) { --i: 2; }
.emoji-row span:nth-child(4) { --i: 3; }
.emoji-row span:nth-child(5) { --i: 4; }
.emoji-row span:nth-child(6) { --i: 5; }

.ticket-illustration {
  width: 100%;
  display: flex;
  justify-content: center;
}

.mini-ticket {
  width: 200px;
  height: 100px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  animation: ticketFloat 3s ease-in-out infinite;
}

@keyframes ticketFloat {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.mini-ticket-header {
  height: 25px;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
}

.mini-ticket-body {
  height: 50px;
  padding: 5px;
  position: relative;
}

.mini-ticket-body:before {
  content: "";
  position: absolute;
  width: 70%;
  height: 8px;
  background: #E5E7EB;
  top: 15px;
  left: 15%;
  border-radius: 4px;
}

.mini-ticket-body:after {
  content: "";
  position: absolute;
  width: 40%;
  height: 8px;
  background: #E5E7EB;
  top: 30px;
  left: 30%;
  border-radius: 4px;
}

.mini-ticket-footer {
  height: 25px;
  background: #F3F4F6;
  position: relative;
}

.mini-ticket-footer:before {
  content: "";
  position: absolute;
  width: 30px;
  height: 30px;
  background: #EF4444;
  border-radius: 50%;
  right: 10px;
  top: -15px;
  opacity: 0.8;
}

.step-icon {
  font-size: 38px;
  margin-bottom: 18px;
  background: linear-gradient(135deg, #2196F3, #1976D2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
}

.step-content h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #2196F3;
}

.step-content p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
  color: #333;
}

/* 按钮样式 */
.primary-button {
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563EB, #7C3AED);
}

/* 步骤导航 */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 20px;
  padding: 10px 20px;
  margin-top: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 18px 28px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background-color: rgba(248, 248, 250, 0.8);
  backdrop-filter: blur(5px);
}

.step-dots {
  display: flex;
  gap: 10px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.step-dot::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.step-dot:hover::after {
  background-color: rgba(33, 150, 243, 0.1);
}

.step-dot.active {
  background-color: #2196F3;
  transform: scale(1.2);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.next-button, .finish-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
}

.next-button:hover, .finish-button:hover {
  background-color: #43A047;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.next-button:active, .finish-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(76, 175, 80, 0.3);
}

/* 高亮区域 */
.highlight-area {
  position: relative;
  margin: 20px 0;
}

/* 元素高亮效果 */
.element-highlight {
  position: relative;
  z-index: 1000;
  animation: pulse 2.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.5);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.element-highlight:before {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 12px;
  background: rgba(33, 150, 243, 0.05);
  z-index: -1;
  animation: expand 2.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.element-highlight:after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 10px;
  background: rgba(33, 150, 243, 0.02);
  z-index: -2;
  animation: expand2 2.5s 0.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(33, 150, 243, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
}

@keyframes expand {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes expand2 {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.05;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .onboarding-modal {
    width: 95%;
    max-width: 350px;
  }
  
  .step-content h2 {
    font-size: 18px;
  }
  
  .step-content p {
    font-size: 14px;
  }
}
</style>