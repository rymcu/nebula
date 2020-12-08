<template>
  <el-row class="wrapper">
    <el-col v-for="answerRecord in answerRecords" :key="answerRecord.id">
      <el-col class="question-content">
        <span v-html="getQuestionContent(answerRecord.questionContent)"></span>
      </el-col>
      <el-col>
        <el-col v-if="answerRecord.subjectAnswerRecords">
          <el-col class="question-option">
            <el-radio-group v-model="answerRecord.subjectAnswerRecords[0].answer" :disabled="true">
              <template v-for="subjectOption in answerRecord.subjectOptionDTOList">
                <el-radio :key="subjectOption.optionName" :label="subjectOption.optionName">
                  <span>{{ subjectOption.optionName }}.</span>
                  <span>{{ subjectOption.optionContent }}</span>
                </el-radio>
              </template>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            你的答案: <span class="question-answer">{{answerRecord.subjectAnswerRecords[0].answer}}</span>
          </el-col>
          <el-col class="question-operate" :span="8">
            <el-button type="primary" @click="getAnswer">查看答案</el-button>
          </el-col>
          <el-col v-if="correctAnswer">
            正确答案: <span class="question-answer">{{ correctAnswer }}</span>
          </el-col>
        </el-col>
        <el-col v-else>
          <el-col class="question-option">
            <el-radio-group v-model="answer">
              <template v-for="subjectOption in answerRecord.subjectOptionDTOList">
                <el-radio :key="subjectOption.optionName" :label="subjectOption.optionName">
                  <span>{{ subjectOption.optionName }}.</span>
                  <span>{{ subjectOption.optionContent }}</span>
                </el-radio>
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
  fetch({store, params, error}) {
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
      questionContent = questionContent.replace("（", "");
      questionContent = questionContent.replace("）", "");
      return questionContent;
    },
    getAnswer() {
      let _ts = this;
      _ts.$axios.$get("/api/answer/get-answer", {
        params: {
          idSubjectQuestion: _ts.answerRecords[0].id
        }
      }).then(function (res) {
        if (res) {
          _ts.$set(_ts, 'correctAnswer', res.respData);
        }
      })
    },
    submitAnswer() {
      let _ts = this;
      _ts.$axios.$post("/api/answer/answer", {
        idSubjectQuestion: _ts.answerRecords[0].id,
        answer: _ts.answer
      }).then(function (res) {
        if (res) {
          if (res.respFlag) {
            _ts.$message(res.message);
            _ts.$store.dispatch('answer/fetchDetail');
          } else {
            _ts.$message(res.message);
          }
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'answer');
  }
}
</script>

<style scoped>
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
</style>
