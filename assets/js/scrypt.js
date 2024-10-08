const fetchData = async () => {
  try {
    const currency = document.getElementById("currency").value;

    const response = await fetch(`https://mindicador.cl/api/${currency}`);

    if (!response.ok) {
      throw new Error("Error en la peticion");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    alert("Ocurrió un error en la conversión. Intente nuevamente.");
  }
};

const convertirValores = (currencyData, pesos) => {
  const tipoCambio = currencyData.serie[0].valor;
  const resultado = (pesos / tipoCambio).toFixed(2);

  console.log(
    `Pesos: ${pesos}, Moneda: ${currency}, Tipo de cambio: ${tipoCambio}, Resultado: ${resultado}`
  );

  document.querySelector(".result span").textContent = `$${resultado}`;
};

const processCurrencyData = (data) => {
  const dates = [];
  const values = [];

  data.serie.forEach((item) => {
    const date = new Date(item.fecha);
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedValue = item.valor;
    dates.push(formattedDate);
    values.push(formattedValue);
  });

  // Devolver un objeto con los arrays de fechas y valores
  return { dates, values };
};

let chartInstance = null;
const renderChart = (dates, values) => {
  console.log(values);
  const ctx = document.getElementById("launchesChart").getContext("2d");
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Variación de la moneda",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          stepSize: 0.1,
        },
      },
    },
  });
};

const init = async () => {
  try {
    const pesos = document.getElementById("pesos").value;
    if (isNaN(pesos) || pesos <= 0) {
      alert("Por favor, ingrese un valor válido en pesos CLP.");
      document.getElementById("pesos").focus();
      return;
    }

    const currencyData = await fetchData();
    convertirValores(currencyData, pesos);
    const { dates, values } = processCurrencyData(currencyData);
    renderChart(dates, values);
  } catch (error) {
    console.log(error);
    alert("Ocurrió un error en la conversión. Intente nuevamente.");
  }
};
