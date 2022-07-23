/** Global variables - these Strings are used to displayed in the calculator screen
 *  or used to perform the task of calculating, clearing, and backspacing
 */
var activeNumber = "0";
var prevNumber = "0";
var prevNumber2 = ""
var expression = "";
var lastOperator = "";
var lastInput = "";
var expressionHistory = ["", "", "", ""];

$(document).ready(function () {

    evaluateExpression();
    updateDisplay();

});

/**
 * initializeButtons Function - initializes the buttons
 */
const numbers = document.querySelectorAll('.button-number');

numbers.forEach(number => {
    number.addEventListener('click', function () {
        addDigit(this.id);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key >= 0 && event.key <= 9 || event.key == '.') {
        addDigit(event.key);
    }
    else {
        switch (event.key) {
            case '+': performOperant('+');
                break;
            case '-': performOperant('-');
                break;
            case '*': performOperant('×');
                break;
            case '/': performOperant('÷');
                break;
            case '=':
            case 'Enter':
                performOperant('=');
                break;
            case "Backspace": performOperant('bsp');
                break;
        }
    }
});

document.querySelector("#additionButton").addEventListener('click', function () {
    performOperant('+');
});

document.querySelector("#subtractButton").addEventListener('click', function () {
    performOperant('-');
});

document.querySelector("#multiplyButton").addEventListener('click', function () {
    performOperant('×');
});

document.querySelector("#divideButton").addEventListener('click', function () {
    performOperant('÷');
});

document.querySelector("#equalButton").addEventListener('click', function () {
    performOperant('=');
});

document.querySelector("#backspaceButton").addEventListener('click', function () {
    performOperant('bsp');
});

document.querySelector("#clearButton").addEventListener('click', function () {
    performOperant('clr');
});

document.querySelector("#oppositeButton").addEventListener('click', function () {
    performOpposite('opp');
});

/**
 * addDigit Function - add a numeric or decimal to the calculator display
 * the String of the number (i.e., '1', '2', etc. )
 */
function addDigit(input) {
    //If there is a decimal present in the activeNumber, do not add another one
    if (input == "." && activeNumber.indexOf(".") >= 0) {
        return;

    } else if (activeNumber == "Infinity") {
        resetCalculator();
        return;
    }

    if (lastInput == "=") {
        activeNumber = "0";
        prevNumber = "0";
        lastOperator = "";

    } else if (/[\+\-\×\÷]/.test(lastInput) == true) {
        activeNumber = "0";

    }

    lastInput = input;
    activeNumber = activeNumber.concat(input);//appends input to 'activeNumber' string
    evaluateExpression(input);//checks the 'activeNumber' string
    updateDisplay();//update new values on webpage

}//end of the addDigit Function

/**
 * evaluateExpression - evaluates the expression String and handles it accordingly.
 * the expression as a String
 */
function evaluateExpression(prevInput) {

    var stringLength = activeNumber.length;
    var firstChar = activeNumber.charAt(0);
    var secondChar = activeNumber.charAt(1);

    // Fills in "0" is activeNumber is empty
    if (stringLength == 0 || activeNumber == undefined)
        activeNumber = "0";
    // Make sure the initial "0" doesn't get concat() (eg. "08", should be "8" instead)
    else if (firstChar == "0" && isNaN(prevInput) == false && secondChar != ".")
        activeNumber = activeNumber.slice(1);
}

/**
 * updateDisplay Function - updates the values displayed in the entry-box of the
 * calculator
 */
function updateDisplay() {

    $("#entry").text(activeNumber.substr(0, 12));

    // Reserves the space for emptied display_expression <div>
    if (expression == "") {
        $("#expression").html('&nbsp;');

    } else {
        $("#expression").text(expression);

    }

    // Reserves the space for emptied display_history <div>'s
    for (var i = 0; i < 4; i++) {
        var tempString = "#history" + i.toString();
        if (expressionHistory[i] == "") {
            $(tempString).html('&nbsp;');

        } else {
            $(tempString).text(expressionHistory[i]);
        }
    }

}//end of the updateDisplay Function

/**
 * performOperant Function - perform the calculations of the operant buttons
 * the String of the operation button clicked
 */
function performOperant(input) {

    switch (input) {
        case "clr":
            expressionHistory = ["", "", "", ""];
            resetCalculator();
            return;

        case "C":
            resetCalculator();
            return;

        case "CE":
            activeNumber = "";
            break;

        case "bsp":
            activeNumber = activeNumber.slice(0, - 1);
            break;

        case "=":
            // Button disabled when user hasn't keyed in any arithmetic operator
            if (lastOperator == "") {  //if there isn't a last operation, do nothing
                expression = activeNumber;

                // Normal Operation
            } else if (lastInput != "=") {
                prevNumber2 = activeNumber;//Caches the 2nd operand for case of user repeatedly pressing equal button
                expression = expression.concat(" " + activeNumber);// update expression
                var result = doMath(prevNumber, activeNumber, lastOperator);// Evaluate the math operation
                activeNumber = result;// display result
                prevNumber = result;

                // store result for next operation
            } else {
                // When user repeatedly presses equal button
                expression = (activeNumber + " " + lastOperator + " " + prevNumber2);
                activeNumber = doMath(activeNumber, prevNumber2, lastOperator);   // Evaluate the math operation
            }

            pushToHistory(expression);//Push expression to history
            expression = "";//Clear expression
            break;

        default:
            if (lastInput == "=") {
                expression = expression.concat(" " + activeNumber + " " + input);// update expression
                prevNumber = activeNumber;

            } else if (/[\+\-\×\÷\%]/.test(lastInput) == true && lastOperator != "") {
                // IF user changes math operator b4 keying in the 2nd operand
                expression = expression.slice(0, -1).concat(input);

            } else {
                expression = expression.concat(" " + activeNumber + " " + input);// update expression
                var result = doMath(prevNumber, activeNumber, lastOperator);
                activeNumber = result;// display result
                prevNumber = result;// store result for next operation
                lastOperator = input;

            }

            lastOperator = input;
            break;

    }//end of the switch condition

    lastInput = input
    evaluateExpression(input);
    updateDisplay();

}//end of the addOperant Function

/**
 * resetCalculator Function - resets all variables
 */
function resetCalculator() {
    activeNumber = "0";// String to be displayed on the main screen
    prevNumber = "0";
    expression = "";
    lastOperator = "";
    lastInput = "";
    updateDisplay();

}//end of the resetCalculator Function

/**
 * performOpposite Function -
 */
function performOpposite(input) {

    if (activeNumber == 'Infinity') {
        resetCalculator();
        return;

    }

    var tempString1 = "";
    var tempString2 = "";
    var tempNumber = activeNumber;

    switch (input) {

        case 'opp':
            activeNumber = ((-1) * parseFloat(activeNumber)).toString();
            tempString1 = ' opp(';
            tempString2 = ' )';
            break;

        default:
            return;

    }

    evaluateExpression();
    $('#expression').text(expression + tempString1 + tempNumber + tempString2);
    $('#entry').text(activeNumber.substr(0, 12));

}//end of the performOpposite Function

/**
 * doMath Function - performs the basic mathematical operation of addition, substraction, modulus
 * multiplication, and division
 * - the first number (prevNumber)
 * - the second number (activeNumber)
 * - the operation
 *  returns String - the results of the first and second number
 */
function doMath(a, b, operation) {

    // convert a & b from string into numeric type
    var num_a = parseFloat(a);
    var num_b = parseFloat(b);
    var tempResult;

    // Prevents any operation when user presses a button just after a reset
    if (lastOperator == "") return b;

    switch (operation) {

        case "+": tempResult = (num_a + num_b);
            break;

        case "-": tempResult = (num_a - num_b);
            break;

        case "×": tempResult = (num_a * num_b);
            break;

        case "÷": tempResult = (num_a / num_b);
            break;

        case "%": tempResult = (num_a / num_b);
            break;

        default: return b;
    }

    // If result is has a decimal point, remove redundant zeroes behind (eg. 1.70000 -> 1.7)
    tempResult = tempResult.toFixed(8);

    if (tempResult.indexOf(".") != -1) {

        while (tempResult.slice(-1) == "0") {
            tempResult = tempResult.slice(0, - 1);

        }

        if (tempResult.slice(-1) == ".") {
            tempResult = tempResult.slice(0, - 1);

        }
    }

    return tempResult;

}//end of the doMath Function

// Updates the expression history
function pushToHistory(str) {

    // Pops the oldest expression in the array (from the back)
    // Adds latest string into array (from the front)
    // [array can store only the last 4 EXP]
    if (expressionHistory.length > 4)
        expressionHistory.pop();

    expressionHistory.unshift(str);

}//end of pushToHistory Function
