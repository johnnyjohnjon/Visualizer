import {checkWinner} from './ConnectFour';

class MinimaxAgent {
    constructor(board, depth) {
        this.scores = { "p1": -1000000, "tie": 0, "p2": -1000000 };
        this.cache = {};
        this.depth = depth;
        this.getAction(board);
    }

    getActions(board) {
        let actions = [];
        for (let index = 0; index < board.length; index++) {
            if (board[index][1] === null) {
                actions.push(index);
            }
        }
        return actions;
    }

    setDepth(d){
        this.depth = d;
    }

    getAction(board) {
        let actions = this.getActions(board);
        let maxVal = -Infinity;
        let maxValAction = null;
        board = board.map((a) => a.slice());
        for (const action of actions) {
            const boardCopy = board.map((a) => a.slice());
            console.log(this.depth);
            let val = this.minimax(this.tryMove(action, boardCopy, "p2"), false, -Infinity, Infinity, this.depth);
            //console.log(val);
            //console.log(action, val, boardCopy, this.getScore(boardCopy));
            if (maxVal < val) {
                maxVal = val;
                maxValAction = action;
            }
        }
        //console.log(maxVal, maxValAction);
        return maxValAction;
    }

    tryMove(colId, board, val) {
        let newCol = board[colId].reverse();
        newCol[newCol.indexOf(null)] = val;
        newCol.reverse();
        return board;
    }

    count(four, tar) {
        let count = 0;
        for (const each of four) {
            if (each === tar) {
                count++;
            }
        }
        return count;
    }

    scoreFour(a, b, c, d) {
        const four = [a, b, c, d];
        let score = 0;
        const count1 = this.count(four, "p1");
        const countN = this.count(four, null);
        const count2 = this.count(four, "p2");

        if (count1 === 2 && countN === 2) {
            return {sc: -500, three: 0};
        }
        if (count1 === 3 && countN === 1) {
            return {sc: -1000, three: -1};
        }
        
        if (count1 === 4) {
            return {sc: -100000, three: 0};
        }
        if (count2 === 4) {
            return {sc: 90000, three: 0};
        }

        if(count2 === 3 && countN==0){
            return {sc: 0, three: 1};
        }
        if(count1 === 3){
            return {sc: 0, three: -1};
        }
        return {sc: count2, three: 0};;
        
    }

    getScore(board) {
        let score = 0;

        score += 5 * this.count(board[3], "p2");
        let threes_one = []
        let threes_two = []
        for (let c = 0; c < 7; c++) {
            for (let r = 1; r < 4; r++) {
                let {sc:sc, three:three} = this.scoreFour(board[c][r], board[c][r + 1], board[c][r + 2], board[c][r + 3]);
                score += sc;
                if(three==1){
                    threes_two.push([(c, r), (c, r+1), (c, r+2), (c, r+3)]);
                }
                else if(three==-1){
                    threes_one.push([(c, r), (c, r+1), (c, r+2), (c, r+3)]);
                }
            }
        }


        for (let c = 0; c < 4; c++) {
            for (let r = 1; r < 7; r++) {
                let {sc:sc, three:three} = this.scoreFour(board[c][r], board[c + 1][r], board[c + 2][r], board[c + 3][r]);
                score += sc;
                if(three==1){
                    threes_two.push([(c, r), (c+1, r), (c+2, r), (c+3, r)]);
                }
                else if(three==-1){
                    threes_one.push([(c, r), (c+1, r), (c+2, r), (c+3, r)]);
                }
            }
        }

        for (let c = 0; c < 4; c++) {
            for (let r = 1; r < 4; r++) {
                let {sc:sc, three:three} = this.scoreFour(board[c][r], board[c + 1][r + 1], board[c + 2][r + 2], board[c + 3][r + 3]);
                score += sc;
                if(three==1){
                    threes_two.push([(c, r), (c+1, r+1), (c+2, r+2), (c+3, r+3)]);
                }
                else if(three==-1){
                    threes_one.push([(c, r), (c+1, r+1), (c+2, r+2), (c+3, r+3)]);
                }
            }
        }

        for (let c = 3; c < 7; c++) {
            for (let r = 1; r < 4; r++) {
                let {sc:sc, three:three} = this.scoreFour(board[c][r], board[c - 1][r + 1], board[c - 2][r + 2], board[c - 3][r + 3]);
                score += sc;
                if(three==1){
                    threes_two.push([(c, r), (c-1, r+1), (c-2, r+2), (c-3, r+3)]);
                }
                else if(three==-1){
                    threes_one.push([(c, r), (c-1, r+1), (c-2, r+2), (c-3, r+3)]);
                }
            }
        }
        score += 2000*(this.numDuplicate(threes_two)-2*this.numDuplicate(threes_one));
        return score;
    }

    numDuplicate(arr){
        let count = {};
        let result = 0;
        for (let ele of arr){
            if(count[ele]){
                result++;
            }
            else{
                count[ele] = 1;
            }
        }
        return result;
    }

    toHash(board) {
        let re = "";
        for (let c = 0; c < 7; c++) {
            for (let r = 1; r < 7; r++) {
                if (board[c][r])
                    re += board[c][r];
                else
                    re += "n";
            }
        }
        return re;
    }
    minimax(board, isMax, alpha, beta, depth) {
        //console.log(1);
        if (this.toHash(board) in this.cache) {
            return this.cache[this.toHash(board)];
        }
        board = board.map((a) => a.slice());

        if (checkWinner(board) || depth === 0) {
            let score = this.getScore(board);
            //console.log(this.toHash(board), score);
            this.cache[this.toHash(board)] = score;
            return score;
        }

        let actions = this.getActions(board);

        if (isMax) {
            let val = -Infinity;
            for (const action of actions) {
                const boardCopy = board.map((a) => a.slice());
                val = Math.max(val, this.minimax(this.tryMove(action, boardCopy, "p2"), false, alpha, beta, depth - 1));

                if (val >= beta) {
                    //console.log("maxb: " + val);
                    return val;
                }
                alpha = Math.max(alpha, val);
            }
            //console.log("max: " + val);
            return val;
        }
        else {
            let val = Infinity;
            for (const action of actions) {
                const boardCopy = board.map((a) => a.slice());
                val = Math.min(val, this.minimax(this.tryMove(action, boardCopy, "p1"), true, alpha, beta, depth - 1));
                //console.log(action, val);
                if (val <= alpha) {
                    return val;
                }
                beta = Math.min(beta, val);
            }
            return val;
        }
    }
}

export default MinimaxAgent;