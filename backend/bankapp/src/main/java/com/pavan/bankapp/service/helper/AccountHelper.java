package com.pavan.bankapp.service.helper;

import com.pavan.bankapp.dto.AccountDto;
import com.pavan.bankapp.entity.Account;
import com.pavan.bankapp.entity.User;
import com.pavan.bankapp.repository.AccountRepository;
import com.pavan.bankapp.util.RandomUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.naming.OperationNotSupportedException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Getter
public class AccountHelper {

    private final AccountRepository accountRepository;

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
                .balance(1000.0)
                .owner(user)
                .code(accountDto.getCode())
                .symbol(accountDto.getSymbol())
                .label(CURRENCIES.get(accountDto.getCode()))
                .build();

        return accountRepository.save(account);
    }

    public void validateAccountNonExistsForUser(String code, String uid) throws OperationNotSupportedException {
        if (accountRepository.existsByCodeAndOwnerUid(code, uid)) {
            throw new OperationNotSupportedException("Account of this type already exists for this user");
        }
    }
}
