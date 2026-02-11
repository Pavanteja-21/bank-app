package com.pavan.bankapp.controller;

import com.pavan.bankapp.entity.Transaction;
import com.pavan.bankapp.entity.User;
import com.pavan.bankapp.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(@RequestParam String page, Authentication auth) {
        return ResponseEntity.ok(transactionService.getAllTransactions(page, (User) auth.getPrincipal()));
    }

    @GetMapping("/c/{cardId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCardId(@PathVariable String cardId, @RequestParam String page, Authentication auth) {
        return ResponseEntity.ok(transactionService.getTransactionsByCardId(cardId, page, (User) auth.getPrincipal()));
    }

    @GetMapping("/a/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountId(@PathVariable String accountId, @RequestParam String page, Authentication auth) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId, page, (User) auth.getPrincipal()));
    }
}
