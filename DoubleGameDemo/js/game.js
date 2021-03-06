var Game = function(){
    //dom元素
    var gameDiv;
    var nextDiv;
    var timeDiv;
    var scoreDiv;
    var resultDiv;
    var score = 0;
    //游戏矩阵
    var gameData = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ];
    //当前方块
    var cur;
    //下一个方块
    var next;
    //divs(20*20的小div，跟矩阵一一对应)
    var nextDivs = [];
    var gameDivs = [];
    //初始化div.(用于初始化游戏区和下一个方块区域的小div)
    var initDiv = (container,data,divs) => {
        for(var i = 0;i < data.length; i++){
        var div = [];
        for(var j = 0; j < data[0].length; j++){
            var newNode = document.createElement('div');
            newNode.className = 'none';
            newNode.style.top = (i*20) + 'px';
            newNode.style.left = (j*20) + 'px';
            container.appendChild(newNode);
            div.push(newNode);
        }
        divs.push(div);
        }
    }
    //刷新div
    var refreshDiv = (data,divs)=>{
    for(var i=0;i<data.length;i++){
        for(j=0;j<data[0].length;j++){
            if(data[i][j] == 0){
                divs[i][j].className = 'none';
            }else if(data[i][j] == 1){
                divs[i][j].className = 'done';
            }
            else if(data[i][j] == 2){
                divs[i][j].className = 'current';
            }
        }
    }
    }
    
    //检测点是否合法
    var check = (pos,x,y)=>{
        if(pos.x + x < 0){ //超出上边界
            return false;
        }else if(pos.x + x >= gameData.length){ //超出了下边界
            return false;
        }else if (pos.y + y < 0){ //超出了左边界
            return false;
        }else if(pos.y + y >=gameData[0].length){ //超出了右边界
            return false;
        }else if(gameData[pos.x + x][pos.y + y] == 1){ //已经有方块了
            return false;
        }else{
            return true;
        }
    }
    //设置数据
    var setData = ()=>{
        for(var i=0;i<cur.data.length;i++){
            for(var j=0;j<cur.data[0].length;j++){
                if(check(cur.origin,i,j)){
                    gameData[cur.origin.x + i][cur.origin.y+j] = cur.data[i][j];
                }
            }
        }
    }
    //检测数据是否合法
    var isValid = function(pos,data){
        for(var i=0;i<data.length;i++){
            for(var j=0; j<data[0].length;j++){
                if(data[i][j] != 0){
                    if(!check(pos,i,j)){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    //清除数据
    var clearData = ()=>{
        for(var i=0;i<cur.data.length;i++){
            for(var j=0;j<cur.data[0].length;j++){
                if(check(cur.origin,i,j)){
                    gameData[cur.origin.x + i][cur.origin.y+j] = 0;
                }
            }
        }
    }
    //下移
    var down = ()=>{
        if(cur.canDown(isValid)){
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData,gameDivs);
            return true;
        }else{
            return false;
        }
        
    }
    //左移
    var left = ()=>{
        if(cur.canLeft(isValid)){
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData,gameDivs);
        }
        
    }
    //右移
    var right = ()=>{
        if(cur.canRight(isValid)){
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData,gameDivs);
        }
        
    }
    //旋转
    var rotate = ()=>{
        if(cur.canRotate(isValid)){
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData,gameDivs);
        }
        
    }
    var fall = ()=>{
        while(down()){}
    }
    var fixed = function(){
        for(var i = 0;i<cur.data.length;i++){
            for(var j=0;j<cur.data[0].length;j++){
                if(check(cur.origin,i,j)){
                    if(gameData[cur.origin.x + i][cur.origin.y + j] == 2){
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                    }
                }
            }
        }
        refreshDiv(gameData,gameDivs);
    }
    //显示下一个方块
    var performNext = (generateType,generateDir)=>{
        cur = next;
        setData();
        next = SquareFactory.prototype.make(generateType,generateDir);
        refreshDiv(gameData,gameDivs);
        refreshDiv(next.data,nextDivs);

    }
    //消行
    var checkClear = ()=>{
        var line = 0;
        for(var i=gameData.length-1;i>=0;i--){
            var clear = true;
            for(var j=0;j<gameData[0].length;j++){
                if(gameData[i][j] != 1){
                    clear = false;
                    break;
                }
            }
            if(clear){
                line++;
                for(var m=i;m>0;m--){
                    for(var n=0;n<gameData[0].length;n++){
                        gameData[m][n] = gameData[m-1][n];
                    }
                }
                for(var n=0;n<gameData[0].length;n++){
                        gameData[0][n] = 0;
                }
                i++;
            }
        }   
        return line;
    }
    //检查游戏结束
    var checkGameover = ()=>{
        var gameOver = false;
        for(var i=0;i<gameData[0].length;i++){
            if(gameData[1][i] == 1){
                gameOver = true;
            }
        }
        return gameOver;
    }
    //设置时间
    var setTime = (time)=>{
        timeDiv.innerHTML = time;
    }
    //增加分数
    var addScore = (line)=>{
        var s=0;
        switch(line){
            case 1:s=10;break;
            case 2:s=20;break;
            case 3:s=40;break;
            case 4:s=100;break;
            default:break;
        }
        score = score + s;
        scoreDiv.innerHTML = score;
    }
    //游戏结束
    var gameover = function(win){
        if(win){
            resultDiv.innerHTML = '你赢了';
        }else{
            resultDiv.innerHTML = '你输了';
        }
    }
    //底部增加行
    var addTailLines = (lines)=>{
        for(var i=0;i<gameData.length-lines.length;i++){
            gameData[i] = gameData[i+lines.length];
        }
        for(var i=0;i<lines.length;i++){
            gameData[gameData.length - lines.length + i] = lines[i];
        }
        cur.origin.x = cur.origin.x - lines.length;
        if(cur.origin.x < 0){
            cur.origin.x = 0;
        }
        refreshDiv(gameData,gameDivs);
    }
    //初始化
    var init = (doms,type,dir)=>{
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        next = new SquareFactory.prototype.make(type,dir);
        initDiv(gameDiv,gameData,gameDivs);
        initDiv(nextDiv,next.data,nextDivs);
        refreshDiv(next.data,nextDivs);
    }
    //导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = fall;
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameover = checkGameover;
    this.setTime = setTime;
    this.addScore = addScore;
    this.gameover = gameover;
    this.addTailLines = addTailLines;
}