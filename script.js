import { API_URL, TIMEOUT_SEC } from "./config.js";
import { timeout } from "./helpers.js";

//DOM Elements
const currencyEl_one = document.getElementById("currency-one");
const currencyEl_two = document.getElementById("currency-two");
const amountEl_one = document.getElementById("amount-one");
const amountEl_two = document.getElementById("amount-two");
const rateEl = document.getElementById("rate");
const swap = document.getElementById("swap");

//Functions
//Fetch exchange rates and update DOM
const calculate = async function () {
  try {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    const fetchPro = fetch(`${API_URL}${currency_one}`);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const rate = data.conversion_rates[currency_two];
    rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

    amountEl_two.value = (amountEl_one.value * rate).toFixed(2);

    console.log(currency_one, currency_two, rate, data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

calculate();

//Event Listeners
currencyEl_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate);
currencyEl_two.addEventListener("change", calculate);
amountEl_two.addEventListener("input", calculate);

swap.addEventListener("click", function () {
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;
  calculate();
});
