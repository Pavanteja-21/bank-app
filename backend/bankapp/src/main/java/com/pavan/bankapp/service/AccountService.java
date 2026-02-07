package com.pavan.bankapp.service;

import com.pavan.bankapp.dto.AccountDto;
import com.pavan.bankapp.entity.Account;
import com.pavan.bankapp.entity.User;
import com.pavan.bankapp.repository.AccountRepository;
import com.pavan.bankapp.service.helper.AccountHelper;
import com.pavan.bankapp.util.RandomUtil;
import lombok.RequiredArgsConstructor;


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
}
