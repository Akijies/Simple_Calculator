const loadWasm = async () => {
    const wasmModule = await WebAssembly.instantiateStreaming(fetch('calculator.wasm'));
    return wasmModule.instance.exports;
};

const jsAdd = (a, b) => a + b;
const jsSubtract = (a, b) => a - b;
const jsMultiply = (a, b) => a * b;
const jsDivide = (a, b) => {
    if (b === 0) return 'Cannot divide by zero';
    return a / b;
};


const performCalculation = async (operation) => {
    const num1 = parseInt(document.getElementById('num1').value, 10);
    const num2 = parseInt(document.getElementById('num2').value, 10);

    // Load WASM module
    const wasmFunctions = await loadWasm();

    // Initialize variables to store total execution time and results
    let totalJsTimeTaken = 0;
    let totalWasmTimeTaken = 0;
    let jsResult, wasmResult;

    // Loop 10 times to perform the calculations
    for (let i = 0; i < 20; i++) {
        // JavaScript Calculation
        const jsStartTime = performance.now();
        switch (operation) {
            case 'add':
                jsResult = parseInt(jsAdd(num1, num2), 10);
                break;
            case 'subtract':
                jsResult = parseInt(jsSubtract(num1, num2), 10);
                break;
            case 'multiply':
                jsResult = parseInt(jsMultiply(num1, num2), 10);
                break;
            case 'divide':
                if (num2 === 0) {
                    jsResult = 'Cannot divide by zero';
                } else {
                    jsResult = parseInt(jsDivide(num1, num2), 10);
                }
                break;
        }
        const jsEndTime = performance.now();
        totalJsTimeTaken += jsEndTime - jsStartTime;

        // Add a delay of 0.5 milliseconds
        await new Promise((resolve) => {
            setTimeout(resolve, 0.5); // Delay of 1 milliseconds
        });

        // WASM Calculation
        for (let j = 0; j < 20; j++) {
            const wasmStartTime = performance.now();
            switch (operation) {
                case 'add':
                    wasmResult = wasmFunctions.c(num1, num2);
                    break;
                case 'subtract':
                    wasmResult = wasmFunctions.d(num1, num2);
                    break;
                case 'multiply':
                    wasmResult = wasmFunctions.e(num1, num2);
                    break;
                case 'divide':
                    wasmResult = wasmFunctions.f(num1, num2);
                    break;
            }
            const wasmEndTime = performance.now();
            totalWasmTimeTaken += wasmEndTime - wasmStartTime;

            // Add a delay of 0.5 milliseconds
            await new Promise((resolve) => {
                setTimeout(resolve, 0.5); // Delay of 0.5 milliseconds
            });
        }
    }

    // Calculate average execution time
    const averageJsTimeTaken = totalJsTimeTaken / 20;
    const averageWasmTimeTaken = totalWasmTimeTaken / 20; // Divide by 100 as there are 10 iterations for each calculation

    // Display results
    document.getElementById('result').innerHTML = `
        JavaScript result = ${jsResult}<br>
        WebAssembly result = ${wasmResult}<br>
        Average JavaScript result = ${averageJsTimeTaken.toFixed(2)} milliseconds<br>
        Average WebAssembly result = ${averageWasmTimeTaken.toFixed(2)} milliseconds
    `;
};
