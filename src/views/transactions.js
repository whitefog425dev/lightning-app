import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Text, TextB } from '../components/text';
import Header from '../components/header';
import ComponentIcon from '../components/icon';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../styles';
import { formatSatoshis } from '../helpers';
import store from '../store';

class Transactions extends Component {
  render() {
    const { computedTransactions } = store;

    return (
      <View style={{ flex: 1, backgroundColor: colors.offwhite }}>
        <ScrollView style={{ flex: 1 }}>
          <Header
            style={{ margin: 20 }}
            text="Your Transactions"
            description="This is a list of payments, including Lightning and on-chain transactions, sent to or from your wallet."
          />

          {computedTransactions ? (
            computedTransactions.map((transaction, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 14,
                  marginRight: 14,
                  paddingBottom: 14,
                  paddingTop: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.lightergray,
                }}
              >
                <ComponentIcon
                  icon={
                    transaction.type === 'bitcoin' ? 'currency-btc' : 'flash'
                  }
                  style={{
                    margin: 10,
                    width: 32,
                    height: 32,
                    color: colors.gray,
                  }}
                />
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextB style={{ fontSize: 14 }}>TxID:</TextB>
                  <Text style={{ fontSize: 14 }}>{transaction.hash}</Text>
                  {!!transaction.memo && (
                    <Text style={{ fontSize: 14 }}>
                      Note: {transaction.memo}
                    </Text>
                  )}
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <TextB style={{ fontSize: 12 }}>
                    {formatSatoshis(transaction.amount)} SAT
                  </TextB>
                  <Text style={{ fontSize: 12, color: colors.lightgray }}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default observer(Transactions);
