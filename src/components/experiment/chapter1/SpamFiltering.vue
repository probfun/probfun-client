<script setup lang="ts">
import { Book, Bot, GraduationCap, MessagesSquare } from 'lucide-vue-next';
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **贝叶斯垃圾邮件过滤器**

### **1. 贝叶斯公式的核心思想**

贝叶斯公式（Bayes' Theorem）是概率论中的一个基本原理，它描述了**如何利用新的证据（观测数据）来更新我们关于某个假设的信念（概率）**。

其核心哲学是：**认知是一个动态更新的过程**。我们从最初的信念（先验概率）开始，当获得新的证据后，我们据此更新信念，得到一个新的、更准确的信念（后验概率）。

### **2. 公式的数学表达**

贝叶斯公式的标准数学形式如下：

$$
P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}
$$

其中：
- **$P(A|B)$**： **后验概率**。这是在观察到事件 B 发生后，事件 A 发生的概率。这是我们最终想要求得的、更新后的信念。
- **$P(B|A)$**： **似然概率**。这是在事件 A 确实为真的条件下，观察到证据 B 的概率。它衡量了证据对假设的支持程度。
- **$P(A)$**： **先验概率**。这是在观察到任何证据之前，我们对事件 A 发生概率的初始信念或历史经验。
- **$P(B)$**： **证据概率**或**边际概率**。即事件 B 发生的总概率，通常考虑所有可能的情况。它作为一个归一化常数，确保后验概率是一个有效的概率值（介于0和1之间）。

为了计算 $P(B)$，我们使用**全概率公式**：
$$
P(B) = P(B|A) \\cdot P(A) + P(B|\\neg A) \\cdot P(\\neg A)
$$
其中 $P(\\neg A)$ 表示 "非A"。

### **3. 经典垃圾邮件过滤器**


**假设：** 我们想求的概率是 $P(Spam|Word)$，即邮件中出现某个词（如"优惠"）时，该邮件是垃圾邮件的概率。

1.  **先验概率 $P(Spam)$**：
    - 含义：在查看邮件内容之前，任意一封邮件是垃圾邮件的概率。比如，根据历史数据，你的邮箱中20%的邮件是垃圾邮件。
    - 值：$P(Spam) = 0.20$，$P(Ham) = 0.80$（正常邮件概率）。

2.  **似然概率 $P(Word|Spam)$**：
    - 含义：在已知一封邮件是垃圾邮件的前提下，其中出现"优惠"这个词的概率。比如，统计发现50%的垃圾邮件都包含"优惠"。
    - 值：$P("优惠"|Spam) = 0.50$

3.  **证据概率 $P(Word)$**：
    - 含义：任意一封邮件中出现"优惠"这个词的总概率。这需要考虑所有邮件（包括垃圾和正常邮件）。
    - 计算：$P("优惠") = P("优惠"|Spam) \\cdot P(Spam) + P("优惠"|Ham) \\cdot P(Ham)$
    - 假设：正常邮件中只有2%会包含"优惠"，即 $P("优惠"|Ham) = 0.02$。
    - 值：$P("优惠") = (0.50 \\cdot 0.20) + (0.02 \\cdot 0.80) = 0.1 + 0.016 = 0.116$

4.  **后验概率 $P(Spam|Word)$**：
    - 含义：这就是我们想要的答案：现在观察到邮件里有"优惠"这个词了，这封邮件是垃圾邮件的更新概率是多少？
    - 计算：
$$
P(Spam|"优惠") = \\frac{P("优惠"|Spam) \\cdot P(Spam)}{P("优惠")} = \\frac{0.50 \\times 0.20}{0.116} \\approx \\frac{0.10}{0.116} \\approx 0.862
$$

**结论：** 虽然我们一开始认为任何邮件是垃圾邮件的概率只有20%（先验），但在观察到"优惠"这个词（证据）后，我们更新了判断，现在认为这封邮件有高达86.2%的可能性是垃圾邮件（后验）。这就是贝叶斯更新的威力。

### **4. 核心价值与重要性**

1.  **从因果到诊断**：贝叶斯公式让我们能够从容易统计的"因果"概率（如：已知是垃圾邮件，求它包含某个词的概率 $P(Word|Spam)$），推断出难知道的"诊断"概率（如：已知包含某个词，求它是垃圾邮件的概率 $P(Spam|Word)$）。

2.  **增量更新**：贝叶斯公式可以连续使用。一封信里通常有多个词。我们可以把第一次计算得到的后验概率 $P(Spam|Word₁)$ 作为新的先验概率，再结合第二个词 $Word₂$ 作为新证据，计算新的后验概率 $P(Spam|Word₁, Word₂)$。如此迭代，逐步细化我们的判断。

3.  **应用极其广泛**：远远不止于垃圾邮件过滤。
    - **医学诊断**：已知疾病患病率（先验）和检测准确性（似然），求检测结果为阳性时实际患病的概率（后验）。
    - **机器学习**：朴素贝叶斯分类器、贝叶斯网络等的基础。
    - **金融**：用于风险评估和预测模型。
    - **人工智能**：用于不确定性推理和决策。
`;

const knowledgeContent = `
## **贝叶斯垃圾邮件过滤器核心技术**

作为垃圾邮件分类领域的专家，我将系统性地介绍该领域涉及的核心知识点，确保技术准确性和完整性。

### **一、基础理论与算法**

#### **1. 贝叶斯分类框架**
**核心原理**：基于贝叶斯定理的文本分类方法  
$$
P(Spam|X) = \\frac{P(X|Spam)P(Spam)}{P(X)}
$$
- **朴素贝叶斯假设**：特征条件独立性，虽然现实中不成立但实际效果良好
- **多项式朴素贝叶斯**：适用于词频统计
- **伯努利朴素贝叶斯**：适用于二元特征（词出现与否）

#### **2. 特征工程深度解析**

#### **文本预处理流水线**
\`\`\`python
# 典型预处理流程（需导入依赖库：nltk、re）
import re
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

# 初始化工具类（避免重复创建，提升效率）
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text: str) -> list[str]:
    """
    文本预处理函数：标准化→分词→词形还原→停用词过滤
    :param text: 原始文本字符串
    :return: 处理后的词列表
    """
    # 1. 标准化：统一小写、移除数字和特殊符号
    text = text.lower()  # 大小写统一
    text = re.sub(r'[\\d+\\W_]', ' ', text)  # 移除数字、特殊符号（保留字母和空格）
    
    # 2. 分词与词形还原（还原单词原始形态，如"running"→"run"）
    tokens = word_tokenize(text)  # 分词
    tokens = [lemmatizer.lemmatize(token) for token in tokens if len(token) > 2]  # 词形还原+过滤短词
    
    # 3. 停用词处理（移除无意义词汇，如"the"、"and"）
    tokens = [token for token in tokens if token not in stop_words]
    
    return tokens
\`\`\`

#### **特征表示方法**
- **词袋模型(BoW)**：简单但有效的基线方法，统计每个词的出现频率
- **TF-IDF加权**：衡量词在文档中的重要性，公式如下  
  $$
  TF-IDF(t,d) = TF(t,d) \\times \\log(\\frac{N}{DF(t)})
  $$  
  其中：$N$ 为文档总数，$DF(t)$ 为包含词 $t$ 的文档数，$TF(t,d)$ 为词 $t$ 在文档 $d$ 中的出现频率
- **N-gram特征**：捕捉局部词序信息（如$bi-gram“free money”$、$tri-gram“click here now”$）

### **二、高级机器学习方法**

#### **1. 支持向量机(SVM)**
- **线性SVM**：在高维特征空间中寻找最优分离超平面，最大化分类间隔
- **核技巧**：处理非线性可分情况（常用RBF核、多项式核）
- **优势**：对小样本、高维度数据表现优异，抗过拟合能力强

#### **2. 集成学习方法**
- **随机森林**：通过“自助采样+特征随机选择”构建多棵决策树，投票决策以减少过拟合
- **梯度提升树(GBDT/XGBoost)**：顺序构建弱学习器（决策树），逐步拟合残差，提升预测精度
- **投票集成**：结合多个基分类器（如SVM+随机森林+逻辑回归）的预测结果，降低单模型偏差

#### **3. 深度学习模型**
\`\`\`python
# 基于Keras的CNN文本分类模型（适用于短文本垃圾邮件检测）
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense, Dropout

def build_cnn_text_classifier(vocab_size: int, max_length: int) -> Sequential:
    """
    构建CNN文本分类模型
    :param vocab_size: 词汇表大小
    :param max_length: 文本最大长度（统一输入维度）
    :return: 编译后的Keras模型
    """
    model = Sequential([
        # 嵌入层：将词索引转为低维向量（捕捉语义关系）
        Embedding(input_dim=vocab_size, output_dim=100, input_length=max_length),
        # 1D卷积层：捕捉局部语义特征（如短语模式）
        Conv1D(filters=128, kernel_size=5, activation='relu', padding='same'),
        # 全局最大池化：提取每个特征图的关键信息，减少维度
        GlobalMaxPooling1D(),
        # 全连接层：整合特征并输出预测
        Dense(units=64, activation='relu'),
        Dropout(rate=0.5),  # 防止过拟合：随机丢弃50%的神经元
        Dense(units=1, activation='sigmoid')  # 二分类输出（0=正常邮件，1=垃圾邮件）
    ])
    
    # 模型编译：优化器+损失函数+评估指标
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',  # 二分类交叉熵损失
        metrics=['accuracy', 'precision', 'recall']  # 多指标评估
    )
    
    return model

# 模型初始化示例
vocab_size = 10000  # 假设词汇表大小为10000
max_length = 200    # 假设文本最大长度为200
model = build_cnn_text_classifier(vocab_size, max_length)
model.summary()  # 打印模型结构
\`\`\`
- **CNN文本分类**：通过1D卷积捕捉局部语义特征（如“free gift”“click here”）
- **RNN/LSTM**：处理文本序列依赖关系，适合长文本特征提取
- **Transformer/BERT**：预训练语言模型，能捕捉上下文语义，当前最优性能（如BERT-base在垃圾邮件检测任务上F1值可达98%+）

### 三、系统化工程实践

#### **1. 特征选择策略**
- **信息增益**：衡量特征对类别预测的贡献度，保留高增益特征（如“viagra”“free”）
- **卡方检验**：评估特征与类别的独立性，过滤无关特征（如“the”“is”等通用词）
- **递归特征消除（RFE）**：通过迭代移除低重要性特征，逐步优化特征子集

#### **2. 模型评估体系**
\`\`\`
|        指标        |                  公式                  |                            意义                             |
|--------------------|---------------------------------------|-------------------------------------------------------------|
|       准确率        |         (TP+TN)/(TP+TN+FP+FN)         |        整体分类正确率（注意：样本不平衡时参考价值低）          |
| 精确率（Precision） |               TP/(TP+FP)              | 预测为垃圾邮件的样本中，实际为垃圾邮件的比例（避免正常邮件误判） |
|  召回率（Recall）   |               TP/(TP+FN)              |   实际为垃圾邮件的样本中，被正确预测的比例（避免垃圾邮件漏判）   |
|     F1-score       | 2×Precision×Recall/(Precision+Recall) |           精确率与召回率的调和平均（综合评估指标）             |
\`\`\`

**ROC-AUC分析**：通过绘制“真阳性率-假阳性率”曲线，评估分类器在不同阈值下的泛化能力（AUC越接近1，性能越好）

#### **3. 在线学习与增量更新**
\`\`\`python
# 基于SGD的增量学习（适用于实时数据流场景，如邮件实时过滤）
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# 初始化特征提取器和分类器（在线学习支持）
vectorizer = TfidfVectorizer(max_features=5000)  # TF-IDF特征提取
clf = SGDClassifier(
    loss='log_loss',  # 逻辑回归损失（支持概率输出）
    penalty='l2',     # L2正则化（防止过拟合）
    warm_start=True   # 支持增量学习（保留上一轮参数）
)

def incremental_train(new_emails: list[str], new_labels: list[int]) -> None:
    """
    增量训练函数：处理新批次邮件数据，更新模型
    :param new_emails: 新邮件文本列表
    :param new_labels: 新邮件标签列表（0=正常，1=垃圾）
    """
    # 特征提取（若首次训练，直接fit；后续训练用transform）
    if vectorizer.vocabulary_ is None:
        X = vectorizer.fit_transform(new_emails)  # 首次训练：拟合词汇表
    else:
        X = vectorizer.transform(new_emails)       # 增量训练：复用已有词汇表
    
    # 增量更新模型（partial_fit支持批次训练）
    clf.partial_fit(X, new_labels, classes=[0, 1])  # 显式指定类别（避免类别缺失问题）
    print("模型增量训练完成，当前准确率（模拟）：{:.2f}%".format(np.random.uniform(92, 98)))

# 模拟实时数据流训练（每批次100封邮件）
for batch in range(5):
    batch_emails = [f"free viagra batch {batch} email {i}" for i in range(50)] + \
                   [f"normal work email {batch} {i}" for i in range(50)]
    batch_labels = [1]*50 + [0]*50  # 50封垃圾+50封正常
    incremental_train(batch_emails, batch_labels)
\`\`\`
- **适应概念漂移**：垃圾邮件特征随时间变化（如“crypto”替代“viagra”），增量学习可实时更新模型
- **主动学习**：选择性标注“高不确定性”样本（如模型预测概率接近0.5的邮件），降低标注成本

### **四、对抗性挑战与防御**

#### **1. 常见对抗技术**
- **文本混淆**：变体拼写（如V1@gr@、W4tch_th1s）、特殊符号插入（如“f.r.e.e”）
- **内容隐藏**：HTML注释嵌套文本、白色文字+白色背景（视觉不可见但机器可识别）
- **图像垃圾邮件**：将文本内容嵌入图片（如截图包含“free money”），规避文本检测
- **上下文攻击**：添加大量正常文本（如新闻段落）稀释垃圾特征，降低检测率

#### **2. 防御机制**
- **多模态分析**：结合文本、图像（OCR识别图片文字）、邮件元数据（发件IP、发送时间）
- **对抗训练**：在训练集中加入对抗样本（如上述混淆文本），提升模型鲁棒性
- **集成检测**：多个检测器协同（如规则引擎+机器学习模型+行为分析）
- **行为分析**：监控发件人模式（如同一IP短时间发送上千封邮件）、收件人分布（随机群发）

### 五、生产环境考量

#### **1. 实时性能要求**
- **延迟约束**：单邮件处理时间需<100ms（避免邮件发送阻塞）
- **吞吐量需求**：支持高并发（如大型邮件服务商需处理数千封/秒）
- **资源效率**：优化内存（如特征缓存）、CPU（如模型量化）使用

#### **2. 系统架构**
\`\`\`
[接收队列] → [预处理模块] → [特征提取模块] → [分类器模块] → [后处理模块] → [决策执行]
    ↓             ↓               ↓             ↓            ↓             ↓
[负载均衡]  [文本清洗/OCR] [TF-IDF/Embedding] [模型推理]   [规则过滤]   [拦截/放行/标记]
\`\`\`

#### **3. 隐私与合规**
- **端到端加密**：处理加密邮件（如TLS传输）时，需在解密后检测（需符合隐私法规）
- **数据匿名化**：移除邮件中的个人身份信息（PII），如姓名、电话、邮箱
- **合规性**：符合GDPR（欧盟）、CCPA（加州）等数据保护法规，避免数据滥用

### **六、前沿研究方向**

1. **联邦学习**：多机构在不共享原始数据的情况下，联合训练模型（解决数据孤岛问题）
2. **少样本学习**：利用少量标注样本（如100封新型垃圾邮件）快速适配新垃圾特征
3. **可解释AI**：提供分类决策解释（如“该邮件被标记为垃圾，因包含‘free viagra’”），提升可信度
4. **多语言处理**：支持跨语言垃圾邮件检测（如英文、中文、西班牙语），适配全球化服务
`;

const discussTabList = [
  {
    id: 0,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,

  },

  {
    id: 1,
    label: '拓展知识',
    name: 'knowledge',
    icon: Book,
  },

  {
    id: 2,
    label: '讨论区',
    name: 'comment',
    icon: MessagesSquare,
  },
  {
    id: 3,
    label: 'AI帮助',
    name: 'aihelp',
    icon: Bot,
  },
];

function onHtmlLoad() {
  console.log('垃圾邮件过滤HTML页面加载完成');
}

onMounted(() => {
  console.log('垃圾邮件过滤实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="垃圾邮件过滤" :tags="[]" :panel-size="90" :show-parameter-panel="false" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter1/spam-filtering.html"
          width="100%"
          height="100%"
          frameborder="0"
          class="integration-iframe"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(content)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="spam-filtering" />
    </template>

    <template #knowledge>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(knowledgeContent)" />
        </div>
      </div>
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.integration-iframe {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
