package com.pavan.bankapp.service.helper;

import com.pavan.bankapp.dto.AccountDto;
import com.pavan.bankapp.dto.ConvertDto;
import com.pavan.bankapp.entity.Account;
import com.pavan.bankapp.entity.Transaction;
import com.pavan.bankapp.entity.Type;
import com.pavan.bankapp.entity.User;
import com.pavan.bankapp.repository.AccountRepository;
import com.pavan.bankapp.service.ExchangeRateService;
import com.pavan.bankapp.service.TransactionService;
import com.pavan.bankapp.util.RandomUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.naming.OperationNotSupportedException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Getter
public class AccountHelper {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;
    private final ExchangeRateService exchangeRateService;

    private final Map<String, String> CURRENCIES = Map.of(
            "USD", "United States Dollar",
            "EUR", "Euro",
            "GBP", "British Pound",
            "JPY", "Japanese Yen",
            "NGN", "Nigerian Naira",
            "INR", "Indian Rupee"
    );

    public Account createAccount(AccountDto accountDto, User user) throws Exception {
        long accountNumber;
        validateAccountNonExistsForUser(accountDto.getCode(),user.getUid());
        do {
            accountNumber = new RandomUtil().generateRandom(10);
        } while (accountRepository.existsByAccountNumber(accountNumber));

        var account = Account.builder()
                .accountNumber(accountNumber)
                .accountName(user.getFirstName() + " " + user.getLastName())
                .balance(1000.0)
                .owner(user)
                .code(accountDto.getCode())
                .symbol(accountDto.getSymbol())
                .label(CURRENCIES.get(accountDto.getCode()))
                .build();

        return accountRepository.save(account);
    }

    public Transaction performTransfer(Account senderAccount, Account receiverAccount, Double amount, User user) throws Exception{
        validateSufficientFunds(senderAccount, (amount * 1.01));
        senderAccount.setBalance(senderAccount.getBalance() - amount * 1.01);
        receiverAccount.setBalance(receiverAccount.getBalance() + amount);
        accountRepository.saveAll(List.of(senderAccount, receiverAccount));
        var senderTransaction = transactionService.createAccountTransaction(amount, Type.WITHDRAW, amount * 0.01, user, senderAccount);
        var receiverTransaction = transactionService.createAccountTransaction(amount, Type.WITHDRAW, 0.00, receiverAccount.getOwner(), receiverAccount);

        return senderTransaction;
    }

    public void validateAccountNonExistsForUser(String code, String uid) throws OperationNotSupportedException {
        if (accountRepository.existsByCodeAndOwnerUid(code, uid)) {
            throw new OperationNotSupportedException("Account of this type already exists for this user");
        }
    }

    public void validateSufficientFunds(Account account, double amount) throws Exception {
        if (account.getBalance() < amount) {
            throw new OperationNotSupportedException("Insufficient funds in the account");
        }
    }

    public void validateAmount(double amount) throws  Exception {
        if (amount <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
    }

    public void validateDifferentCurrencyType(ConvertDto convertDto) throws Exception {
        if (convertDto.getToCurrency().equals(convertDto.getFromCurrency())) {
            throw new IllegalArgumentException("Conversion between the same currency types is not allowed");
        }
    }

    public void validateAccountOwnership(ConvertDto convertDto, String uid) throws Exception {
        accountRepository.findByCodeAndOwnerUid(convertDto.getFromCurrency(), uid).orElseThrow();
        accountRepository.findByCodeAndOwnerUid(convertDto.getToCurrency(), uid).orElseThrow();
    }

    public void validateConversion(ConvertDto convertDto, String uid) throws Exception {
        validateDifferentCurrencyType(convertDto);
        validateAccountOwnership(convertDto, uid);
        validateAmount(convertDto.getAmount());
        validateSufficientFunds(accountRepository.findByCodeAndOwnerUid(convertDto.getToCurrency(), uid).get(), convertDto.getAmount());
    }

    public Transaction convertCurrency(ConvertDto convertDto, User user) throws Exception {
        validateConversion(convertDto, user.getUid());
        var rates = exchangeRateService.getRates();
        var sendingRates = rates.get(convertDto.getFromCurrency());
        var receivingRates = rates.get(convertDto.getToCurrency());
        var computedAmount = (receivingRates/sendingRates) * convertDto.getAmount();
        Account fromAccount = accountRepository.findByCodeAndOwnerUid(convertDto.getFromCurrency(), user.getUid()).orElseThrow();
        Account toAccount = accountRepository.findByCodeAndOwnerUid(convertDto.getToCurrency(), user.getUid()).orElseThrow();
        fromAccount.setBalance(fromAccount.getBalance() - (convertDto.getAmount() * 1.01));
        toAccount.setBalance(toAccount.getBalance() + computedAmount);
        accountRepository.saveAll(List.of(fromAccount, toAccount));

        var fromAccountTransaction = transactionService.createAccountTransaction(convertDto.getAmount(), Type.CONVERSION, convertDto.getAmount() * 0.01, user, fromAccount);
        var toAccountTransaction = transactionService.createAccountTransaction(computedAmount, Type.DEPOSIT, convertDto.getAmount() * 0.00, user, toAccount);

        return fromAccountTransaction;
    }

    public boolean existsByCodeAndOwnerUid(String code, String uid) {
        return accountRepository.existsByCodeAndOwnerUid(code, uid);
    }

    public Optional<Account> findByCodeAndOwnerUid(String code, String uid) {
        return accountRepository.findByCodeAndOwnerUid(code, uid);
    }
}
