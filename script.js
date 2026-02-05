const getElement = (id) => document.getElementById(id);

function endProgram(){
    const btn = document.querySelectorAll(".btn");
    btn.forEach(btns => {
        btns.disabled = true;
    })
}

class ParkTime {
    constructor(){
        this.error = getElement("errorText");
        this.time = getElement("time");
        this.addTime = getElement("add");
        this.changeValue = getElement("change")
    }

    addValue(depositValue, targetValue){
        return targetValue - depositValue;
    }

    change(depositValue, targetValue){
        return depositValue - targetValue;
    }

    clearText(except = []){
        if(!except.includes ('error')){
            this.error.textContent = "";
        }
        if(!except.includes ('time')){
            this.time.textContent = "";
        }
        if(!except.includes ('addTime')){
            this.addTime.textContent = "";
        }
        if(!except.includes ('changeValue')){
            this.changeValue.textContent = "";
        }
    }

    calculate(){
        const userZone = getElement("zone");
        const depositInput = getElement("deposit");
        const depositValue = parseFloat(depositInput.value);
        this.lastDeposit = depositValue;

        if(isNaN(depositValue) || userZone.value === ''){
            alert("Um ou mais valores são nulos");
            this.time.textContent = "O tempo aparecerá aqui."
            depositInput.value = "";
            userZone.value = "";
            return
        }

        if(depositValue < 1){
            this.error.textContent = "Valor não pode ser menor que R$ 1,00";
            this.error.style.color = "red";
            this.clearText(["error"]);
            return
        } else if(depositValue < 1.75){
            this.time.textContent = "1. Você terá direito a 30 minutos";
            this.addTime.textContent = `2. Adicione +R$${this.addValue(depositValue, 1.75).toFixed(2)} para 60 minutos`;
            if(depositValue > 1){
                this.changeValue.textContent = `2. Você receberá de troco = R$${this.change(depositValue, 1).toFixed(2)}`
            }
        } else if(depositValue >= 1.75 && depositValue < 3){
            this.time.textContent = "1. Você terá direito a 60 minutos";
            if(depositValue > 1.75){
                this.changeValue.textContent = `2. Você receberá de troco = R$${this.change(depositValue, 1.75).toFixed(2)}`
            }
            this.addTime.textContent = `3. Adicione +R$${this.addValue(depositValue, 3).toFixed(2)} para 120 minutos`;
        } else if(depositValue >= 3){
            this.time.textContent = "1. Você terá direito a 120 minutos";
            this.addTime.style.color = "red";
            this.addTime.textContent = `Alerta: prazo máximo de 2 horas atingido!`;
            this.clearText(['addTime', 'time']);
            if(depositValue > 3){
                this.changeValue.textContent = `2. Troco R$${this.change(depositValue, 3).toFixed(2)}`
            }
        }
    }
}


class CountdownTimer{
    constructor(parktime){
        this.parktime = parktime;
        this.userTimer = null;
    }

    countdown(){
        const timer = this.parktime.lastDeposit;
        let minuts = 0;
        if(timer < 1.75){
            minuts = 30;
        } else if(timer >= 1.75 && timer < 3){
            minuts = 60;
        } else if(timer >= 3){
            minuts = 120;
        }

        let seconds = minuts * 60;
        const countdownTxt = getElement("countdown");

        if(this.userTimer) {
            clearInterval(this.userTimer);
        }

        this.userTimer = setInterval(() => {
            if(seconds <= 0){
                clearInterval(this.userTimer);
                countdownTxt.textContent = "O tempo acabou";
                countdownTxt.style.textAlign = "center";
                return;
            }

            seconds --;

            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;


            const hrs = String(h).padStart(2, '0');
            const min = String(m).padStart(2, '0');
            const sec = String(s).padStart(2, '0');

            countdownTxt.textContent = `${hrs}:${min}:${sec}`;
            countdownTxt.style.textAlign = "center";

        },1000)
    }
}

class Timer{
    constructor(countdown, parktime){
        this.countdown = countdown;
        this.parktime = parktime;
    }

    start(){

        endProgram();

        this.parktime.clearText();
        const timerValue = this.parktime.lastDeposit;
        const timerText = getElement("timerTxt");
        timerText.style.textAlign = "center";
        
        if(timerValue < 1.75){
            timerText.textContent = "Você adquiriu 30 minutos"
        } else if(timerValue >= 1.75 && timerValue < 3){
            timerText.textContent = "Você adquiriu 60 minutos"
        } else if(timerValue >= 3){
            timerText.textContent = "Você adquiriu 120 minutos"
        }

        this.countdown.countdown();
    }
}

const parktime = new ParkTime();
const countdown = new CountdownTimer(parktime);
const timer = new Timer(countdown, parktime);