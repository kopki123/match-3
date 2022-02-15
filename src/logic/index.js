import { ref } from 'vue';

const game = () => {
    const boardArray = ref([]);
    const setting = ref({
        row: 5,
        column: 5,
        colors: ['red', 'blue', 'green', 'pink'],
    })
    const candyId = ref(0);
    const score = ref(0);
    const actionPoints = ref(5);
    const isGameStart = ref(false);

    const init = () => {
        const { row, column, colors } = setting.value;
        boardArray.value = [];

        //填充空白球
        for (let y = 0; y < row; y++) {
            const row = [];

            for (let x = 0; x < column; x++) {
                const candy = {
                    x,
                    y,
                    color: colors[getRandomNumber(colors.length)],
                    id: candyId.value,
                }
                candyId.value += 1;

                row.push(candy);
            }

            boardArray.value.push(row);
        }

        boardArray.value = [ ...boardArray.value ];
    }

    const checkEmpty = () => {
        let haveEmpty = false;

        boardArray.value.forEach(row => {
            const rowHaveEmpty = row.some(candy => {
                return candy.color === ''
            }) 

            if(rowHaveEmpty) {
                haveEmpty = true;
            }
        })
        
        return haveEmpty;
    }

    const dropCandy = () => {
        boardArray.value[0].forEach((candy, x) => {
            if(candy.color === '') {
                boardArray.value[0][x] = {
                    x,
                    y: 0,
                    color: setting.value.colors[getRandomNumber(setting.value.colors.length)],
                    id: candyId.value
                }

                candyId.value += 1
            }
        })

        for (let y = boardArray.value.length - 1; y > 0; y--) {
            for(let x = boardArray.value[y].length - 1; x >= 0; x--) {
                if(boardArray.value[y][x].color === '') {
                    boardArray.value[y][x] = { ...boardArray.value[y - 1][x] }
                    boardArray.value[y][x].y += 1

                    boardArray.value[y - 1][x].color = ''
                }
            }
        }

        // boardArray.value = [...boardArray.value]
    }

    const checkMatch = (candy) => {
        const { x, y, color, id } = candy;

        if(candy.color === '') return [];

        const candyNeedClearColumn = [];
        const candyNeedClearRow = [];
        let candyNeedClearTotal = [id];

        // check top
        for(let yIdx = y - 1; yIdx >= 0; yIdx--) {
            if(boardArray.value[yIdx][x].color !== color) break
            candyNeedClearColumn.push(boardArray.value[yIdx][x].id)
        }

        // check down
        for(let yIdx = y + 1; yIdx < boardArray.value.length; yIdx++) {
            if(boardArray.value[yIdx][x].color !== color) break
            candyNeedClearColumn.push(boardArray.value[yIdx][x].id)
        }

        // check right
        for(let xIdx = x - 1; xIdx >= 0; xIdx--) {
            if(boardArray.value[y][xIdx].color !== color) break
            candyNeedClearRow.push(boardArray.value[y][xIdx].id)
        }

        // check left
        for(let xIdx = x + 1; xIdx < boardArray.value[y].length; xIdx++) {
            if(boardArray.value[y][xIdx].color !== color) break
            candyNeedClearRow.push(boardArray.value[y][xIdx].id)
        }

        if(candyNeedClearColumn.length >= 2) {
            candyNeedClearTotal = [...candyNeedClearTotal, ...candyNeedClearColumn]
        }

        if(candyNeedClearRow.length >= 2) {
            candyNeedClearTotal = [...candyNeedClearTotal, ...candyNeedClearRow]
        }

        console.log(candyNeedClearTotal);

        if(candyNeedClearTotal.length >= 3) {
            return candyNeedClearTotal
        }
        
        return []
    }

    const clearUpMatch = (clearUpArr) => {
        
        if(clearUpArr.length === 0) return;
        console.log(clearUpArr);

        for (let y = 0; y < boardArray.value.length; y++) {
            for (let x = 0; x < boardArray.value[y].length; x++) {
                if(clearUpArr.includes(boardArray.value[y][x].id)) {
                    boardArray.value[y][x].color = ''
                }
            }
        }

        if(isGameStart.value) {
            calcScore(clearUpArr.length)
        }
        boardArray.value = [ ...boardArray.value ];
    }

    const resetGame = () => {
        setTimeout(() => {
            alert('reset');
            isGameStart.value = false;
            candyId.value = 0;
            score.value = 0;
            actionPoints.value = 5;
            init();
        }, 100);
    }

    const getRandomNumber = (max) => {
        return Math.floor(Math.random() * max)
    }

    const calcScore = (length) => {
        if(length === 3) {
            score.value += 3
        }

        if(length > 3) {
            score.value += 3 * Math.pow(2, length - 3)
        }
    }

    return {
        boardArray,
        score,
        actionPoints,
        isGameStart,
        init,
        dropCandy,
        checkMatch,
        clearUpMatch,
        resetGame,
        checkEmpty
    }
}

export default game;