package com.pavan.bankapp.service;

import com.pavan.bankapp.dto.AccountDto;
import com.pavan.bankapp.dto.TransferDto;
import com.pavan.bankapp.entity.Account;
import com.pavan.bankapp.entity.Transaction;
import com.pavan.bankapp.entity.User;
import com.pavan.bankapp.repository.AccountRepository;
import com.pavan.bankapp.service.helper.AccountHelper;
import com.pavan.bankapp.util.RandomUtil;
import lombok.RequiredArgsConstructor;


import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountHelper accountHelper;

    public Account createAccount(AccountDto accountDto, User user) throws Exception {
        return accountHelper.createAccount(accountDto, user);
    }

    public List<Account> getUserAccounts(String uid) {
        return accountRepository.findAllByOwnerUid(uid);
    }

    public Transaction transferFunds(TransferDto transferDto, User user) throws Exception {
        System.out.println("Currency Code: " + transferDto.getCode());
        var senderAccount = accountRepository.findByCodeAndOwnerUid(transferDto.getCode(), user.getUid())
                .orElseThrow(() -> new UnsupportedOperationException("Account of type currency does not exists for user"));

        var receiverAccount = accountRepository.findByAccountNumber(transferDto.getRecipientAccountNumber())
                .orElseThrow(() -> new UnsupportedOperationException("Account of type currency does not exists for receiver"));

        return accountHelper.performTransfer(senderAccount, receiverAccount, transferDto.getAmount(), user);
    }

}
