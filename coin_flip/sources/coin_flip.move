module coin_flip::coin_flip;

use sui::{sui::SUI, random::Random, coin::Coin, balance::{Self, Balance}, event::emit};

// === Constants ===

const BASIS_POINTS: u128 = 10_000;

const FEE_RATE: u128 = 100; // 1%

const MAX_BET: u64 = 500_000_000;

// === Errors ===

const EInvalidBet: u64 = 0;

// === Structs ===

public struct House has key {
    id: UID,
    fee: u128,
    max: u64,
    pool: Balance<SUI>,
    treasury: Balance<SUI>,
}

public struct Admin has key, store {
    id: UID,  
}

// === Events ===

public struct Flip has copy, drop {
    result: bool, 
    amount_in: u64,
    amount_out: u64, 
    fee: u64,
}

// === Initialize === 

fun init(ctx: &mut TxContext) {
    abort
}

public fun add(house: &mut House, deposit: Coin<SUI>) {
    abort
}

entry fun flip(house: &mut House, random: &Random, mut bet: Coin<SUI>, ctx: &mut TxContext) {
    abort
}

// === Admin Functions ===

public fun remove(house: &mut House, _: &Admin, value: u64, ctx: &mut TxContext): Coin<SUI> {
    abort
}

public fun set_max(house: &mut House, _: &Admin, max: u64) {
    abort
}

public fun set_fee(house: &mut House, _: &Admin, fee: u128) {
    abort
}

// === Private Functions === 

fun calculate_fee(house: &House, amount: u64): u64 {
    abort
}
