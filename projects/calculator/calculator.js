let op1 = 0;
let op2 = 0;
let resultShown = false;
let operator = '';
const display = document.querySelector('.display');
const keyboard = document.querySelector('.keyboard');
if (keyboard) {
    keyboard.addEventListener('click', function (event) {
        const button = event.target;
        if (button.classList.contains('operator-key')) {
            if (operator == '') {
                operator = button.innerText;
                display.innerText = display.innerText + operator;
            }
        } else {
            if (button.classList.contains('number-key')) {
                if (operator == '') {
                    if (resultShown == true) {
                        resultShown = false;
                        op1 = 0;
                    }
                    op1 = op1 * 10 + parseInt(button.innerText);
                    display.innerText = op1;
                } else {
                    op2 = op2 * 10 + parseInt(button.innerText);
                    display.innerText = display.innerText + button.innerText;
                }
            } else {
                if (button.innerText == '=') {
                    switch (operator) {
                        case '+': op1 += op2; break;
                        case '-': op1 -= op2; break;
                        case 'x': op1 *= op2; break;
                        case '÷': op1 /= op2; break;
                        default: break;
                    }
                    operator = '';
                    op2 = 0;
                    display.innerText = op1.toFixed(2)/1;
                    //display.innerText = op1.toFixed(13-Math.floor(op1))/1;
                    resultShown = true;
                } else if (button.innerText == 'C') {
                    borrarTodo();
                } else {
                    if (resultShown == true) {
                        borrarTodo();
                    } else {
                        if (operator == '') {
                            op1 = Math.floor(op1 / 10);
                            display.innerText = op1;
                        } else {
                            if (op2 == 0) {
                                operator = '';
                                display.innerText = op1;
                            } else {
                                op2 = Math.floor(op2 / 10);
                                display.innerText = op1 + operator;
                                if (op2 != 0) {
                                    display.innerText += op2;
                                }
                            }
                        }
                    }
                }
            }
        }

        event.stopPropagation();
    });
} else {
    console.log("NO");
}

function borrarTodo() {
    op1 = 0;
    op2 = 0;
    operator = '';
    display.innerText = '0';
    resultShown = false;
}