const monthsYear = 12;

let balance;
let termYears;
let interestRate;

let termMonths = 0;
let monthlyFee = 0;
let interestPayment = 0;
let capitalPayment = 0;

let paymentPlans = [];
(balance);

const onChange = (e) => {
    // const onChange = ({ target: { value, id } }) => {
    if (e.target.id === 'balance') {
        balance = Number(e.target.value);
        // balance = Number(value);
    };
    if (e.target.id === 'termYears') {
        termYears = Number(e.target.value);
    };
};

function calculateTermMonths(termYears) {
    return termMonths = termYears * monthsYear;
}

function calculateInstallment(balance, interestRate, termMonths) {
    return monthlyFee = ((balance * interestRate) / (1 - (1 + interestRate) ** (-termMonths))).toFixed(1);
}

function calculateInterestPayment(bal, intRate) {
    interestPayment = (bal * intRate).toFixed(1);
    ("El valor abonado a intereses sería:", interestPayment, "USD");
}

function calculatePaymentCapital(mFee, intPay) {
    capitalPayment = (mFee - intPay).toFixed(1);
    ("El valor abonado a capital sería:", capitalPayment, "USD");
}

function calculateBalance(bal, capPay) {
    if ((bal - capPay).toFixed(1) <= 0) {
        balance = 0;
    } else {
        balance = (bal - capPay).toFixed(1);
    }
    ("El saldo después del pago de esta cuota sería:", balance, "USD");
}

const onCreateSectionToPaymentPlans = () => {
    let paymentsContainer = document.createElement('section');
    paymentsContainer.id = 'paymentsContainer';
    paymentsContainer.className = 'paymentsContainer';

    document.body.appendChild(paymentsContainer)

    let paymentsTitle = document.createElement('h2');
    paymentsTitle.innerHTML = 'Plan de pagos detallado'

    let paymentsHeader = document.createElement('div');
    paymentsHeader.id = 'paymentsHeader'
    paymentsHeader.innerHTML = `
        <span>N° de cuota</span>
        <span>Abono a capital</span>
        <span>Abono a intereses</span>
        <span>Saldo después del pago</span>
    `;

    document.getElementById('paymentsContainer').appendChild(paymentsTitle);
    document.getElementById('paymentsContainer').appendChild(paymentsHeader);

    for (const payment of paymentPlans) {
        let paymentContainer = document.createElement('div');
        paymentContainer.id = 'paymentContainer'
        paymentContainer.innerHTML = `
            <span>${payment.quotaNumber}</span>
            <span>${payment.capitalPayment}</span>
            <span>${payment.interestPayment}</span>
            <span>${payment.balance}</span>
        `;
        document.getElementById('paymentsContainer').appendChild(paymentContainer);
    }
}

const onValidateForm = (event) => {
    event.preventDefault();

    if (balance < 1000 || balance > 100000 || balance === undefined) {
        document.getElementById('errorBalance').innerHTML = "La cantidad que estás solicitando no es válida";
        return;
    };
    if (termYears === undefined) {
        document.getElementById('errorTermYears').innerHTML = "Debes seleccionar un plazo";
        return;
    };

    paymentPlans = [];
    localStorage.removeItem('lastPaymentPlan')

    const element = document.getElementById("paymentsContainer");
    if (element) {
        element.remove();
    }

    if (termYears == 1) {
        interestRate = 0.03;
        document.getElementById('interestRate').innerHTML = `La tasa de interés para el plazo de ${termYears} años es 3% mes vencido`;
    } else if (termYears == 2 || termYears == 3) {
        interestRate = 0.025;
        document.getElementById('interestRate').innerHTML = `La tasa de interés para el plazo de ${termYears} años es 2.5% mes vencido`;
    } else {
        interestRate = 0.02;
        document.getElementById('interestRate').innerHTML = `La tasa de interés para el plazo de ${termYears} años es 2% mes vencido`;
    };

    calculateTermMonths(termYears);
    document.getElementById('termMonths').innerHTML = `Según el plazo que requieres, las cuotas mensuales serían: ${termMonths}`;
    calculateInstallment(balance, interestRate, termMonths);
    document.getElementById('installment').innerHTML = `El valor de tu cuota fija mensual sería: ${monthlyFee} USD`;

    for (let i = 1; i <= termMonths; i++) {

        ("Cuota No", i);
        calculateInterestPayment(balance, interestRate);
        calculatePaymentCapital(monthlyFee, interestPayment);
        calculateBalance(balance, capitalPayment);
        paymentPlans.push({
            quotaNumber: i,
            interestPayment,
            capitalPayment,
            balance,
        })
    }

    onCreateSectionToPaymentPlans();
    localStorage.setItem('lastPaymentPlan', JSON.stringify(paymentPlans))
};

const onGetLocalStorage = () => {
    paymentPlans = JSON.parse(localStorage.getItem('lastPaymentPlan'))
}

const onGetLastPaymentPlan = () => {
    if (paymentPlans.length > 1) {
        return;
    };
    onGetLocalStorage();
    onCreateSectionToPaymentPlans()
};


if (localStorage.getItem('lastPaymentPlan')) {
    let button = document.createElement('button');
    button.innerHTML = 'Consultar último plan de pagos simulado'
    button.id = 'consultPayment'
    document.getElementById('lastPaymentPlanContainer').appendChild(button);
}

document.getElementById('balance').addEventListener('change', onChange);
document.getElementById('termYears').addEventListener('change', onChange);

document.getElementById('botonGenerar').addEventListener('click', (e) => onValidateForm(e))

document.getElementById('consultPayment').addEventListener('click', onGetLastPaymentPlan);