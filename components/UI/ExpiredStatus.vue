<template>
  <div v-if="uploaded">
    <span v-if="title">{{ title }}</span>
    <VueCountdown
      :time="end_timer"
      :transform="transformSlotProps"
      v-slot="{ days, hours, minutes, seconds }"
      @end="onCountdownEnd"
    >
      <span class="counter font-bold">
        <span v-if="days != '00'">{{ days }} дн. </span>
        <span v-if="hours != '00'">{{ hours }} час. </span>
        <span>{{ minutes }} мин. </span>
        <span>{{ seconds }} сек.</span>
      </span>
    </VueCountdown>
  </div>
</template>

<script>
import moment from "moment";
import VueCountdown from "@chenfengyuan/vue-countdown";
export default {
  props: {
    time: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      end_timer: null,
      uploaded: false,
    };
  },
  async mounted() {
    await this.setTimer();
    this.uploaded = true;
  },
  methods: {
    transformSlotProps(props) {
      const formattedProps = {};

      Object.entries(props).forEach(([key, value]) => {
        formattedProps[key] = value < 10 ? `0${value}` : String(value);
      });

      return formattedProps;
    },
    onCountdownEnd() {
      this.$emit("time_end");
    },
    async setTimer() {
      this.end_timer = moment(this.time) - moment();
      if (this.end_timer < 0) this.$emit("time_end");
    },
  },
  emits: ["time_end"],
  components: { VueCountdown },
};
</script>

<style></style>
