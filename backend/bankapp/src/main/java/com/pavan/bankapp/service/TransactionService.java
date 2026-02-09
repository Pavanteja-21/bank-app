package com.pavan.bankapp.service;

import com.pavan.bankapp.entity.*;
import com.pavan.bankapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction createAccountTransaction(Double amount, Type type, double txFee, User user, Account account) {
        var tx = Transaction.builder()
                .txFee(txFee)
                .amount(amount)
                .type(type)
                .status(Status.COMPLETED)
                .owner(user)
                .account(account)
                .build();

        return transactionRepository.save(tx);
    }
}
