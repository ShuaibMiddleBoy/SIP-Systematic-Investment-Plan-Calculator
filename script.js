document.addEventListener('DOMContentLoaded', function () {

    // Example default data
    let defaultLabels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'];
    let defaultData = [0, 0, 0, 0, 0]; // Replace with your default data
    updateChart(defaultLabels, defaultData, true);


    // Set default values
    document.getElementById('monthlyInvestment').value = '15000'; // Example default value
    document.getElementById('duration').value = '12'; // Example default duration
    document.getElementById('expectedReturn').value = '35'; // Example default return rate

    // Perform default calculation
    calculateSIP();
});




let inflationRate = 0;
let isCalculationDone = false;
let sipChart = null; // Variable to hold the chart instance



function toggleInflation() {
    let inflationToggle = document.getElementById('inflationToggle');
    let inflationOptions = document.getElementById('inflationOptions');
    inflationOptions.style.display = inflationToggle.checked ? 'block' : 'none';
    if (!inflationToggle.checked) {
        inflationRate = 0;
    }
}

function setInflationRate(rate) {
    inflationRate = rate / 100;
    let buttons = document.querySelectorAll('.inflationBtn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    if (isCalculationDone) {
        calculateSIP();
    }
}

function calculateSIP() {
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    let durationYears = parseInt(document.getElementById('duration').value);
    let expectedReturn = parseFloat(document.getElementById('expectedReturn').value);

    if (monthlyInvestment && durationYears && expectedReturn) {
        isCalculationDone = true;
        let durationMonths = durationYears * 12;
        expectedReturn = (expectedReturn / 100) / 12; // monthly rate

        let labelsArray = [];
        let dataArray = [];

        for (let month = 1; month <= durationMonths; month++) {
            labelsArray.push(`Month ${month}`);
            let futureValue = monthlyInvestment * (((Math.pow(1 + expectedReturn, month)) - 1) / expectedReturn) * (1 + expectedReturn);
            futureValue /= Math.pow(1 + inflationRate, month / 12); // Adjust future value for inflation
            dataArray.push(futureValue);
        }

        let totalInvestment = monthlyInvestment * durationMonths;
        let finalAmount = dataArray[dataArray.length - 1];
        let wealthGain = finalAmount - totalInvestment;

        document.getElementById('expectedAmount').innerHTML = `<strong>Expected Amount:</strong> Rs. ${finalAmount.toFixed(2)}`;
        document.getElementById('amountInvested').innerHTML = `<strong>Amount Invested:</strong> Rs. ${totalInvestment.toFixed(2)}`;
        document.getElementById('wealthGain').innerHTML = `<strong>Wealth Gain:</strong> Rs. ${wealthGain.toFixed(2)}`;


        updateChart(labelsArray, dataArray);
        document.getElementById('chartPlaceholder').style.display = 'none'; // Hide placeholder when calculating
        updateChart(labelsArray, dataArray);
    } else {
        alert("Please fill all fields.");
    }
}
function updateChart(labels, data, isInitial = false) {
    let ctx = document.getElementById('sipChart').getContext('2d');
    if (isInitial) {
        document.getElementById('chartPlaceholder').style.display = 'none';
        ctx.canvas.style.display = 'block';
    }

    if (sipChart) {
        sipChart.data.labels = labels;
        sipChart.data.datasets[0].data = data;
        sipChart.update();
    } else {
        sipChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Investment Over Time',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                    pointHoverBackgroundColor: 'red',
                    pointHoverBorderColor: 'yellow',
                    pointHoverBorderWidth: 2,
                    pointHoverRadius: 5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });
    }
}
