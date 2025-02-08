/**
 * 抽奖游戏类
 * 实现抽奖的核心功能，确保号码不重复
 */
class LotteryGame {
    constructor() {
        // 初始化可用数字池（1-100）
        this.availableNumbers = Array.from({length: 100}, (_, i) => i + 1);
        // 已抽取的数字集合
        this.usedNumbers = new Set();
        // 抽奖状态标志
        this.isRunning = false;
        // 数字滚动的定时器
        this.currentInterval = null;
        // 中奖历史记录
        this.history = [];
        
        // 获取DOM元素
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.currentNumber = document.getElementById('current-number');
        this.historyList = document.getElementById('history-list');
        
        // 绑定按钮点击事件
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());

        // 初始化显示
        this.updateDisplay();
    }

    /**
     * 获取随机未使用的号码
     * @returns {number} 随机号码
     */
    getRandomNumber() {
        if (this.availableNumbers.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.availableNumbers.length);
        return this.availableNumbers[randomIndex];
    }

    /**
     * 更新显示状态
     */
    updateDisplay() {
        // 更新剩余号码数量显示
        const remainingCount = this.availableNumbers.length;
        this.startBtn.textContent = `开始抽奖 (剩余${remainingCount}个)`;
        
        // 当没有可用号码时禁用开始按钮
        if (remainingCount === 0) {
            this.startBtn.disabled = true;
            this.startBtn.textContent = '号码已抽完';
        }
    }

    /**
     * 开始抽奖
     */
    start() {
        // 检查是否还有可用号码
        if (this.availableNumbers.length === 0) {
            alert('所有号码已抽完！');
            return;
        }

        // 更新状态和按钮
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        
        // 启动数字滚动动画
        this.currentInterval = setInterval(() => {
            const randomNum = this.getRandomNumber();
            if (randomNum) {
                this.currentNumber.textContent = randomNum;
            }
        }, 50);
    }

    /**
     * 停止抽奖
     */
    stop() {
        if (!this.isRunning) return;

        // 停止滚动动画
        this.isRunning = false;
        clearInterval(this.currentInterval);
        
        // 获取并记录中奖号码
        const winningNumber = parseInt(this.currentNumber.textContent);
        
        // 从可用数字池中移除中奖号码
        const index = this.availableNumbers.indexOf(winningNumber);
        if (index > -1) {
            this.availableNumbers.splice(index, 1);
            this.usedNumbers.add(winningNumber);
        }
        
        // 添加中奖动画效果
        this.currentNumber.classList.add('active');
        setTimeout(() => {
            this.currentNumber.classList.remove('active');
        }, 1000);
        
        // 更新历史记录
        this.updateHistory(winningNumber);
        
        // 禁用按钮3秒
        this.startBtn.disabled = true;
        this.stopBtn.disabled = true;
        
        // 3秒后恢复按钮状态
        setTimeout(() => {
            this.startBtn.disabled = this.availableNumbers.length === 0;
            this.stopBtn.disabled = true;
            this.updateDisplay();
        }, 3000);
    }

    /**
     * 更新中奖历史记录
     * @param {number} number - 中奖号码
     */
    updateHistory(number) {
        // 将新中奖号码添加到历史记录开头
        this.history.unshift(number);
        // 保持最多显示5条记录
        if (this.history.length > 5) {
            this.history.pop();
        }
        
        // 更新历史记录显示
        this.historyList.innerHTML = this.history
            .map(num => `<li>第${num}号</li>`)
            .join('');
    }
}

// 当DOM加载完成后初始化抽奖游戏
document.addEventListener('DOMContentLoaded', () => {
    new LotteryGame();
}); 