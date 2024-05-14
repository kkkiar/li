


const fs = require('fs');

/**
 * Класс TransactionAnalyzer представляет собой анализатор транзакций, который предоставляет различные методы для анализа данных о транзакциях.
 */
class TransactionAnalyzer {
    /**
     * Создает новый экземпляр TransactionAnalyzer.
     * @param {Array<Object>} transactions - Массив объектов, представляющих транзакции для анализа.
     */
    constructor(transactions) {
        this.transactions = transactions;
    }

    /**
     * Метод addTransaction добавляет новую транзакцию в список транзакций.
     * @param {Object} transaction - Объект, представляющий транзакцию для добавления.
     */
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    /**
     * Метод getAllTransactions возвращает массив всех транзакций.
     * @returns {Array<Object>} - Массив всех транзакций.
     */
    getAllTransactions() {
        return this.transactions;
    }

    /**
     * Метод getUniqueTransactionTypes возвращает массив уникальных типов транзакций.
     * @returns {Array<string>} - Массив уникальных типов транзакций.
     */
    getUniqueTransactionTypes() {
        const types = new Set();
        this.transactions.forEach(transaction => {
            types.add(transaction.transaction_type);
        });
        return Array.from(types);
    }

    /**
     * Метод calculateTotalAmount вычисляет общую сумму всех транзакций.
     * @returns {number} - Общая сумма всех транзакций.
     */
    calculateTotalAmount() {
        return this.transactions.reduce((total, transaction) => {
            return total + parseFloat(transaction.transaction_amount);
        }, 0);
    }

    /**
     * Метод calculateTotalAmountByDate вычисляет общую сумму транзакций за указанную дату.
     * @param {number} year - Год даты.
     * @param {number} month - Месяц даты (1-12).
     * @param {number} day - День даты.
     * @returns {number} - Общая сумма транзакций за указанную дату.
     */
    calculateTotalAmountByDate(year, month, day) {
        let total = 0;
        this.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            if ((!year || transactionDate.getFullYear() === year) &&
                (!month || transactionDate.getMonth() + 1 === month) &&
                (!day || transactionDate.getDate() === day)) {
                total += parseFloat(transaction.transaction_amount);
            }
        });
        return total;
    }

    /**
     * Метод getTransactionsByType возвращает транзакции определенного типа.
     * @param {string} type - Тип транзакции для фильтрации.
     * @returns {Array<Object>} - Массив транзакций указанного типа.
     */
    getTransactionsByType(type) {
        return this.transactions.filter(transaction => transaction.transaction_type === type);
    }

    /**
     * Метод getTransactionsInDateRange возвращает транзакции в указанном диапазоне дат.
     * @param {Date} startDate - Начальная дата диапазона.
     * @param {Date} endDate - Конечная дата диапазона.
     * @returns {Array<Object>} - Массив транзакций в диапазоне дат.
     */
    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= start && transactionDate <= end;
        });
    }

    /**
     * Метод getTransactionsByMerchant возвращает транзакции по имени мерчанта.
     * @param {string} merchantName - Название мерчанта.
     * @returns {Array<Object>} - Массив транзакций по указанному мерчанту.
     */
    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    /**
     *

 Метод calculateAverageTransactionAmount вычисляет среднюю сумму транзакции.
     * @returns {number} - Средняя сумма транзакции.
     */
    calculateAverageTransactionAmount() {
        const totalAmount = this.calculateTotalAmount();
        return totalAmount / this.transactions.length;
    }

    /**
     * Метод getTransactionsByAmountRange возвращает транзакции в указанном диапазоне сумм.
     * @param {number} minAmount - Минимальная сумма.
     * @param {number} maxAmount - Максимальная сумма.
     * @returns {Array<Object>} - Массив транзакций в указанном диапазоне сумм.
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    /**
     * Метод calculateTotalDebitAmount вычисляет общую сумму дебетовых транзакций.
     * @returns {number} - Общая сумма дебетовых транзакций.
     */
    calculateTotalDebitAmount() {
        return this.transactions.reduce((total, transaction) => {
            if (transaction.transaction_type === 'debit') {
                return total + parseFloat(transaction.transaction_amount);
            }
            return total;
        }, 0);
    }

    /**
     * Метод findMostTransactionsMonth находит месяц с наибольшим количеством транзакций.
     * @returns {number} - Месяц с наибольшим количеством транзакций (1-12).
     */
    findMostTransactionsMonth() {
        const monthCounts = {};
        this.transactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth() + 1;
            if (monthCounts[month]) {
                monthCounts[month]++;
            } else {
                monthCounts[month] = 1;
            }
        });
        let mostTransactionsMonth = 1;
        let maxTransactions = 0;
        for (const month in monthCounts) {
            if (monthCounts[month] > maxTransactions) {
                maxTransactions = monthCounts[month];
                mostTransactionsMonth = month;
            }
        }
        return mostTransactionsMonth;
    }

    /**
     * Метод findMostDebitTransactionMonth находит месяц с наибольшим количеством дебетовых транзакций.
     * @returns {number} - Месяц с наибольшим количеством дебетовых транзакций (1-12).
     */
    findMostDebitTransactionMonth() {
        const debitTransactions = this.getTransactionsByType('debit');
        const monthCounts = {};
        debitTransactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth() + 1;
            if (monthCounts[month]) {
                monthCounts[month]++;
            } else {
                monthCounts[month] = 1;
            }
        });
        let mostDebitMonth = 1;
        let maxDebitTransactions = 0;
        for (const month in monthCounts) {
            if (monthCounts[month] > maxDebitTransactions) {
                maxDebitTransactions = monthCounts[month];
                mostDebitMonth = month;
            }
        }
        return mostDebitMonth;
    }

    /**
     * Метод mostTransactionTypes определяет наиболее частый тип транзакций (дебет или кредит).
     * @returns {string} - Самый частый тип транзакции ('debit', 'credit' или 'equal').
     */
    mostTransactionTypes() {
        const debitCount = this.getTransactionsByType('debit').length;
        const creditCount = this.getTransactionsByType('credit').length;
        if (debitCount > creditCount) {
            return 'debit';
        } else if (creditCount > debitCount) {
            return 'credit';
        } else {
            return 'equal';
        }
    }

    /**
     * Метод getTransactionsBeforeDate возвращает транзакции, которые произошли до указанной даты.
     * @param {Date} date - Дата для сравнения.
     * @returns {Array<Object>} - Массив транзакций, которые произошли до указанной даты.
     */
    getTransactionsBeforeDate(date) {
        const endDate = new Date(date);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate < endDate;
        });
    }

    /**
     * Метод findTransactionById находит транзакцию по идентификатору.
     * @param {string} id - Идентификатор транзакции.
     * @returns {Object|null} - Найденная транзакция или null, если не найдена.
     */
    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id);
    }

    /**
     * Метод mapTransactionDescriptions создает массив описаний тран

закций.
     * @returns {Array<string>} - Массив описаний транзакций.
     */
    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }
}

// Загрузка данных о транзакциях из файла JSON
const transactionsData = require("./transactions.json");

// Создание экземпляра TransactionAnalyzer для анализа транзакций
const analyzer = new TransactionAnalyzer(transactionsData);

// Ответы на вопросы:

// 1. Какие примитивные типы данных существуют в JavaScript?
//    - В JavaScript имеются основные типы данных: числа (number), строки (string), булевы значения (boolean), undefined, null и символы (symbol).

// 2. Какие методы массивов вы использовали для обработки и анализа данных в вашем приложении, и как они помогли в выполнении задачи?
//   - Для обработки и анализа данных в приложении использовались методы массивов, такие как forEach, filter, reduce и map. Они позволили выполнять различные операции с массивом транзакций, такие как фильтрация, подсчет суммы, обход и преобразование элементов.

// 3. В чем состоит роль конструктора класса?
//    - Конструктор класса в JavaScript используется для инициализации новых экземпляров класса. Он определяет, какие параметры нужно передать при создании объекта, и выполняет начальную настройку объекта.

// 4. Каким образом вы можете создать новый экземпляр класса в JavaScript?
//    - Новый экземпляр класса в JavaScript можно создать с помощью оператора new, передав имя класса и необходимые аргументы конструктору класса. Например:
//      ```javascript
//      const instance = new MyClass(arg1, arg2);
//      ```
