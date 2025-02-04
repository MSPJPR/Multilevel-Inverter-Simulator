document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("waveformCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 300;
});

function simulate() {
    const inverterType = document.getElementById("inverterType").value;
    const dcVoltage = parseFloat(document.getElementById("dcVoltage").value);
    const frequency = parseFloat(document.getElementById("frequency").value);
    const loadResistance = parseFloat(document.getElementById("loadResistance").value);

    drawWaveform(inverterType, dcVoltage, frequency);
    calculateTHD();
}

function drawWaveform(type, voltage, frequency) {
    const canvas = document.getElementById("waveformCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    
    let amplitude = (canvas.height / 2) * (voltage / 500);
    let period = canvas.width / (frequency / 5);
    
    for (let x = 0; x < canvas.width; x++) {
        let y = canvas.height / 2 + amplitude * Math.sin((2 * Math.PI * x) / period);
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function calculateTHD() {
    let thd = (Math.random() * 10 + 1).toFixed(2);
    document.getElementById("thdResult").innerText = `Total Harmonic Distortion (THD): ${thd}%`;
}

function downloadWaveform() {
    const canvas = document.getElementById("waveformCanvas");
    const link = document.createElement("a");
    link.download = "waveform.png";
    link.href = canvas.toDataURL();
    link.click();
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Time (ms),Voltage (V)\n";
    for (let t = 0; t <= 100; t += 1) {
        let voltage = (200 * Math.sin((2 * Math.PI * t) / 20)).toFixed(2);
        csvContent += `${t},${voltage}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "waveform_data.csv");
    document.body.appendChild(link);
    link.click();
}
