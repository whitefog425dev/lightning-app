import React from 'react';
import { storiesOf } from '@storybook/react';
import { BalanceLabel } from '../../src/component/label';

storiesOf('Labels', module)
  .add('Balance SAT', () => (
    <BalanceLabel unit="SAT" style={{ color: 'black' }}>
      9,123,456,788
    </BalanceLabel>
  ))
  .add('Balance USD', () => (
    <BalanceLabel style={{ color: 'black' }}>$10,000.00</BalanceLabel>
  ));
