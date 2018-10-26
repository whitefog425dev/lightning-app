import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { color } from '../component/style';
import { H4Text } from '../component/text';
import Icon from '../component/icon';
import LightningBoltPurpleIcon from '../asset/icon/lightning-bolt-purple';
import {
  BalanceLabel,
  BalanceLabelNumeral,
  BalanceLabelUnit,
  SmallBalanceLabel,
} from '../component/label';
import {
  Button,
  QrButton,
  SmallButton,
  GlasButton,
  DownButton,
} from '../component/button';

//
// Home View
//

const styles = StyleSheet.create({
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  downBtn: {
    margin: 25,
  },
});

const HomeView = ({
  store,
  wallet,
  channel,
  payment,
  invoice,
  transaction,
  nav,
}) => {
  const { depositLabel, channelBalanceLabel, unitLabel } = store;
  return (
    <Background image="purple-gradient-bg">
      <HomeHeader
        goChannels={() => channel.init()}
        goSettings={() => nav.goSettings()}
        showChannelAlert={store.showChannelAlert}
      />
      <QrCodeSeparator goDeposit={() => nav.goDeposit()} />
      <MainContent style={styles.content}>
        <BalanceDisplay
          depositLabel={depositLabel}
          channelBalanceLabel={channelBalanceLabel}
          unitLabel={unitLabel}
          toggleDisplayFiat={() => wallet.toggleDisplayFiat()}
        />
        <SendReceiveButton
          goPay={() => payment.init()}
          goRequest={() => invoice.init()}
        />
        <DownButton onPress={() => transaction.init()} style={styles.downBtn}>
          Transactions
        </DownButton>
      </MainContent>
    </Background>
  );
};

HomeView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Balance Display
//

const balanceStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  smallLabel: {
    marginTop: 30,
    marginBottom: 5,
  },
});

const BalanceDisplay = ({
  depositLabel,
  channelBalanceLabel,
  unitLabel,
  toggleDisplayFiat,
}) => (
  <View style={balanceStyles.wrapper}>
    <Button onPress={toggleDisplayFiat}>
      <BalanceLabel>
        <BalanceLabelNumeral>{channelBalanceLabel}</BalanceLabelNumeral>
        <BalanceLabelUnit>{unitLabel}</BalanceLabelUnit>
      </BalanceLabel>
      <H4Text style={balanceStyles.smallLabel}>Chain Deposit</H4Text>
      <SmallBalanceLabel unit={unitLabel}>{depositLabel}</SmallBalanceLabel>
    </Button>
  </View>
);

BalanceDisplay.propTypes = {
  depositLabel: PropTypes.string.isRequired,
  channelBalanceLabel: PropTypes.string.isRequired,
  unitLabel: PropTypes.string,
  toggleDisplayFiat: PropTypes.func.isRequired,
};

//
// Send Receive Button
//

const bigBtnStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  leftBtn: {
    flex: 1,
    borderTopLeftRadius: 21,
    borderBottomLeftRadius: 21,
  },
  rightBtn: {
    flex: 1,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
  },
  boltWrapper: {
    justifyContent: 'center',
    backgroundColor: color.glas,
  },
});

const SendReceiveButton = ({ goPay, goRequest }) => (
  <View style={bigBtnStyles.wrapper}>
    <GlasButton onPress={goRequest} style={bigBtnStyles.leftBtn}>
      Request
    </GlasButton>
    <View style={bigBtnStyles.boltWrapper}>
      <LightningBoltPurpleIcon height={126 * 0.4} width={64 * 0.4} />
    </View>
    <GlasButton onPress={goPay} style={bigBtnStyles.rightBtn}>
      Pay
    </GlasButton>
  </View>
);

SendReceiveButton.propTypes = {
  goPay: PropTypes.func.isRequired,
  goRequest: PropTypes.func.isRequired,
};

//
// Home Header
//

const headerStyles = StyleSheet.create({
  btnWrapperLeft: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  btnWrapperRight: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsIcon: {
    height: 17,
    width: 17,
  },
});

const HomeHeader = ({ goChannels, goSettings, showChannelAlert }) => (
  <Header>
    <View style={headerStyles.btnWrapperLeft}>
      <SmallButton
        border
        alert={showChannelAlert ? color.pinkSig : null}
        text="Channels"
        onPress={goChannels}
      />
    </View>
    <Title title="Wallet" />
    <View style={headerStyles.btnWrapperRight}>
      <SmallButton text="Settings" onPress={goSettings}>
        <Icon
          image={require('../asset/icon/settings.png')}
          style={headerStyles.settingsIcon}
        />
      </SmallButton>
    </View>
  </Header>
);

HomeHeader.propTypes = {
  goChannels: PropTypes.func.isRequired,
  goSettings: PropTypes.func.isRequired,
  showChannelAlert: PropTypes.bool.isRequired,
};

//
// QR Code Separator
//

const qrStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 30,
    top: -1,
  },
  separator: {
    flex: 1,
    height: 1,
    shadowOffset: { width: 0, height: 0.25 },
    shadowColor: color.white,
  },
  button: {
    top: -19,
  },
});

const QrCodeSeparator = ({ goDeposit }) => (
  <View style={qrStyles.wrapper}>
    <View style={qrStyles.separator} />
    <QrButton onPress={goDeposit} style={qrStyles.button}>
      Add coin
    </QrButton>
    <View style={qrStyles.separator} />
  </View>
);

QrCodeSeparator.propTypes = {
  goDeposit: PropTypes.func.isRequired,
};

export default observer(HomeView);
