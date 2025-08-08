module coin_flip::coin_flip;

use sui::{sui::SUI, random::Random, coin::Coin, balance::{Self, Balance}, event::emit};
use sui::transfer::Receiving;

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
    let admin = Admin {
        id: object::new(ctx)
    };

    transfer::public_transfer(admin, ctx.sender());

    let house = House {
        id: object::new(ctx),
        fee: FEE_RATE,
        max: MAX_BET,
        pool: balance::zero(),
        treasury: balance::zero(),
    };

    transfer::share_object(house);
}

public fun add(house: &mut House, deposit: Coin<SUI>, _: &mut TxContext) {
    house.pool.join(deposit.into_balance());
}

public fun receive_from_house<T: key + store>(house: &mut House, to_receive: Receiving<T>): T {
    transfer::public_receive(&mut house.id, to_receive)
}

entry fun flip(house: &mut House, random: &Random, mut bet: Coin<SUI>, ctx: &mut TxContext) {
    let amount_in = bet.value();

    assert!(amount_in <= house.max, EInvalidBet);

    let fee = calculate_fee(house, amount_in);

    let amount_in_after_fee = amount_in - fee;

    let mut gen = random.new_generator(ctx);

    let result = gen.generate_bool();

    let fee_coin = bet.split(fee, ctx);

    transfer::public_transfer(fee_coin, house.id.to_address());

    let winning_amount = amount_in_after_fee * 2;

    house.pool.join(bet.into_balance());
    
    if (result) {
        let payout = house.pool.split(winning_amount).into_coin(ctx);

        transfer::public_transfer(payout, ctx.sender());
    };

    emit(Flip {
        result,
        amount_in,
        amount_out: if (result) winning_amount else 0,
        fee,
    });
}

// === Admin Functions ===

public fun remove(house: &mut House, _: &Admin, value: u64, ctx: &mut TxContext): Coin<SUI> {
    house.treasury.split(value).into_coin(ctx)
}

public fun set_max(house: &mut House, _: &Admin, max: u64) {
    house.max = max;
}

public fun set_fee(house: &mut House, _: &Admin, fee: u128) {
    house.fee = fee;
}

// === Private Functions === 

fun calculate_fee(house: &House, amount: u64): u64 {
    (((amount as u128) * house.fee).divide_and_round_up(BASIS_POINTS)) as u64
}
