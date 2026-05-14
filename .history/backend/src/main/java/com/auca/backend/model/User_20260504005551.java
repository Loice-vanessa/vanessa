package com.auca.backend.model;

import java.lang.annotation.Inherited;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Inherited
}
