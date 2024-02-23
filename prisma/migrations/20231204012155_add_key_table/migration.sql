-- CreateTable
CREATE TABLE "keys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
);

INSERT INTO
    "keys" ("name", "key", "updatedAt")
VALUES
    (
        'api_key_device',
        'InVMJN87fOOSvcI15qYnTRDj2YYe8hxH',
        CURRENT_TIMESTAMP
    );

INSERT INTO
    "keys" ("name", "key", "updatedAt")
VALUES
    (
        'JWT_SECRET',
        'Pass in 2023. Joker key @#@$#@$&^*&^',
        CURRENT_TIMESTAMP
    );

INSERT INTO
    "keys" ("name", "key", "updatedAt")
VALUES
    (
        'PUBLIC_KEY',
        '-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzMLsrX6fBwmOLXJMrCQE
oa3UiKnnH/9NJ/XLL1sUAWJ15tjM+JzuNe48RNie9GeRAkeuhENDeYyLnYly0ck+
lRBWmdVVXswONAjjtwK3/27k00QL4lGKlfuRGDjMbBYVM87GoSxyHULsT28QvVZF
y6fc8hM7/Cdlmx+GMuHrmgaY1owSATmw3uCivqhHZxQPE5K01SNq8IWhq6kIB74o
2Gy7VVTEI7AnG88yrF1YYKSItnqOWG6B86K2BfZBA2tsEkMyfNNuurpAnHgS2R/7
257nR3clvwXnXCtgVg7bDzbfs0pJ8HOOVCZ5RG44tPdyiLYXRji2BdadKyP1mPyv
J22vKzBlYrRmLMWLHBQ8GGieIwD85MS9W4EXoS4y7nVdFvj2BnbdoRfbTfcuf66W
ZS8zBSTDhZgWi6L83UwVosJPS7ZkQ1JfY0Rgr2QIUSHt460nU/D9enlV/6VRm9AD
80ysyIg+FjT+Z9wcB/RiKcIGGOLmsSM0XnIIVaJQWlapsYHy4NEC5V29Ln/q5BPA
uRskczUZHcjuy0uNkbV3Ooy/j/IrdMWtAe7F6uIpIRBWuUMB6RrC+2MyPGhXcdRR
N6/jkKVoXwJ6q69fzv9NdWGube1tCz8Eg9VH2RjR9DSc4Wwwm7VgjXFonBQ6vNuH
NRtJ17+hmnC61qYVDcPv6usCAwEAAQ==
-----END PUBLIC KEY-----',
        CURRENT_TIMESTAMP
    );

INSERT INTO
    "keys" ("name", "key", "updatedAt")
VALUES
    (
        'PRIVATE_KEY',
        '-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----',
        CURRENT_TIMESTAMP
    );