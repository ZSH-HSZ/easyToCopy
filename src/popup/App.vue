<template>
  <div id="app">
    <h3 @click="sendMessage()">Easy to copy !</h3>
    <div class="align between item-line">
      <div>copy状态</div>
      <ToggleSwitch @change="change" :value="false" />
    </div>
    <div class="align item-line">
      <div class="left-label">target:</div>
      <div class="flex-all flex">
        <input
          class="flex-all"
          v-model="copyTarget"
          placeholder="edit me"
          @keyup.enter="sendMessage()"
        />
      </div>
    </div>
    <div class="align item-line">
      <div class="left-label">default:</div>
      <div class="flex-all flex">
        <input
          class="flex-all"
          v-model="defaultData"
          placeholder="edit me"
          @keyup.enter="sendMessage()"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ToggleSwitch from './components/toggle-switch.vue';
export default {
  name: 'app',
  components: {
    ToggleSwitch,
  },
  data() {
    return {
      copyTarget: '',
      defaultData: '',
      status: false,
    };
  },
  methods: {
    sendMessage(values) {
      let _this = this;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            target: 'content',
            type: 'copyWrite',
            status: _this.status,
            copyTarget: _this.copyTarget,
            defaultData: _this.defaultData,
          },
          function(response) {
            console.log(response);
          }
        );
      });
    },
    change(values) {
      console.log(values);
      this.status = values;
      this.sendMessage({ status: values });
    },
  },
};
</script>
<style scoped>
.left-label {
  width: 100px;
}
.item-line {
  margin: 10px 0;
}
#app {
  width: 420px;
  height: auto;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: #f5f5f5;
  padding: 10px;
}
.flex {
  display: flex;
}

.aline {
  display: flex;
  align-items: center;
}

.align {
  display: flex;
  align-items: center;
}

.direction {
  display: flex;
  flex-direction: column;
}

.around {
  display: flex;
  justify-content: space-around;
}

.between {
  display: flex;
  justify-content: space-between;
}

.jus {
  display: flex;
  justify-content: center;
}

.flex-all {
  flex: 1;
}

.wrap {
  flex-wrap: wrap;
  overflow: hidden;
}

.point {
  cursor: pointer;
}
</style>
