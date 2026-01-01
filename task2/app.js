class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
    }
    
    backspace() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    appendNumber(number) {
        if (this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetScreen = true;
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operationSymbols = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷',
                'percentage': '%'
            };
            
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbols[this.operation]}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-operation="equals"]');
const clearButton = document.querySelector('[data-operation="clear"]');
const backspaceButton = document.querySelector('[data-operation="backspace"]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

// Initialize Calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners for buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.getAttribute('data-operation');
        
        if (operation === 'equals') {
            calculator.calculate();
        } else if (operation === 'clear') {
            calculator.clear();
        } else if (operation === 'backspace') {
            calculator.backspace();
        } else {
            calculator.chooseOperation(operation);
        }
        
        calculator.updateDisplay();
    });
});

// Keyboard Support
document.addEventListener('keydown', event => {
    let keyPressed = event.key;
    
    // Prevent default behavior for calculator keys
    if (/[0-9\.\+\-\*\/\%=]|Enter|Escape|Backspace/.test(keyPressed)) {
        event.preventDefault();
    }
    
    // Number keys (0-9) and decimal point
    if (/[0-9]/.test(keyPressed)) {
        calculator.appendNumber(keyPressed);
    } else if (keyPressed === '.') {
        calculator.appendNumber('.');
    }
    
    // Operation keys
    if (keyPressed === '+') {
        calculator.chooseOperation('add');
    } else if (keyPressed === '-') {
        calculator.chooseOperation('subtract');
    } else if (keyPressed === '*') {
        calculator.chooseOperation('multiply');
    } else if (keyPressed === '/') {
        calculator.chooseOperation('divide');
    } else if (keyPressed === '%') {
        calculator.chooseOperation('percentage');
    }
    
    // Special keys
    if (keyPressed === 'Enter' || keyPressed === '=') {
        calculator.calculate();
    } else if (keyPressed === 'Escape' || keyPressed === 'Delete') {
        calculator.clear();
    } else if (keyPressed === 'Backspace') {
        calculator.backspace();
    }
    
    calculator.updateDisplay();
});

// Add button press animation
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Initialize display
calculator.updateDisplay();