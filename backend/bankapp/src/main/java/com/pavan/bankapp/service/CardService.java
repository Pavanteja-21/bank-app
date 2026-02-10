package com.pavan.bankapp.service;

import com.pavan.bankapp.entity.Card;
import com.pavan.bankapp.entity.Transaction;
import com.pavan.bankapp.entity.Type;
import com.pavan.bankapp.entity.User;
import com.pavan.bankapp.repository.CardRepository;
import com.pavan.bankapp.service.helper.AccountHelper;
import com.pavan.bankapp.util.RandomUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final AccountHelper accountHelper;
    private final TransactionService transactionService;

    public Card getCard(User user) {
        return cardRepository.findByOwnerUid(user.getUid()).orElseThrow();
    }

    public Card createCard(double amount, User user) throws Exception {
        if (amount < 2) {
            throw new IllegalArgumentException("Amount should be at least $2");
        }

        if (!accountHelper.existsByCodeAndOwnerUid("USD", user.getUid())) {
            throw new IllegalArgumentException("USD Account not found for this user so card cannot be created");
        }

        var usdAccount = accountHelper.findByCodeAndOwnerUid("USD", user.getUid()).orElseThrow();
        accountHelper.validateSufficientFunds(usdAccount, amount);
        usdAccount.setBalance(usdAccount.getBalance() - amount);

        long cardNumber;
        do {
            cardNumber = generateCardNumber();
        } while (cardRepository.existsByCardNumber(cardNumber));

        Card card = Card.builder()
                .cardHolder(user.getFirstName() + " " + user.getLastName())
                .cardNumber(cardNumber)
                .expiration(LocalDateTime.now().plusYears(3))
                .owner(user)
                .cvv(new RandomUtil().generateRandom(3).toString())
                .balance(amount - 1)
                .build();

        card = cardRepository.save(card);
        transactionService.createAccountTransaction(1.0, Type.WITHDRAW, 0.00, user, usdAccount);
        transactionService.createAccountTransaction(amount - 1, Type.WITHDRAW, 0.00, user, usdAccount);
        transactionService.createCardTransaction(amount - 1, Type.WITHDRAW, 0.00, user, card);

        return card;
    }

    private long generateCardNumber() {
        return new RandomUtil().generateRandom(16);
    }

    public Transaction creditCard(double amount, User user) {

    }

    public Transaction debitCard(double amount, User user) {

    }
}
