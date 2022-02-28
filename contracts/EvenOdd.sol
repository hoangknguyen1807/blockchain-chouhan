// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./MCash.sol";
import "./MemberCard.sol";

contract EvenOdd is Ownable, ReentrancyGuard {
    struct PlayerMetadata {
        uint256 betAmount;
        address player;
        bool isEven;
    }

    MCash public immutable cash;
    MemberCard public immutable ticket;

    address[] public playersArray;
    mapping(address => PlayerMetadata) public players;

    uint256 public totalBetAmount;
    uint256 public totalBetAmountPerRoll;
    uint256 public rollId = 1;

    event Withdraw(uint256 indexed amount);
    event Bet(uint256 rollId, address player, uint256 amount, bool isEven);
    event DiceRolled(
        uint256 rollId,
        uint8 diceNumber_1,
        uint8 diceNumber_2,
        bool isEven
    );

    constructor(address _dealer, address mCashAddr, address ticketAddr) {
        transferOwnership(_dealer);
        cash = MCash(mCashAddr);
        ticket = MemberCard(ticketAddr);
    }

    function transfer() external payable onlyOwner {}

    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be not zero");
        require(_amount <= getDealerBalance(), "Amount exceeds balance");
        transferMoney(_msgSender(), _amount);
        emit Withdraw(_amount);
    }

    function bet(bool _isEven, uint256 amount) external payable nonReentrant {
        uint256 countTickets = ticket.balanceOf(msg.sender);
        require(countTickets > 0, "A ticket required to play this game!");
        uint256 lastTokenId = ticket.tokenOfOwnerByIndex(msg.sender, countTickets - 1);
        require(block.timestamp < ticket.getDueDate(lastTokenId), "Ticket expired!");

        require(!isAlreadyBet(_msgSender()), "Already bet");
        require(amount > 0, "Minimum amount needed to play the game: 1 CASH");
        require(
            (totalBetAmountPerRoll + amount) * 2 <= getDealerBalance(),
            "total bet amount exceeds dealer balance"
        );

        players[_msgSender()] = PlayerMetadata(
            amount,
            _msgSender(),
            _isEven
        );

        require(cash.transferFrom(msg.sender, address(this), amount), "Transfer bet amount failed!");
        playersArray.push(_msgSender());
        totalBetAmount += amount;
        totalBetAmountPerRoll += amount;

        emit Bet(rollId, _msgSender(), amount, _isEven);
    }

    function rollDice() external onlyOwner {
        require(totalBetAmountPerRoll > 0, "No one place bet");

        uint8 diceNumber_1 = generateRandomNumber(1);
        uint8 diceNumber_2 = generateRandomNumber(2);

        bool isEven = (diceNumber_1 + diceNumber_2) % 2 == 0;
        emit DiceRolled(rollId, diceNumber_1, diceNumber_2, isEven);

        for (uint256 i = 0; i < playersArray.length; i++) {
            if (players[playersArray[i]].isEven == isEven) {
                transferMoney(
                    playersArray[i],
                    players[playersArray[i]].betAmount * 2
                );
            }
        }
        resetBoard();
        rollId++;
    }

    function isAlreadyBet(address _account) public view returns (bool) {
        return players[_account].betAmount > 0;
    }

    function getDealerBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBetAmountOf(address _account) public view returns (uint256) {
        return players[_account].betAmount;
    }

    function getPlayerInfo(address _account)
        external
        view
        returns (uint256 betAmount, bool isEven)
    {
        betAmount = players[_account].betAmount;
        isEven = players[_account].isEven;

        return (betAmount, isEven);
    }

    function transferMoney(address _account, uint256 _betAmount) private {
        payable(players[_account].player).transfer(_betAmount);
    }

    function resetBoard() private {
        for (uint256 i = 0; i < playersArray.length; i++) {
            delete (players[playersArray[i]]);
        }
        delete playersArray;
        totalBetAmountPerRoll = 0;
    }

    function generateRandomNumber(uint256 seed) private view returns (uint8) {
        uint8 result = uint8(
            (uint256(
                keccak256(
                    abi.encodePacked(
                        tx.origin,
                        blockhash(block.number - 1),
                        block.timestamp,
                        seed
                    )
                )
            ) % 6) + 1
        );
        return result;
    }
}
