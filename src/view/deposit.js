import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { CopyText } from '../component/text';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { CopyButton, Button, ButtonText } from '../component/button';
import { CopiedNotification } from '../component/notification';
import QRCode from '../component/qrcode';
import { color } from '../component/style';

const styles = StyleSheet.create({
  qrWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'space-between',
    padding: 5,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 25,
    maxWidth: 450,
  },
  copyBtn: {
    backgroundColor: color.glas,
    marginBottom: 10,
  },
});

const DepositView = ({ store, nav, invoice }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <View style={styles.qrWrapper}>
      <QRCode size={130}>{store.walletAddressUri}</QRCode>
    </View>
    <Header separator>
      <Title title="Deposit Funds" />
    </Header>
    <MainContent style={styles.content}>
      <CopyText style={styles.copyTxt}>
        Scan the QR code, or copy the address to send from another wallet or
        exchange. Only Bitcoin works at the moment.
      </CopyText>
      <View>
        <CopyButton
          onPress={() => invoice.toClipboard({ text: store.walletAddress })}
          icon="copy-dark"
          style={styles.copyBtn}
        >
          {store.walletAddress}
        </CopyButton>
        <Button onPress={() => nav.goHome()}>
          <ButtonText style={styles.doneBtnText}>DONE</ButtonText>
        </Button>
      </View>
      <CopiedNotification
        display={store.displayCopied}
        color={color.notifyLight}
      />
    </MainContent>
  </SplitBackground>
);

DepositView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default observer(DepositView);
