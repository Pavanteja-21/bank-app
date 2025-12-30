package com.pavan.bankapp.repository;

import com.pavan.bankapp.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {

    Boolean existsByAccountNumber(Long accountNumber);

    Boolean existsByCodeAndOwnerUid(String code, String uid);

    List<Account> findAllByOwnerUid(String uid);

    Optional<Account> findByCodeAndOwnerUid(String code, String uid);

    Optional<Account> findByAccountNumber(Long recipientAccountNumber);

    Optional<Account> findByCodeAndAccountNumber(String code, Long recipientAccountNumber);

}
