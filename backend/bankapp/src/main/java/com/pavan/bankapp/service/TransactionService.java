package com.pavan.bankapp.service;

import com.pavan.bankapp.entity.*;
import com.pavan.bankapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction createAccountTransaction(Double amount, Type type, double txFee, User user, Account account) {
        Transaction tx = Transaction.builder()
                .txFee(txFee)
                .amount(amount)
                .type(type)
                .status(Status.COMPLETED)
                .owner(user)
                .account(account)
                .build();

        return transactionRepository.save(tx);
    }

    public Transaction createCardTransaction(double amount, Type type, double txFee, User user, Card card) {
        Transaction tx = Transaction.builder()
                .txFee(txFee)
                .amount(amount)
                .type(type)
                .card(card)
                .status(Status.COMPLETED)
                .owner(user)
                .build();

        return transactionRepository.save(tx);
    }

    public  List<Transaction> getAllTransactions(String page, User user) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createdAt").ascending());
        return transactionRepository.findAllByOwnerUid(user.getUid(), pageable).getContent();
    }

    public List<Transaction> getTransactionsByCardId(String cardId, String page, User user) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createdAt").ascending());
        return transactionRepository.findAllByCardCardIdAndOwnerUid(cardId, user.getUid(), pageable).getContent();
    }

    public List<Transaction> getTransactionsByAccountId(String accountId, String page, User user) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createdAt").ascending());
        return transactionRepository.findAllByAccountAccountIdAndOwnerUid(accountId, user.getUid(), pageable).getContent();
    }
}
