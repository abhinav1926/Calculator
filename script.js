// Calculator variables
let display = document.getElementById('display-value');
let historyDisplay = document.getElementById('history');
let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;
let historyValue = '';

//  number to display
function appendNumber(num) {
    if (shouldResetDisplay) {
        if (historyValue.includes('=')) {
            historyValue = '';
        }
        currentValue = num === '.' ? '0.' : num;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }


    if (num === '.' && currentValue.includes('.')) {
        return;
    }

    if (currentValue === '0' && num !== '.') {
        currentValue = num;
    } else {
        currentValue += num;
    }
    
    if (!shouldResetDisplay && operator !== null) {
        highlightOperator(null);
    }

    updateDisplay();
}

function highlightOperator(op) {
    document.querySelectorAll('.op-btn').forEach(btn => {
        if (btn.getAttribute('data-operator') === op) {
            btn.classList.add('active-operator');
        } else {
            btn.classList.remove('active-operator');
        }
    });
}

function appendOperator(op) {

    if (historyValue.includes('=')) {
        historyValue = '';
    }

    if (operator !== null && !shouldResetDisplay) {
        currentValue = calculateResult().toString();
    }

    historyValue = `${currentValue} ${op}`;
    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
    highlightOperator(op);
    updateDisplay();
}

// Calculate the result
function calculate() {

    if (operator === null || shouldResetDisplay) {
        return;
    }

    historyValue = `${previousValue} ${operator} ${currentValue} =`;
    let result = calculateResult();
    currentValue = result.toString();
    operator = null;
    previousValue = '';
    shouldResetDisplay = true;
    highlightOperator(null);
    updateDisplay();
}

function calculateResult() {
    let result = 0;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    if (operator === '+') {
        result = prev + current;
    } else if (operator === '-') {
        result = prev - current;
    } else if (operator === '*') {
        result = prev * current;
    } else if (operator === '/') {
        // Prevent division by zero
        if (current === 0) {
            alert('Cannot divide by zero!');
            clearDisplay();
            return 0;
        }
        result = prev / current;
    }

    return Math.round(result * 100000000) / 100000000; 
}

// Clear the display

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    historyValue = '';
    highlightOperator(null);
    updateDisplay();
}

// Delete last char 
function deleteLast() {
    if (shouldResetDisplay) {
        if (historyValue.includes('=')) {
            historyValue = '';
        }
        currentValue = '0';
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }
    
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
        if (currentValue === '-') {
            currentValue = '0';
        }
    } else {
        currentValue = '0';
    }
    updateDisplay();
}


function toggleSign() {
    if (shouldResetDisplay) {
        if (historyValue.includes('=')) {
            historyValue = '';
        }
        shouldResetDisplay = false;
    }
    const num = parseFloat(currentValue);
    currentValue = (num * -1).toString();
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.textContent = currentValue;
    historyDisplay.textContent = historyValue;
}


document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    }
    else if (key === '.') {
        appendNumber('.');
    }
    else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    }

    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    else if (key === 'Backspace') {
        deleteLast();
    }
    else if (key === 'Escape') {
        clearDisplay();
    }
});

// Initialize display
updateDisplay();
