let pickTeam = '';
const games = document.querySelector('.games');
const account = document.querySelector('.account');
let listenPlaceBet = false;
let listenConfirmBet = false;
let balance = 1000;
account.innerText = balance;

const editBalance = document.querySelector('.edit-balance');
const editBalanceModal = document.querySelector('.edit-balance-modal');
const submitEditBalanceModal = document.querySelector('.submit-edit-balance-modal');
const change = document.querySelector('.change');

editBalance.addEventListener('click', () => {
    change.value = '';
    editBalanceModal.showModal();

    submitEditBalanceModal.addEventListener('click', () => {
        balance = balance + parseInt(change.value);
        account.innerText = balance;
        editBalanceModal.close();
    }, { once: true })
})

const getData = async () => {
    const res = await fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=24130c642a2c5a7e3ed0dbe6f657d841&regions=us&markets=spreads&oddsFormat=american');
    const data = await res.json();
    console.log(data);

    const homeSpreads = [];
    const awaySpreads = [];

    const getSpreads = () => {
        for (const contest of data) {
            for (const bookmaker of contest.bookmakers) {
                if (bookmaker.key === "draftkings") {
                    if (bookmaker.markets[0].outcomes[0].name == data[1].home_team) {
                        homeSpreads.push(bookmaker.markets[0].outcomes[0].point);
                        awaySpreads.push(bookmaker.markets[0].outcomes[1].point);
                    } else {
                        homeSpreads.push(bookmaker.markets[0].outcomes[1].point);
                        awaySpreads.push(bookmaker.markets[0].outcomes[0].point);
                    }
                }
            }
        }
    }
    getSpreads();

    const listGames = () => {
        for (let i = 0; i < data.length; i++) {
            const game = document.createElement('section')
            const pickLeft = document.createElement('button');
            const team1 = document.createElement('div');
            const team1Spread = document.createElement('div');
            const match = document.createElement('div');
            const team2 = document.createElement('div');
            const team2Spread = document.createElement('div');
            const pickRight = document.createElement('button');
            const bet = document.createElement('button');

            games.append(game);
            game.append(pickLeft);
            game.append(team1);
            game.append(team1Spread);
            game.append(match);
            game.append(team2);
            game.append(team2Spread);
            game.append(pickRight);
            game.append(bet);

            game.classList.add('game');
            pickLeft.innerText = "Pick Home";
            team1.innerText = data[i].home_team;
            if (homeSpreads[i] > 0) {
                team1Spread.innerText = `+${homeSpreads[i]}`;
            } else {
                team1Spread.innerText = homeSpreads[i];
            }
            match.innerText = 'vs';
            team2.innerText = data[i].away_team;
            if (awaySpreads[i] > 0) {
                team2Spread.innerText = `+${awaySpreads[i]}`;
            } else {
                team2Spread.innerText = awaySpreads[i];
            }
            pickRight.innerText = "Pick Away";
            bet.innerText = 'Bet';

            pickLeft.addEventListener('click', () => {
                pickLeft.style.backgroundColor = "blue";
                pickRight.style.backgroundColor = "gray";
            })

            pickRight.addEventListener('click', () => {
                pickRight.style.backgroundColor = "blue";
                pickLeft.style.backgroundColor = "gray";
            })

            const viewBetModal = () => {
                const betModal = document.querySelector('.placeBetModal');
                const closeBetModal = document.querySelector('.closeBetModal');
                const homeSpread = document.querySelector('.homeSpread');
                const awaySpread = document.querySelector('.awaySpread');
                const placeBet = document.querySelector('.placeBet');
                const confirmBetModal = document.querySelector('.confirmBetModal');
                const confirmBet = document.querySelector('.confirmBet');
                const cancelBet = document.querySelector('.cancelBet');

                bet.addEventListener('click', function betFunc() {
                    betModal.showModal();
                    const betModalHomeTeam = document.querySelector('.betModalHomeTeam');
                    const betModalAwayTeam = document.querySelector('.betModalAwayTeam');
                    const betAmount = document.querySelector('.betAmount');
                    betAmount.value = "";

                    betModalHomeTeam.innerText = data[i].home_team;
                    if (homeSpreads[i] > 0) {
                        homeSpread.innerText = `+${homeSpreads[i]}`;
                    } else {
                        homeSpread.innerText = homeSpreads[i];
                    }
                    betModalAwayTeam.innerText = data[i].away_team;
                    if (awaySpreads[i] > 0) {
                        awaySpread.innerText = `+${awaySpreads[i]}`;
                    } else {
                        awaySpread.innerText = awaySpreads[i];
                    }

                    pickTeam = '';
                    betModalHomeTeam.style.color = 'black';
                    betModalAwayTeam.style.color = 'black';

                    if (listenPlaceBet == false) {
                        closeBetModal.addEventListener('click', () => {
                            betModal.close();
                            listenPlaceBet = true;
                        });

                        betModalHomeTeam.addEventListener('click', () => {
                            console.log('you chose the home team');
                            if (pickTeam !== 'home') {
                                betModalHomeTeam.style.color = 'blue';
                                betModalAwayTeam.style.color = 'black';
                                pickTeam = 'home';
                            }

                        })

                        betModalAwayTeam.addEventListener('click', () => {
                            console.log('you chose the away team');
                            if (pickTeam !== 'away') {
                                betModalHomeTeam.style.color = 'black';
                                betModalAwayTeam.style.color = 'blue';
                                pickTeam = 'away';
                            }

                        })

                        placeBet.addEventListener('click', function Func() {
                            if (betAmount.value > balance) {
                                console.log('Insufficient Funds');
                            } else {
                                betModal.close();
                                listenPlaceBet = true;
                                if (confirmBetModal.open == false) {
                                    confirmBetModal.showModal();
                                }
                                if (listenConfirmBet == false) {
                                    confirmBet.addEventListener('click', function confirm() {
                                        if (pickTeam == 'home') {
                                            console.log(`You have placed a $${betAmount.value} bet on the ${betModalHomeTeam.innerText} at ${homeSpread.innerText} odds`)
                                        } else {
                                            console.log(`You have placed a $${betAmount.value} bet on the ${betModalAwayTeam.innerText} at ${awaySpread.innerText} odds`)
                                        }

                                        confirmBetModal.close();
                                        balance = balance - betAmount.value;
                                        account.innerText = balance;
                                        listenConfirmBet = true;
                                    });
                                    cancelBet.addEventListener('click', () => {
                                        confirmBetModal.close();
                                        listenConfirmBet = true;
                                    });
                                }
                            }
                        });
                    }
                })
            }
            viewBetModal();
        }
    }
    listGames();
}

getData();