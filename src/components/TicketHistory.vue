<template>
  <div class="ticket-history-container" :class="{ 'show': show }">
    <div class="history-header">
      <div class="mac-folder">
        <div class="folder-icon">
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div class="ticket-count">{{ tickets.length }}个项目</div>
        </div>
      </div>
      <div class="mac-window-controls">
        <div class="control close" @click="$emit('close')"></div>
        <div class="control minimize"></div>
        <div class="control expand"></div>
      </div>
    </div>
    
    <div class="search-filters">
      <div class="filter-group">
        <div class="filter-label">情绪筛选</div>
        <div class="emotion-filters">
          <div 
            v-for="emotion in emotions" 
            :key="emotion.name"
            :class="['emotion-filter', { active: selectedEmotions.includes(emotion.name) }]"
            @click="toggleEmotionFilter(emotion.name)"
          >
            <span class="emotion-icon">{{ emotion.icon }}</span>
            <span class="emotion-name">{{ emotion.name }}</span>
          </div>
        </div>
      </div>
      
      <div class="filter-group">
        <div class="filter-label">日期范围</div>
        <div class="date-filters">
          <div 
            v-for="period in datePeriods" 
            :key="period.value"
            :class="['date-filter', { active: selectedDatePeriod === period.value }]"
            @click="selectDatePeriod(period.value)"
          >
            {{ period.label }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="history-list">
      <div 
        v-for="(ticket, index) in filteredTickets" 
        :key="index" 
        class="history-item"
        :class="{ 'highlight': isHighlighted(ticket) }"
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
      
      <div v-if="filteredTickets.length === 0" class="no-tickets">
        没有找到符合条件的车票
      </div>
    </div>
    
    <!-- 车票详情弹窗 -->
    <div v-if="showDetail" class="ticket-detail-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>车票详情</h3>
          <div class="close-button" @click="closeDetail">&times;</div>
        </div>
        <div class="modal-body">
          <div class="detail-item">
            <div class="detail-label">日期</div>
            <div class="detail-value">{{ selectedTicket.date }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">航班</div>
            <div class="detail-value">{{ selectedTicket.flightCode }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">路线</div>
            <div class="detail-value">{{ selectedTicket.from }} → {{ selectedTicket.to }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">消息</div>
            <div class="detail-value">{{ selectedTicket.message }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">关键词</div>
            <div class="detail-value keywords">
              <span v-for="(keyword, i) in selectedTicket.keywords" :key="i" class="keyword">{{ keyword }}</span>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-label">AI建议</div>
            <div class="detail-value">{{ selectedTicket.aiMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TicketHistory',
  props: {
    tickets: {
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
      emotions: [
        { name: '开心', icon: '😊' },
        { name: '焦虑', icon: '😰' },
        { name: '平静', icon: '😌' },
        { name: '难过', icon: '😢' },
        { name: '生气', icon: '😠' },
        { name: '疲惫', icon: '😩' }
      ],
      selectedEmotions: [],
      datePeriods: [
        { label: '全部', value: 'all' },
        { label: '今天', value: 'today' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' }
      ],
      selectedDatePeriod: 'all',
      showDetail: false,
      selectedTicket: null
    };
  },
  computed: {
    filteredTickets() {
      let result = [...this.tickets];
      
      // 按情绪筛选
      if (this.selectedEmotions.length > 0) {
        // 这里假设车票有emotion属性，实际中可能需要根据目的地来判断情绪类型
        result = result.filter(ticket => {
          const emotion = this.getEmotionFromDestination(ticket.to);
          return this.selectedEmotions.includes(emotion);
        });
      }
      
      // 按日期筛选
      if (this.selectedDatePeriod !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        result = result.filter(ticket => {
          const ticketDate = this.parseTicketDate(ticket.date);
          
          switch (this.selectedDatePeriod) {
            case 'today':
              return ticketDate >= today;
            case 'week':
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              return ticketDate >= weekStart;
            case 'month':
              const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              return ticketDate >= monthStart;
            default:
              return true;
          }
        });
      }
      
      // 按时间倒序排列
      result.sort((a, b) => {
        return this.parseTicketDate(b.date) - this.parseTicketDate(a.date);
      });
      
      return result;
    }
  },
  methods: {
    toggleEmotionFilter(emotion) {
      const index = this.selectedEmotions.indexOf(emotion);
      if (index === -1) {
        this.selectedEmotions.push(emotion);
      } else {
        this.selectedEmotions.splice(index, 1);
      }
    },
    
    selectDatePeriod(period) {
      this.selectedDatePeriod = period;
    },
    
    isHighlighted(ticket) {
      // 实现高亮逻辑
      return false;
    },
    
    viewTicketDetail(ticket) {
      this.selectedTicket = ticket;
      this.showDetail = true;
    },
    
    closeDetail() {
      this.showDetail = false;
      this.selectedTicket = null;
    },
    
    getEmotionFromDestination(destination) {
      // 根据目的地判断情绪类型
      const destinationMap = {
        '阳光城': '开心',
        '治愈湾': '焦虑',
        '平静湖': '平静',
        '温暖岛': '难过',
        '释放峰': '生气',
        '休息谷': '疲惫',
        '心灵港湾': '平静'
      };
      
      return destinationMap[destination] || '平静';
    },
    
    parseTicketDate(dateStr) {
      // 将 '3月22日' 格式转换为 Date 对象
      const currentYear = new Date().getFullYear();
      const match = dateStr.match(/(\d+)月(\d+)日/);
      
      if (match) {
        const month = parseInt(match[1]) - 1; // 月份从0开始
        const day = parseInt(match[2]);
        return new Date(currentYear, month, day);
      }
      
      return new Date(); // 默认返回当前日期
    }
  }
};
</script>

<style scoped>
.ticket-history-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  width: 480px;
  max-height: 80vh;
  background: rgba(245, 245, 247, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: 10px;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

body.dark-mode .ticket-history-container {
  background: rgba(30, 30, 30, 0.85);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(80, 80, 80, 0.3);
}

.ticket-history-container.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.history-header {
  display: flex;
  align-items: center;
  padding: 16px 16px 16px 70px;
  position: relative;
  background: linear-gradient(to bottom, #f5f5f7, #e5e5ea);
  border-bottom: 1px solid #d1d1d6;
  border-radius: 10px 10px 0 0;
  height: 60px;
}

body.dark-mode .history-header {
  background: linear-gradient(to bottom, #2c2c2e, #1c1c1e);
  border-bottom: 1px solid #3a3a3c;
}

.mac-folder {
  display: flex;
  align-items: center;
  flex: 1;
}

.folder-icon {
  margin-right: 12px;
}

.folder-content {
  display: flex;
  flex-direction: column;
}

.history-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 2px;
}

.ticket-count {
  font-size: 12px;
  color: #86868b;
  font-weight: 400;
}

body.dark-mode .history-title {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

body.dark-mode .ticket-count {
  color: #d0d0d0;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.mac-window-controls {
  display: flex;
  align-items: center;
  position: absolute;
  left: 16px;
  top: 16px;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control.close {
  background-color: #ff5f57;
  border: 1px solid #e04343;
}

.control.minimize {
  background-color: #ffbd2e;
  border: 1px solid #e0a92e;
}

.control.expand {
  background-color: #28c940;
  border: 1px solid #1daa32;
}

.control:hover {
  filter: brightness(1.1);
}

/* 详情弹窗样式 */
.ticket-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 480px;
  background: rgba(245, 245, 247, 0.98);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1px solid #d1d1d6;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #f5f5f7, #e5e5ea);
  border-bottom: 1px solid #d1d1d6;
}

.modal-header h3 {
  margin: 0;
  font-size: 15px;
  color: #1d1d1f;
  font-weight: 600;
}

.modal-header .close-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff5f57;
  border: 1px solid #e04343;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-header .close-button:hover {
  filter: brightness(1.1);
}

.modal-body {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  background: white;
}

body.dark-mode .modal-body {
  background: #2c2c2e;
}

.detail-item {
  margin-bottom: 14px;
}

.detail-label {
  font-size: 11px;
  color: #86868b;
  margin-bottom: 4px;
  font-weight: 500;
}

body.dark-mode .detail-label {
  color: #a1a1a6;
}

.detail-value {
  font-size: 13px;
  color: #1d1d1f;
  line-height: 1.4;
}

body.dark-mode .detail-value {
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

body.dark-mode .keyword {
  background: rgba(10, 132, 255, 0.3);
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(10, 132, 255, 0.5);
}

/* 筛选器样式 */
.search-filters {
  padding: 16px;
  background-color: #f5f5f7;
  border-bottom: 1px solid #d1d1d6;
}

.filter-group {
  margin-bottom: 14px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 12px;
  color: #3a3a3c;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: -0.1px;
}

.emotion-filters, .date-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.emotion-filter, .date-filter {
  padding: 5px 10px;
  border-radius: 16px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #d1d1d6;
  color: #3a3a3c;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.emotion-filter {
  display: flex;
  align-items: center;
}

.emotion-icon {
  margin-right: 5px;
}

.emotion-filter:hover, .date-filter:hover {
  background: #f9f9fa;
  border-color: #c7c7cc;
}

.emotion-filter.active, .date-filter.active {
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.3);
  color: #007aff;
  font-weight: 500;
}

/* 详情弹窗样式 */
.ticket-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 480px;
  background: rgba(245, 245, 247, 0.98);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1px solid #d1d1d6;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #f5f5f7, #e5e5ea);
  border-bottom: 1px solid #d1d1d6;
}

.modal-header h3 {
  margin: 0;
  font-size: 15px;
  color: #1d1d1f;
  font-weight: 600;
}

.modal-header .close-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff5f57;
  border: 1px solid #e04343;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-header .close-button:hover {
  filter: brightness(1.1);
}

.modal-body {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  background: white;
}

body.dark-mode .modal-body {
  background: #2c2c2e;
}

.detail-item {
  margin-bottom: 14px;
}

.detail-label {
  font-size: 11px;
  color: #86868b;
  margin-bottom: 4px;
  font-weight: 500;
}

body.dark-mode .detail-label {
  color: #a1a1a6;
}

.detail-value {
  font-size: 13px;
  color: #1d1d1f;
  line-height: 1.4;
}

body.dark-mode .detail-value {
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

body.dark-mode .keyword {
  background: rgba(10, 132, 255, 0.3);
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(10, 132, 255, 0.5);
}

/* 历史列表样式 */
.history-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 16px;
  margin: 0 0 16px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  background: white;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #d1d1d6;
  border-top: none;
}

body.dark-mode .history-list {
  background: #2c2c2e;
}

.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: #f5f5f7;
  border-radius: 0 0 10px 0;
}

.history-list::-webkit-scrollbar-thumb {
  background-color: #c1c1c6;
  border-radius: 4px;
  border: 2px solid #f5f5f7;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a6;
}

.history-item {
  padding: 12px;
  border-radius: 8px;
  background: white;
  margin: 12px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e5ea;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
}

body.dark-mode .history-item {
  background: #3a3a3c;
  border: 1px solid #4a4a4c;
}

.history-item:hover {
  background-color: #f5f5f7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.history-item.highlight {
  background-color: rgba(0, 122, 255, 0.08);
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.history-date {
  font-size: 11px;
  color: #8e8e93;
  margin-bottom: 6px;
  font-weight: 500;
}

.history-flight {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.flight-code {
  font-weight: 600;
  color: #007aff;
  font-size: 14px;
}

.flight-route {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #3a3a3c;
}

.route-arrow {
  margin: 0 5px;
  color: #8e8e93;
}

.ticket-message {
  font-size: 12px;
  color: #3a3a3c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

body.dark-mode .history-date {
  color: #c1c1c6;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

body.dark-mode .flight-code {
  color: #3a97ff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 700;
}

body.dark-mode .flight-route {
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

body.dark-mode .route-arrow {
  color: #c1c1c6;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

body.dark-mode .ticket-message {
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
}

.no-tickets {
  text-align: center;
  padding: 20px;
  color: #8e8e93;
  font-style: italic;
  font-size: 13px;
}

/* 详情弹窗样式 */
.ticket-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 480px;
  background: rgba(245, 245, 247, 0.98);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1px solid #d1d1d6;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #f5f5f7, #e5e5ea);
  border-bottom: 1px solid #d1d1d6;
}

.modal-header h3 {
  margin: 0;
  font-size: 15px;
  color: #1d1d1f;
  font-weight: 600;
}

.modal-header .close-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff5f57;
  border: 1px solid #e04343;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-header .close-button:hover {
  filter: brightness(1.1);
}

.modal-body {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  background: white;
}

body.dark-mode .modal-body {
  background: #2c2c2e;
}

.detail-item {
  margin-bottom: 14px;
}

.detail-label {
  font-size: 11px;
  color: #86868b;
  margin-bottom: 4px;
  font-weight: 500;
}

body.dark-mode .detail-label {
  color: #a1a1a6;
}

.detail-value {
  font-size: 13px;
  color: #1d1d1f;
  line-height: 1.4;
}

body.dark-mode .detail-value {
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

body.dark-mode .keyword {
  background: rgba(10, 132, 255, 0.3);
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(10, 132, 255, 0.5);
}
</style>