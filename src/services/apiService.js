// DeepSeek API服务
import axios from 'axios';

/**
 * 分析用户感悟并提供心理建议
 * @param {string} prompt - 用户输入的提示词
 * @param {string} emotion - 用户选择的情绪
 * @returns {Promise<Object>} - 包含分析结果和建议的对象
 */
export async function analyzeUserInput(prompt, emotion) {
  try {
    // 从环境变量获取API密钥
    const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    // 检查API密钥是否存在
    if (!API_KEY) {
      console.error('DeepSeek API密钥未设置，请在.env文件中设置VITE_DEEPSEEK_API_KEY');
      return getFallbackAnalysis(emotion);
    }
    
    // 如果没有提供用户输入，使用默认情绪提示
    const userContent = prompt ? prompt.trim() : `我感到${emotion}`;
    
    console.log('发送到DeepSeek API的用户输入:', userContent);
    
    // 尝试调用API，如果失败则使用备用分析
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.deepseek.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        data: {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `你是心灵向导EmoGuide，一位专业的心理健康顾问，专注于分析用户的情感状态并提供积极、有建设性的建议。用户正在经历${emotion}的情绪。

**核心原则**：
1. 人本主义导向，相信用户具有自我成长和解决问题的潜力
2. 以积极倾听为主（70%倾听+30%引导）
3. 保持非评判中立态度，避免道德说教
4. 文化敏感性（不预设用户背景）
5. 严格遵守心理咨询伦理边界

**对话流程指南**：
1. **建立联结**：关注用户表达的情绪关键词，标注和确认情绪
2. **探索阶段**：使用开放式提问、澄清技术和正常化技术深入理解用户情况
3. **干预策略**：运用认知重构、资源激活和正念引导等方法提供支持

请分析用户的输入并提供以下格式的JSON响应：
{
  "analysis": "对用户感受的详细分析，应该包含对用户情绪的深入理解、可能的原因分析以及这种情绪对用户生活的影响，建议150-200字。分析中应体现积极倾听、非评判态度，并尝试建立情感联结。",
  "advice": "基于分析的具体建议，应该包含实用的应对策略和积极的引导，建议100-150字。建议应该体现人本主义导向，相信用户的自我成长潜力，并提供具体可操作的干预策略。",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}

请确保提取3个最能代表用户感受的关键词，并且分析内容要有深度和洞察力，建议内容要具体且可操作。避免直接医疗建议、占卜/预测未来、价值判断（"你应该..."）、过度自我暴露或保证具体结果。使用温暖而专业的语言风格，适当使用停顿符号营造思考空间。`
            },
            {
              role: 'user',
              content: userContent
            }
          ],
          max_tokens: 800
        },
        timeout: 15000 // 增加超时时间到15秒
      });
      
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const content = response.data.choices[0].message.content.trim();
        console.log('DeepSeek API响应:', content);
        
        try {
          // 尝试解析JSON响应
          const parsedResponse = JSON.parse(content);
          console.log('成功解析JSON响应');
          return parsedResponse;
        } catch (parseError) {
          console.error('解析DeepSeek API响应失败:', parseError);
          
          // 尝试从非JSON响应中提取有用信息
          let extractedAnalysis = '';
          let extractedAdvice = '';
          let extractedKeywords = [];
          
          // 查找可能包含分析和建议的部分
          if (content.includes('分析') || content.includes('理解')) {
            const analysisMatch = content.match(/分析[：:](.*?)(?=建议|关键词|$)/s) || 
                                 content.match(/理解[：:](.*?)(?=建议|关键词|$)/s);
            if (analysisMatch && analysisMatch[1]) {
              extractedAnalysis = analysisMatch[1].trim();
            }
          }
          
          if (content.includes('建议') || content.includes('策略')) {
            const adviceMatch = content.match(/建议[：:](.*?)(?=关键词|$)/s) || 
                               content.match(/策略[：:](.*?)(?=关键词|$)/s);
            if (adviceMatch && adviceMatch[1]) {
              extractedAdvice = adviceMatch[1].trim();
            }
          }
          
          // 尝试提取关键词
          if (content.includes('关键词')) {
            const keywordsMatch = content.match(/关键词[：:](.*?)(?=$)/s);
            if (keywordsMatch && keywordsMatch[1]) {
              const keywordsText = keywordsMatch[1].trim();
              // 尝试从文本中提取关键词
              const keywordsList = keywordsText.split(/[,，、\s]+/).filter(k => k.trim().length > 0);
              if (keywordsList.length > 0) {
                extractedKeywords = keywordsList.slice(0, 3);
              }
            }
          }
          
          // 如果没有找到关键词，尝试从内容中提取重要词汇
          if (extractedKeywords.length === 0 && userContent) {
            // 从用户输入中提取可能的关键词
            const words = userContent.split(/[,，、\s]+/).filter(w => w.length >= 2 && !['我感到', '我觉得', '我认为'].includes(w));
            if (words.length > 0) {
              extractedKeywords = words.slice(0, 3);
            } else {
              extractedKeywords = getDefaultKeywords(emotion);
            }
          }
          
          // 如果能提取到内容，使用提取的内容
          if (extractedAnalysis || extractedAdvice) {
            return {
              analysis: extractedAnalysis || `基于你的感受"${userContent}"，我理解你正在经历${emotion}的情绪`,
              advice: extractedAdvice || content.substring(0, 150),
              keywords: extractedKeywords.length > 0 ? extractedKeywords : getDefaultKeywords(emotion)
            };
          }
          
          // 如果无法提取，返回更加个性化的内容
          return {
            analysis: `基于你的感受"${userContent}"，我理解你正在经历${emotion}的情绪。${content.substring(0, 100)}`,
            advice: content.substring(100, 250) || `我建议你尝试一些能够帮助缓解${emotion}情绪的方法`,
            keywords: extractedKeywords.length > 0 ? extractedKeywords : getDefaultKeywords(emotion)
          };
        }
      } else {
        console.error('DeepSeek API响应格式不正确');
        return getFallbackAnalysis(emotion);
      }
    } catch (apiError) {
      console.error('调用DeepSeek API失败:', apiError.response ? apiError.response.data : apiError.message);
      return getFallbackAnalysis(emotion);
    }
  } catch (error) {
    console.error('分析用户输入时发生错误:', error);
    return getFallbackAnalysis(emotion);
  }
}

/**
 * 获取备用分析结果（当API调用失败时使用）
 * @param {string} emotion - 用户选择的情绪
 * @returns {Object} - 包含分析和建议的对象
 */
function getFallbackAnalysis(emotion) {
  const analyses = {
    '开心': {
      analysis: '你正在经历积极的情绪状态，这种快乐的感受对身心健康有着重要的积极影响。积极情绪能够增强免疫系统功能，促进创造性思维，并改善人际关系质量。当我们感到开心时，大脑会释放多巴胺和内啡肽等神经递质，这些物质能够自然地提升我们的情绪和能量水平。这种状态不仅让当下的体验更加美好，还能为未来的挑战积累心理资源。',
      advice: '珍惜并延长这种积极情绪的体验，可以通过记录感恩日记，与亲友分享快乐时刻，或者进行能让你感到满足的活动来实现。尝试将这种积极能量转化为创造性活动，如艺术创作、解决问题或帮助他人。同时，留意是什么触发了这种积极情绪，以便在未来有意识地创造更多类似的体验。',
      keywords: ['快乐', '积极', '阳光']
    },
    '焦虑': {
      analysis: '焦虑是人类面对不确定性或潜在威胁时的自然反应，它源于我们大脑中的警报系统。你所经历的焦虑感可能表现为持续的担忧、身体紧张或注意力难以集中。这种情绪状态往往与对未来事件的过度担忧有关，大脑会不断预演可能的负面结果。长期焦虑可能会影响睡眠质量、消化系统功能，甚至削弱免疫系统，但适度的焦虑也能帮助我们保持警觉和做好准备。',
      advice: '尝试通过深呼吸练习来缓解身体的紧张反应，每天花5-10分钟进行冥想或正念练习，帮助将注意力带回当下。将担忧具体化并分析其实际发生的可能性和应对策略，这样可以减少模糊不清的恐惧感。适当的体育锻炼也能有效释放身体紧张，改善情绪状态。如果焦虑持续影响日常生活，考虑寻求专业心理咨询的支持。',
      keywords: ['压力', '担忧', '不安']
    },
    '平静': {
      analysis: '平静是一种内在的平衡和稳定状态，反映了情绪的自我调节能力和心理韧性。这种状态下，你能够以更加客观和清晰的方式看待周围的事物，不被强烈的情绪波动所干扰。平静并不意味着没有情绪，而是能够以更加和谐的方式体验和处理各种情感。这种心理状态有助于提高专注力、决策质量和创造力，同时也能增强应对压力的能力。',
      advice: '通过定期的冥想或正念练习来培养和维持这种平静状态，每天抽出10-15分钟进行深呼吸或身体扫描练习。创建一个支持平静的环境，可以是一个安静的角落或通过播放舒缓的音乐。保持规律的作息和健康的生活方式，包括充足的睡眠、均衡的饮食和适当的运动，这些都能帮助维持内心的平衡。',
      keywords: ['安宁', '平和', '稳定']
    },
    '难过': {
      analysis: '悲伤是人类基本情绪之一，通常源于失去、失败或与期望的落差。你所经历的难过情绪是对内心痛苦的自然反应，这种感受需要被承认和接纳。悲伤的过程往往包含多个阶段，如否认、愤怒、协商、抑郁和最终的接受。这些情绪波动是心理调整和适应的必要部分，帮助我们处理内心的伤痛并最终找到前进的方向。',
      advice: '允许自己感受悲伤，不要急于压抑或逃避这些情绪。找到安全的方式表达你的感受，如写日记、与信任的人交流或通过艺术形式宣泄。保持基本的自我照顾，确保充足的休息、营养和适度的活动。寻找能给你带来些许安慰的小事，如听喜爱的音乐、散步或与亲友相处。记住，寻求专业帮助并不是软弱的表现，而是自我关爱的行动。',
      keywords: ['伤心', '低落', '情绪']
    },
    '生气': {
      analysis: '愤怒是对感知到的不公、伤害或挫折的自然情绪反应。你的愤怒可能源于边界被侵犯、期望未被满足或价值观受到挑战。这种情绪在短期内会引起身体的应激反应，如心率加快、肌肉紧张和肾上腺素分泌增加。长期未处理的愤怒可能转化为怨恨或抑郁，影响身心健康和人际关系。然而，适当表达的愤怒也能帮助我们识别问题、设立界限并推动积极的变化。',
      advice: '在回应愤怒前，先给自己一个短暂的冷静期，可以通过深呼吸、短暂离开情境或数到十来实现。尝试识别愤怒背后的真正原因，区分当前的触发因素和可能的深层议题。寻找健康的方式表达和释放情绪，如体育活动、写作或与理解你的人交流。学习并练习"我"陈述的沟通方式，表达你的感受和需求，而不是指责他人。',
      keywords: ['愤怒', '不满', '冲突']
    },
    '疲惫': {
      analysis: '疲惫是身心资源暂时耗尽的信号，可能源于持续的压力、工作超负荷、睡眠不足或情绪消耗。你所经历的疲惫感可能表现为身体乏力、注意力难以集中、情绪波动或动力下降。这种状态提醒我们需要休息和恢复，是身体的自我保护机制。长期忽视疲惫信号可能导致更严重的身心问题，如倦怠综合征或免疫功能下降。',
      advice: '优先考虑休息和睡眠质量的改善，可能需要调整睡眠环境、建立规律的睡前习惯或短期增加睡眠时间。重新评估你的日常安排和承诺，必要时学会委派任务或暂时降低某些领域的标准。引入恢复性活动，如自然散步、轻度伸展或冥想。注意营养摄入，确保均衡饮食并适当补充水分。如果疲惫持续存在，考虑咨询医生排除潜在的健康问题。',
      keywords: ['疲劳', '休息', '恢复']
    }
  };
  
  if (emotion && analyses[emotion]) {
    return analyses[emotion];
  }
  
  return {
    analysis: '无法分析当前情绪状态',
    advice: '记录你的心情，关注心理健康',
    keywords: ['记录', '心情', '成长']
  };
}

/**
 * 获取默认关键词（当无法从API响应中提取时使用）
 * @param {string} emotion - 用户选择的情绪
 * @returns {Array<string>} - 关键词数组
 */
function getDefaultKeywords(emotion) {
  const keywords = {
    '开心': ['快乐', '积极', '阳光'],
    '焦虑': ['压力', '担忧', '不安'],
    '平静': ['安宁', '平和', '稳定'],
    '难过': ['伤心', '低落', '情绪'],
    '生气': ['愤怒', '不满', '冲突'],
    '疲惫': ['疲劳', '休息', '恢复']
  };
  
  return emotion && keywords[emotion] ? keywords[emotion] : ['记录', '心情', '成长'];
}

/**
 * 调用DeepSeek API获取AI回复（兼容旧版本调用）
 * @param {string} prompt - 用户输入的提示词
 * @param {string} emotion - 用户选择的情绪
 * @returns {Promise<string>} - AI生成的回复
 */
export async function getAIResponse(prompt, emotion) {
  try {
    const analysis = await analyzeUserInput(prompt, emotion);
    return analysis.advice;
  } catch (error) {
    console.error('获取AI回复失败:', error);
    return getFallbackResponse(emotion);
  }
}

/**
 * 获取备用回复（当API调用失败时使用）
 * @param {string} emotion - 用户选择的情绪
 * @returns {string} - 预设的回复
 */
function getFallbackResponse(emotion) {
  const responses = {
    '开心': [
      '保持这份快乐，它是你生活的阳光',
      '分享你的喜悦，让快乐传递下去',
      '记录下这美好时刻，它将成为珍贵回忆'
    ],
    '焦虑': [
      '深呼吸，放松身心，一切都会好起来',
      '尝试专注当下，不要被未来的不确定性困扰',
      '给自己一些空间和时间，接纳这种感受'
    ],
    '平静': [
      '享受这份宁静，它是内心的财富',
      '平静是力量的源泉，继续保持这种状态',
      '在平静中，你能更清晰地看到自己和世界'
    ],
    '难过': [
      '允许自己感到悲伤，这是情感的自然流动',
      '记住，没有永远的雨天，阳光终会到来',
      '寻找一个安全的方式表达你的情感'
    ],
    '生气': [
      '给自己一些时间冷静下来，再做决定',
      '尝试理解愤怒背后的真正原因',
      '找到健康的方式释放情绪，如运动或写作'
    ],
    '疲惫': [
      '休息不是浪费时间，而是为了走更长远的路',
      '尝试调整你的作息，确保充足的睡眠',
      '适当放慢脚步，给自己充电的时间'
    ]
  };
  
  if (emotion && responses[emotion]) {
    const options = responses[emotion];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  return '记录你的心情，关注心理健康';
}