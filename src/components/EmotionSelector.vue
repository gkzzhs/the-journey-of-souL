<template>
  <div class="emotion-selector-container">
    <!-- 主要情绪选择 -->
    <div class="emotion-selector">
      <div 
        v-for="emotion in emotions" 
        :key="emotion.name"
        :class="['emotion-item', { active: selectedEmotion === emotion.name }]"
        @click="selectMainEmotion(emotion)"
      >
        <div class="emotion-icon">{{ emotion.icon }}</div>
        <div class="emotion-name">{{ emotion.name }}</div>
      </div>
    </div>

    <!-- 情绪子类型选择 -->
    <div v-if="showSubEmotions" class="sub-emotion-selector">
      <div class="sub-emotion-title">选择更具体的{{ selectedEmotion }}类型</div>
      <div class="sub-emotions-grid">
        <div 
          v-for="subEmotion in currentSubEmotions" 
          :key="subEmotion.name"
          :class="['sub-emotion-item', { active: selectedSubEmotion === subEmotion.name }]"
          @click="selectSubEmotion(subEmotion)"
        >
          <div class="sub-emotion-name">{{ subEmotion.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmotionSelector',
  props: {
    value: {
      type: Object,
      default: () => ({
        main: '',
        sub: ''
      })
    }
  },
  data() {
    return {
      selectedEmotion: this.value.main,
      selectedSubEmotion: this.value.sub,
      showSubEmotions: false,
      emotions: [
        { name: '开心', icon: '😊', color: '#FFD700' },
        { name: '焦虑', icon: '😰', color: '#9370DB' },
        { name: '平静', icon: '😌', color: '#87CEEB' },
        { name: '难过', icon: '😢', color: '#4682B4' },
        { name: '生气', icon: '😠', color: '#FF6347' },
        { name: '疲惫', icon: '😩', color: '#708090' }
      ],
      subEmotions: {
        '开心': [
          { name: '成就感', description: '完成了一件事情的满足感' },
          { name: '兴奋', description: '充满活力和热情' },
          { name: '感激', description: '对他人或事物的感谢' },
          { name: '满足', description: '对现状的满意' },
          { name: '放松', description: '没有压力的轻松状态' },
          { name: '喜悦', description: '纯粹的快乐感受' }
        ],
        '焦虑': [
          { name: '考试焦虑', description: '对考试的担忧' },
          { name: '社交焦虑', description: '在社交场合的不安' },
          { name: '工作压力', description: '工作带来的紧张感' },
          { name: '健康担忧', description: '对健康状况的担忧' },
          { name: '未来不确定', description: '对未来的不确定感' },
          { name: '决策困难', description: '做决定时的犹豫不决' }
        ],
        '平静': [
          { name: '内心平和', description: '内心的宁静和安详' },
          { name: '专注', description: '全神贯注于当下' },
          { name: '满足', description: '对现状的满意' },
          { name: '接纳', description: '接受现实的状态' },
          { name: '安宁', description: '没有烦恼的状态' },
          { name: '冥想', description: '深度放松的状态' }
        ],
        '难过': [
          { name: '失落', description: '失去某物的感觉' },
          { name: '悲伤', description: '内心的痛苦' },
          { name: '孤独', description: '感到独自一人' },
          { name: '失望', description: '期望落空的感觉' },
          { name: '怀念', description: '对过去的思念' },
          { name: '遗憾', description: '对过去决定的后悔' }
        ],
        '生气': [
          { name: '愤怒', description: '强烈的不满情绪' },
          { name: '烦躁', description: '容易被激怒的状态' },
          { name: '不满', description: '对现状的不满' },
          { name: '委屈', description: '感到不公平的对待' },
          { name: '嫉妒', description: '对他人拥有的渴望' },
          { name: '怨恨', description: '长期的不满和愤怒' }
        ],
        '疲惫': [
          { name: '身体疲劳', description: '身体上的疲惫感' },
          { name: '精神疲惫', description: '精神上的疲惫感' },
          { name: '倦怠', description: '对事物失去兴趣' },
          { name: '无力', description: '感到无能为力' },
          { name: '压力大', description: '感到压力过大' },
          { name: '睡眠不足', description: '缺乏足够的休息' }
        ]
      }
    };
  },
  computed: {
    currentSubEmotions() {
      return this.selectedEmotion ? this.subEmotions[this.selectedEmotion] : [];
    }
  },
  methods: {
    selectMainEmotion(emotion) {
      this.selectedEmotion = emotion.name;
      this.selectedSubEmotion = '';
      this.showSubEmotions = true;
      this.updateValue();
      this.$emit('background-change', emotion.color);
    },
    selectSubEmotion(subEmotion) {
      this.selectedSubEmotion = subEmotion.name;
      this.updateValue();
    },
    updateValue() {
      this.$emit('input', {
        main: this.selectedEmotion,
        sub: this.selectedSubEmotion
      });
    }
  }
};
</script>

<style scoped>
.emotion-selector-container {
  width: 100%;
}

.emotion-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
}

.emotion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  width: 70px;
}

.emotion-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.emotion-item.active {
  background: rgba(26, 115, 232, 0.1);
  border: 2px solid #1a73e8;
}

.emotion-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.emotion-name {
  font-size: 12px;
  color: #333;
}

/* 子情绪选择器样式 */
.sub-emotion-selector {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.sub-emotion-title {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
  text-align: center;
}

.sub-emotions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sub-emotion-item {
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-emotion-item:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.05);
}

.sub-emotion-item.active {
  background: rgba(26, 115, 232, 0.1);
  border: 1px solid #1a73e8;
}

.sub-emotion-name {
  font-size: 12px;
  color: #333;
}
</style>