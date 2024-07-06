document.addEventListener("DOMContentLoaded", () => {
    const tutorialModal = document.getElementById("tutorial-modal");
    const openTutorialButton = document.getElementById("open-tutorial");
    const closeTutorialButton = document.getElementById("close-tutorial-modal");

    openTutorialButton.addEventListener("click", () => {
        tutorialModal.style.display = "block";
    });

    closeTutorialButton.addEventListener("click", () => {
        tutorialModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === tutorialModal) {
            tutorialModal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const balanceElement = document.getElementById("balance");
    const rentDueElement = document.getElementById("rent-due");
    const currentDayElement = document.getElementById("current-day");
    const currentMonthElement = document.getElementById("current-month");
    const loanStatusElement = document.getElementById("loan-status");
    const summaryElement = document.getElementById("summary");
    const paidMonthsListElement = document.getElementById("paid-months-list");
    const investmentModal = document.getElementById("investment-modal");
    const loanModal = document.getElementById("loan-modal");
	const victoryImage = document.getElementById("victory-image");
	const gameOverImage = document.getElementById("game-over-image");

    let balance = 100;
    let rentDue = 0; // Rent due starts at 0 in the first month
    let currentDay = 1;
    let currentMonth = 1;
    let paidMonths = [1]; // Start with Month 1 already listed
    let loan = 0;
    let loanInterest = 0;
    let loanDuration = 0;

    // Default probabilities
    let cryptoProbabilities = {
        x2: 0.3,
        x3: 0.15,
        x5: 0.1,
        x10: 0.05,
        rugged: 0.4
    };

    function updateStatus() {
        balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
        rentDueElement.textContent = `Rent Due: $${rentDue.toFixed(2)}`;
        currentDayElement.textContent = `Day: ${currentDay}`;
        currentMonthElement.textContent = `Month: ${currentMonth}`;
        loanStatusElement.textContent = `Loan: $${loan.toFixed(2)} (Interest: $${loanInterest.toFixed(2)}, Duration: ${loanDuration} months)`;
    }

    function updatePaidMonths() {
        paidMonthsListElement.innerHTML = '';
        paidMonths.forEach(month => {
            const listItem = document.createElement('li');
            listItem.textContent = `Month ${month}`;
            const checkmark = document.createElement('span');
            checkmark.textContent = ' ✔';
            checkmark.classList.add('checkmark');
            listItem.appendChild(checkmark);
            paidMonthsListElement.appendChild(listItem);
        });
    }

    function randomEvent() {
        const eventChance = Math.random();
        if (eventChance < 0.2) {
            const eventType = Math.random();
            if (eventType < 0.5) {
                const bonus = Math.floor(Math.random() * 501) + 100; // Bonus between $100 and $600
                balance += bonus;
                summaryElement.innerHTML = `<span class="event">You received a bonus of $${bonus}!</span>`;
            } else {
                const expense = Math.floor(Math.random() * 301) + 100; // Expense between $100 and $400
                balance -= expense;
                summaryElement.innerHTML = `<span class="event">Unexpected expense of $${expense} occurred.</span>`;
            }
        }
    }

    function fluctuateCryptoMarket() {
        cryptoProbabilities.x2 = 0.2 + Math.random() * 0.2; // 20% to 40%
        cryptoProbabilities.x3 = 0.1 + Math.random() * 0.1; // 10% to 20%
        cryptoProbabilities.x5 = 0.05 + Math.random() * 0.1; // 5% to 15%
        cryptoProbabilities.x10 = 0.01 + Math.random() * 0.09; // 1% to 10%
        cryptoProbabilities.rugged = 1 - (cryptoProbabilities.x2 + cryptoProbabilities.x3 + cryptoProbabilities.x5 + cryptoProbabilities.x10); // Remaining probability for rugged
    }

    function nextDay() {
        currentDay++;
        randomEvent();
        fluctuateCryptoMarket();
        if (currentDay > 30) {
            currentDay = 1;
            currentMonth++;
            if (currentMonth > 1) {
                rentDue = 1400; // Rent is due starting from the second month
            }
            // Provide monthly summary
            provideMonthlySummary();
        }
        if (currentDay === 1 && currentMonth > 1 && rentDue > 0) {
            summaryElement.textContent = "Rent is due today!";
        }
        if (currentDay > 1 && currentDay <= 5 && currentMonth > 1 && rentDue > 0) {
            summaryElement.textContent = "Rent is overdue! Pay immediately to avoid eviction.";
            rentDue *= 1.05; // Apply 5% late fee
        }
        if (currentDay === 5 && currentMonth > 1 && rentDue > 0) {
            summaryElement.textContent = "You have been evicted! Game Over.";
			gameOverImage.style.display = 'block';
            document.getElementById("work-job").disabled = true;
            document.getElementById("invest-crypto").disabled = true;
            document.getElementById("pay-rent").disabled = true;
            document.getElementById("take-loan").disabled = true;
        }
        balance -= 50; // Deduct daily expenses
        if (balance < 0) {
            balance = 0;
        }
        if (loan > 0) {
            const monthlyPayment = (loan + loanInterest) / loanDuration;
            balance -= monthlyPayment;
            loanDuration--;
            if (loanDuration <= 0) {
                loan = 0;
                loanInterest = 0;
                summaryElement.textContent += " Your loan is fully repaid.";
            }
        }
        updateStatus();
    }

    function provideMonthlySummary() {
        summaryElement.innerHTML = `<span class="event">Monthly Summary: You have $${balance.toFixed(2)} and rent due is $${rentDue.toFixed(2)}.</span>`;
    }

	function disableButtons() {
		document.getElementById("work-job").disabled = true;
        document.getElementById("invest-crypto").disabled = true;
        document.getElementById("pay-rent").disabled = true;
        document.getElementById("take-loan").disabled = true;
	}
	
	function checkForWin() {
        if (currentMonth === 12 && rentDue === 0) {
            summaryElement.innerHTML = '<h2 style="color: gold;">YOU WIN! CONGRATULATIONS!</h2>';
            victoryImage.style.display = 'block';
            disableButtons();
        }
    }

    document.getElementById("work-job").addEventListener("click", () => {
        balance += 14 * 8;
        summaryElement.textContent = "You worked today and earned $112.";
        nextDay();
    });

    document.getElementById("invest-crypto").addEventListener("click", () => {
        investmentModal.style.display = "block";
    });

    document.getElementById("close-investment-modal").addEventListener("click", () => {
        investmentModal.style.display = "none";
    });

    document.querySelectorAll(".investment-option").forEach(button => {
        button.addEventListener("click", () => {
            const amount = parseInt(button.getAttribute("data-amount"));
            if (balance < amount) {
                summaryElement.textContent = "Not enough money to invest in crypto.";
                investmentModal.style.display = "none";
                return;
            }
            balance -= amount;
            const outcome = Math.random();
            let profit = 0;
            if (outcome < cryptoProbabilities.x2) {
                profit = amount * 2;
                summaryElement.textContent = `You hit a 2x on your crypto investment! You earned $${profit}.`;
            } else if (outcome < cryptoProbabilities.x2 + cryptoProbabilities.x3) {
                profit = amount * 3;
                summaryElement.textContent = `You hit a 3x on your crypto investment! You earned $${profit}.`;
            } else if (outcome < cryptoProbabilities.x2 + cryptoProbabilities.x3 + cryptoProbabilities.x5) {
                profit = amount * 5;
                summaryElement.textContent = `You hit a 5x on your crypto investment! You earned $${profit}.`;
            } else if (outcome < cryptoProbabilities.x2 + cryptoProbabilities.x3 + cryptoProbabilities.x5 + cryptoProbabilities.x10) {
                profit = amount * 10;
                summaryElement.textContent = `You hit a 10x on your crypto investment! You earned $${profit}.`;
            } else {
                summaryElement.innerHTML = `<span class="rugged">You got rugged! You lost your investment.</span>`;
            }
            balance += profit;
            investmentModal.style.display = "none";
            nextDay();
        });
    });

    document.getElementById("take-loan").addEventListener("click", () => {
        if (loan === 0) {
            loanModal.style.display = "block";
        } else {
            summaryElement.textContent = "You already have an active loan.";
        }
    });

    document.getElementById("close-loan-modal").addEventListener("click", () => {
        loanModal.style.display = "none";
    });

    document.querySelectorAll(".loan-option").forEach(button => {
        button.addEventListener("click", () => {
            if (loan > 0) {
                summaryElement.textContent = "You already have an active loan.";
                loanModal.style.display = "none";
                return;
            }
            const amount = parseInt(button.getAttribute("data-amount"));
            const duration = parseInt(button.getAttribute("data-duration"));
            loan = amount;
            loanDuration = duration;
            loanInterest = loan * 0.1 * loanDuration; // 10% interest per month
            balance += loan;
            summaryElement.textContent = `You took out a loan of $${loan} for ${loanDuration} months with $${loanInterest} interest.`;
            loanModal.style.display = "none";
            updateStatus();
        });
    });

    document.getElementById("pay-rent").addEventListener("click", () => {
        if (balance >= rentDue) {
            balance -= rentDue;
            rentDue = 0;
            if (!paidMonths.includes(currentMonth)) {
                paidMonths.push(currentMonth);
            }
            summaryElement.textContent = "You paid your rent.";
            updatePaidMonths();
        } else {
            summaryElement.textContent = "Not enough money to pay rent.";
        }
        updateStatus();
    });

    updateStatus();
    updatePaidMonths(); // Initialize the list with the starting month
});
