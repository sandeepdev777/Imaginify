"use server";

import { redirect } from 'next/navigation'
import Stripe from "stripe";
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import { updateCredits } from './user.actions';

// this function processes our transcations
export async function checkoutCredits(transaction: CheckoutTransactionParams) {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({  // it is stripe api method to create a session for payment
    line_items: [   // this contains all the necessary details for the payment
      {
        price_data: {  // details of the transaction plan
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          }
        },
        quantity: 1  // no of transcation plan
      }
    ],
    metadata: {     // additional details of the transaction
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
  
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,  // if transcation is successful then redirect to profile page
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,  // if transcation is cancelled then redirect to home page
  })

  redirect(session.url!)
}

// this updates the transaction in the database
export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction, buyer: transaction.buyerId
    })

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error)
  }
}