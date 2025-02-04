function simulate() {
    let inverterType = document.getElementById("inverterType").value;
    let dcVoltage = parseFloat(document.getElementById("dcVoltage").value);
    let frequency = parseFloat(document.getElementById("frequency").value);
    let loadResistance = parseFloat(document.getElementById("loadResistance").value);

    let canvas = document.getElementById("waveformCanvas");
    let ctx = canvas.getContext("2d");

    // Clear previous simulation
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;

    let waveColor;
    let waveData = [];

    if (inverterType === "diodeClamped") {
        waveColor = "blue";
        waveData = generateWave(3, dcVoltage, frequency);
    } else if (inverterType === "flyingCapacitor") {
        waveColor = "red";
        waveData = generateWave(5, dcVoltage, frequency);
    } else if (inverterType === "cascade") {
        waveColor = "green";
        waveData = generateWave(7, dcVoltage, frequency);
    }

    drawWave(ctx, waveData, waveColor);
    calculateTHD(waveData, loadResistance);
}

function generateWave(levels, dcVoltage, frequency) {
    let wave = [];
    let step = Math.PI / 20;
    
    for (let i = 0; i < 40; i++) {
        let value = Math.sin(i * step * frequency);
        let quantized = Math.round(value * levels) / levels;
        wave.push(quantized * dcVoltage / levels);
    }

    return wave;
}

function drawWave(ctx, waveData, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();

    let x = 20;
    for (let i = 0; i < waveData.length; i++) {
        let y = 150 - waveData[i] * 0.5;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += 15;
    }

    ctx.stroke();
}

function calculateTHD(waveData, loadResistance) {
    let fundamental = 0;
    let harmonics = 0;

    for (let i = 1; i < waveData.length; i++) {
        if (i === 1) {
            fundamental = waveData[i];
        } else {
            harmonics += waveData[i] ** 2;
        }
    }

    let thd = (Math.sqrt(harmonics) / fundamental) * 100;
    document.getElementById("thdResult").innerText = `Total Harmonic Distortion (THD): ${thd.toFixed(2)}%`;
}

function downloadWaveform() {
    let canvas = document.getElementById("waveformCanvas");
    let link = document.createElement('a');
    link.download = 'waveform.png';
    link.href = canvas.toDataURL();
    link.click();
}

function downloadCSV() {
    let inverterType = document.getElementById("inverterType").value;
    let dcVoltage = parseFloat(document.getElementById("dcVoltage").value);
    let frequency = parseFloat(document.getElementById("frequency").value);
    let loadResistance = parseFloat(document.getElementById("loadResistance").value);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Parameter,Value\n";
    csvContent += `Inverter Type,${inverterType}\n`;
    csvContent += `DC Voltage (V),${dcVoltage}\n`;
    csvContent += `Switching Frequency (Hz),${frequency}\n`;
    csvContent += `Load Resistance (Ω),${loadResistance}\n`;

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "simulation_data.csv");
    document.body.appendChild(link);
    link.click();
}
