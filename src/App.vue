<template>
  <h1>Match 3</h1>
  <div class="info">
    <h2>得分: {{ score }}</h2>
    <h2>行動點數: {{ actionPoints }}</h2>
  </div>
  <div
    class="board"
    :style="{
      width: setting.column * 50 + 'px',
      height: setting.row * 50 + 'px',
    }"
  >
    <div class="row" v-for="(row, index) in boardArray" :key="index">
      <div
        class="candy"
        v-for="candy in row"
        :key="candy.id"
        :style="{
          background: candy.color,
          top: candy.y * 50 + 'px',
          left: candy.x * 50 + 'px',
        }"
        draggable="true"
        @dragstart="dragstart(candy)"
        @dragover.prevent="() => {}"
        @drop="drop(candy)"
      >
        <!-- {{ candy.id }} -->
      </div>
    </div>
  </div>
</template>

<script>
import game from "./logic/index";
import { ref, onMounted, watch } from "vue";

export default {
  name: "App",
  setup() {
    const {
      boardArray,
      setting,
      score,
      actionPoints,
      isGameStart,
      init,
      dropCandy,
      checkMatch,
      clearUpMatch,
      resetGame,
      checkEmpty,
    } = game();

    const draggingCandy = ref(null);
    const dropingCandy = ref(null);

    onMounted(init);

    watch(boardArray, () => {
      setTimeout(() => {
        while (checkEmpty()) {
          dropCandy();
        }

        boardArray.value.forEach((row) => {
          row.forEach((candy) => {
            clearUpMatch(checkMatch(candy));
          });
        });
      }, 300);
    });

    watch(actionPoints, () => {
      if (actionPoints.value === 0) resetGame();
    });

    const dragstart = (candy) => {
      isGameStart.value = true;
      draggingCandy.value = candy;
    };

    const drop = (candy) => {
      dropingCandy.value = candy;
      const dragCandy = { ...draggingCandy.value };
      const dropCandy = { ...dropingCandy.value };

      if (
        Math.abs(dragCandy.y - dropCandy.y + (dragCandy.x - dropCandy.x)) !== 1
      ) {
        return;
      }

      boardArray.value[dropCandy.y][dropCandy.x] = draggingCandy.value = {
        ...dragCandy,
        y: dropCandy.y,
        x: dropCandy.x,
      };
      boardArray.value[dragCandy.y][dragCandy.x] = dropingCandy.value = {
        ...dropCandy,
        y: dragCandy.y,
        x: dragCandy.x,
      };

      if (
        !checkMatch(draggingCandy.value).length &&
        !checkMatch(dropingCandy.value).length
      ) {
        boardArray.value[dropCandy.y][dropCandy.x] = { ...dropCandy };
        boardArray.value[dragCandy.y][dragCandy.x] = { ...dragCandy };
        boardArray.value = [...boardArray.value];
        return;
      }

      clearUpMatch(checkMatch(draggingCandy.value));
      clearUpMatch(checkMatch(dropingCandy.value));

      boardArray.value = [...boardArray.value];
      actionPoints.value -= 1;
    };

    return { boardArray, setting, score, actionPoints, dragstart, drop };
  },
};
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.info {
  width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.board {
  position: relative;
  /* width: 250px; */
  /* height: 250px; */
  align-items: center;
  margin: 0 auto;
  /* border: 1px solid black; */
  /* transition: 2s all ease; */
  /* display: flex; 
  flex-direction: column;
  gap: 5px; */
}

.row {
  /* display: flex; */
  /* gap: 5px; */
  /* transition: 2s all ease; */
}

.candy {
  position: absolute;

  color: black;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* border: 1px solid black; */
  display: inline-block;
  /* transition: 2s all ease; */
}
</style>