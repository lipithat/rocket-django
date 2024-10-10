let tempChart;
let humidityChart;

// Function to get the last 20 data points from temperature data
const getLast20TemperatureData = () => {
    const filteredData = temperatureData.slice(-20);
    const formattedDates = filteredData.map(item => {
        const dateObj = new Date(item.timestamp);
        const currYear = new Date().getFullYear();
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const year = dateObj.getFullYear();
        return year === currYear ? `${day} ${month}` : `${day} ${month} ${year}`;
    });
    return { filteredData, formattedDates };
};

// Function to get the last 20 data points from humidity data
const getLast20HumidityData = () => {
    const filteredData = humidityData.slice(-20);
    const formattedDates = filteredData.map(item => {
        const dateObj = new Date(item.timestamp);
        const currYear = new Date().getFullYear();
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const year = dateObj.getFullYear();
        return year === currYear ? `${day} ${month}` : `${day} ${month} ${year}`;
    });
    return { filteredData, formattedDates };
};

// Shared function to get gradient fill based on theme
const getGradientFill = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return {
        type: 'gradient',
        gradient: {
            enabled: true,
            opacityFrom: isDarkMode ? 0.15 : 0.5, // Increased opacity in light mode
            opacityTo: isDarkMode ? 0.05 : 0.1, // Adjust opacity to be less pronounced
        },
    };
};

// Function to get temperature chart options
const getTempChartOptions = (filteredData, filteredDates) => {
    const mainChartColors = {
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#F3F4F6',
        labelColor: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
    };

    return {
        chart: {
            height: 420,
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            foreColor: mainChartColors.labelColor,
            toolbar: { show: false },
        },
        fill: getGradientFill(), // Using shared gradient fill
        dataLabels: { enabled: false },
        tooltip: {
            style: { fontSize: '14px', fontFamily: 'Inter, sans-serif' },
            x: { show: false },
            y: { formatter: value => value + '°F' },
        },
        grid: {
            show: true,
            borderColor: mainChartColors.borderColor,
            strokeDashArray: 1,
            padding: { left: 35, bottom: 15 },
        },
        series: [
            { name: 'Temperature 1', data: filteredData.map(item => item.t1), color: '#E63946' },
            { name: 'Temperature 2', data: filteredData.map(item => item.t2), color: '#F1A65A' },
        ],
        markers: {
            size: 5,
            strokeColors: '#ffffff',
            hover: { size: undefined, sizeOffset: 3 },
        },
        xaxis: {
            categories: filteredDates,
            labels: {
                style: { colors: [mainChartColors.labelColor], fontSize: '14px', fontWeight: 500 },
                rotate: -45,
            },
            axisBorder: { color: mainChartColors.borderColor },
            axisTicks: { color: mainChartColors.borderColor },
        },
        yaxis: {
            labels: {
                style: { colors: [mainChartColors.labelColor], fontSize: '14px', fontWeight: 500 },
                formatter: value => value + '°C',
            },
        },
        legend: {
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            labels: { colors: [mainChartColors.labelColor] },
        },
    };
};

// Function to get humidity chart options
const getHumidityChartOptions = (filteredData, filteredDates) => {
    const mainChartColors = {
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#F3F4F6',
        labelColor: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
    };

    return {
        chart: {
            height: 420,
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            foreColor: mainChartColors.labelColor,
            toolbar: { show: false },
        },
        fill: getGradientFill(), // Using shared gradient fill
        dataLabels: { enabled: false },
        tooltip: {
            style: { fontSize: '14px', fontFamily: 'Inter, sans-serif' },
            x: { show: true },
            y: { formatter: value => value + '%' }, // Change to percentage for humidity
        },
        grid: {
            show: true,
            borderColor: mainChartColors.borderColor,
            strokeDashArray: 1,
            padding: { left: 35, bottom: 15 },
        },
        series: [
            { name: 'Humidity 1', data: filteredData.map(item => item.h1), color: '#3B82F6' },
            { name: 'Humidity 2', data: filteredData.map(item => item.h2), color: '#14B8A6' },
            { name: 'Humidity 3', data: filteredData.map(item => item.h3), color: '#A78BFA' },
        ],
        markers: {
            size: 5,
            strokeColors: '#ffffff',
            hover: { size: undefined, sizeOffset: 3 },
        },
        xaxis: {
            categories: filteredDates,
            labels: {
                style: { colors: [mainChartColors.labelColor], fontSize: '14px', fontWeight: 500 },
                rotate: -45,
            },
            axisBorder: { color: mainChartColors.borderColor },
            axisTicks: { color: mainChartColors.borderColor },
        },
        yaxis: {
            labels: {
                style: { colors: [mainChartColors.labelColor], fontSize: '14px', fontWeight: 500 },
                formatter: value => value + '%', // Change to percentage for humidity
            },
        },
        legend: {
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            labels: { colors: [mainChartColors.labelColor] },
        },
    };
};

// Initialize temperature chart
if (document.getElementById('temperature-chart')) {
    const { filteredData, formattedDates } = getLast20TemperatureData();
    tempChart = new ApexCharts(document.getElementById('temperature-chart'), getTempChartOptions(filteredData, formattedDates));
    tempChart.render();
}

// Initialize humidity chart
if (document.getElementById('humidity-chart')) {
    const { filteredData, formattedDates } = getLast20HumidityData();
    humidityChart = new ApexCharts(document.getElementById('humidity-chart'), getHumidityChartOptions(filteredData, formattedDates));
    humidityChart.render();
}
