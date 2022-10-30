<template>
  <el-row class="wrapper">
    <el-col v-for="answerRecord in answerRecords" :key="answerRecord.id">
      <el-col v-if="answerRecord.subjectAnswerRecords">
        <el-col class="question-tip">
          <h1>✨ 您已完成今日答题任务!</h1>
        </el-col>
        <el-col>
          <h2>答题记录</h2>
        </el-col>
      </el-col>
      <el-col class="question-content">
        <h2 v-html="getQuestionContent(answerRecord.questionContent)"></h2>
      </el-col>
      <el-col>
        <el-col v-if="answerRecord.subjectAnswerRecords">
          <el-col class="question-option">
            <el-radio-group v-model="answerRecord.subjectAnswerRecords[0].answer" :disabled="true">
              <template v-for="subjectOption in answerRecord.subjectOptionDTOList">
                <el-col :span="24" style="margin-bottom: 10px;">
                  <el-radio :key="subjectOption.optionName" :label="subjectOption.optionName">
                    <span>{{ subjectOption.optionName }}.</span>
                    <span>{{ subjectOption.optionContent }}</span>
                  </el-radio>
                </el-col>
              </template>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            你的答案:
            <span v-if="answerRecord.correctAnswer == answerRecord.subjectAnswerRecords[0].answer" class="question-answer answer-right">{{answerRecord.subjectAnswerRecords[0].answer}}</span>
            <span v-else class="question-answer answer-wrong">{{answerRecord.subjectAnswerRecords[0].answer}}</span>
          </el-col>
          <el-col class="question-operate" :span="6">
            正确答案: <span class="question-answer"> {{ answerRecord.correctAnswer }} </span>
          </el-col>
        </el-col>
        <el-col v-else>
          <el-col class="question-option">
            <el-radio-group v-model="answer">
              <template v-for="subjectOption in answerRecord.subjectOptionDTOList">
                <el-col :span="24" style="margin-bottom: 10px;">
                  <el-radio :key="subjectOption.optionName" :label="subjectOption.optionName">
                    <span>{{ subjectOption.optionName }}.</span>
                    <span>{{ subjectOption.optionContent }}</span>
                  </el-radio>
                </el-col>
              </template>
            </el-radio-group>
          </el-col>
          <el-col class="question-operate" :span="6">
            <el-button type="primary" @click="submitAnswer">提交答案</el-button>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "answer",
  middleware: 'auth',
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('answer/fetchDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      answerRecords: state => state.answer.detail.answerRecords
    })
  },
  data() {
    return {
      answer: '',
      correctAnswer: ''
    }
  },
  methods: {
    getQuestionContent(questionContent) {
      questionContent = questionContent.replace("（", "____");
      questionContent = questionContent.replace("）", "");
      return questionContent;
    },
    submitAnswer() {
      let _ts = this;
      _ts.$axios.$post("/api/answer/answer", {
        idSubjectQuestion: _ts.answerRecords[0].id,
        answer: _ts.answer
      }).then(function (res) {
        if (res) {
          _ts.$message.success('回答正确!');
        } else {
          _ts.$message.error('回答错误!');
        }
        _ts.$store.dispatch('answer/fetchDetail');
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'answer');
  }
}
</script>

<style scoped>
.question-tip {
  margin-bottom: 40px;
  margin-left: 15%;
}
.question-content {
  margin: 10px auto;
}
.question-option {
  margin: 10px auto;
}
.question-answer {
  font-size: 36px;
  padding-left: 10px;
}
.question-operate {
  margin: 10px auto;
  text-align: right;
}

.answer-right {
  color: limegreen;
}

.answer-wrong {
  color: red;
}
</style>
