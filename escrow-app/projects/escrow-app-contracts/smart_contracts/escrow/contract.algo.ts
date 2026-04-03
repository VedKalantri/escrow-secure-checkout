import type { Account, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  Contract,
  GlobalState,
  Txn,
  assert,
  contract,
  itxn,
} from '@algorandfoundation/algorand-typescript'

@contract({
  stateTotals: {
    globalUints: 1,
    globalBytes: 3,
  },
})
export class Escrow extends Contract {
  buyer = GlobalState<Account>()
  seller = GlobalState<Account>()
  amount = GlobalState<uint64>()
  status = GlobalState<string>()

  createOrder(seller: Account, amount: uint64): void {
    this.buyer.value = Txn.sender
    this.seller.value = seller
    this.amount.value = amount
    this.status.value = 'Created'
  }

  lockFunds(): void {
    assert(Txn.sender === this.buyer.value)
    assert(this.status.value === 'Created')
    this.status.value = 'Funded'
  }

  acceptOrder(): void {
    assert(Txn.sender === this.seller.value)
    assert(this.status.value === 'Funded')
    this.status.value = 'Accepted'
  }

  markShipped(): void {
    assert(Txn.sender === this.seller.value)
    assert(this.status.value === 'Accepted')
    this.status.value = 'Shipped'
  }

  confirmDelivery(): void {
    assert(Txn.sender === this.buyer.value)
    assert(this.status.value === 'Shipped')

    itxn
      .payment({
        receiver: this.seller.value,
        amount: this.amount.value,
        fee: 0,
      })
      .submit()

    this.status.value = 'Released'
  }

  refund(): void {
    assert(Txn.sender === this.buyer.value)
    assert(this.status.value === 'Funded')

    itxn
      .payment({
        receiver: this.buyer.value,
        amount: this.amount.value,
        fee: 0,
      })
      .submit()

    this.status.value = 'Refunded'
  }
}