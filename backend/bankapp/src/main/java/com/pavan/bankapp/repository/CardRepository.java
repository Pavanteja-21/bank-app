package com.pavan.bankapp.repository;

import com.pavan.bankapp.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, String> {

    Boolean existsByCardNumber(Long cardNumber);

    Optional<Card> findByOwnerUid(String uid);
}
