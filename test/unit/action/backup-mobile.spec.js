import BackupAction from '../../../src/action/backup-mobile';
import FileAction from '../../../src/action/file-mobile';
import GrpcAction from '../../../src/action/grpc';
import * as logger from '../../../src/action/log';

describe('Action File Mobile Unit Tests', () => {
  let sandbox;
  let iCloudStorage;
  let Permissions;
  let grpc;
  let file;
  let Platform;
  let backup;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    iCloudStorage = {
      getItem: sinon.stub().resolves('some-value'),
      setItem: sinon.stub().resolves(),
    };
    Permissions = {
      request: sinon.stub().resolves(true),
      PERMISSIONS: {
        WRITE_EXTERNAL_STORAGE: true,
      },
      RESULTS: { GRANTED: true },
    };
    file = sinon.createStubInstance(FileAction);
    grpc = sinon.createStubInstance(GrpcAction);
    Platform = { OS: 'ios' };
    backup = new BackupAction(grpc, file, Platform, Permissions, iCloudStorage);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('pushChannelBackup', async () => {
    it('should store the SCB on iCloud', async () => {
      file.readSCB.resolves('some-scb');
      await backup.pushChannelBackup();
      expect(logger.error, 'was not called');
      expect(
        iCloudStorage.setItem,
        'was called with',
        'channel.backup',
        'some-scb'
      );
    });

    it('should log error if reading file fails', async () => {
      file.readSCB.rejects('some-error');
      await backup.pushChannelBackup();
      expect(logger.error, 'was called once');
      expect(iCloudStorage.setItem, 'was not called');
    });

    it('should log error if iCloud storage fails', async () => {
      file.readSCB.resolves('some-scb');
      iCloudStorage.setItem.rejects('some-error');
      await backup.pushChannelBackup();
      expect(logger.error, 'was called once');
    });

    it('should copy SCB to external storage', async () => {
      Platform.OS = 'android';
      await backup.pushChannelBackup();
      expect(Permissions.request, 'was called once');
      expect(file.copySCBToExternalStorage, 'was called once');
      expect(logger.error, 'was not called');
    });

    it('should log if permission is denied', async () => {
      Platform.OS = 'android';
      Permissions.request.resolves(false);
      await backup.pushChannelBackup();
      expect(Permissions.request, 'was called once');
      expect(logger.info, 'was called once');
      expect(file.copySCBToExternalStorage, 'was not called');
    });

    it('should log error if external storage fails', async () => {
      Platform.OS = 'android';
      file.copySCBToExternalStorage.rejects('some-error');
      await backup.pushChannelBackup();
      expect(logger.error, 'was called once');
    });
  });

  describe('subscribeChannelBackups()', async () => {
    let onStub;

    beforeEach(() => {
      onStub = sinon.stub();
      sandbox.stub(backup, 'pushChannelBackup');
    });

    it('should push to iCloud on backup update', async () => {
      onStub.withArgs('data').yields();
      onStub.withArgs('end').yields();
      grpc.sendStreamCommand
        .withArgs('subscribeChannelBackups')
        .returns({ on: onStub });
      await backup.subscribeChannelBackups();
      expect(backup.pushChannelBackup, 'was called once');
    });

    it('should log error in case of error', async () => {
      onStub.withArgs('error').yields(new Error('Boom!'));
      grpc.sendStreamCommand
        .withArgs('subscribeChannelBackups')
        .returns({ on: onStub });
      await backup.subscribeChannelBackups();
      expect(logger.error, 'was called once');
    });
  });
});
