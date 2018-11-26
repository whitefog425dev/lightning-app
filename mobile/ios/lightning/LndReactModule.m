//
//  LndReactModule.m
//  lightning
//
//  Created by Johan Torås Halseth on 05/11/2018.
//

#import "LndReactModule.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <Lndmobile/Lndmobile.h>

@interface NativeCallback:NSObject<LndmobileCallback>
@property (nonatomic) RCTResponseSenderBlock jsCallback;

@end

@implementation NativeCallback

- (instancetype)initWithCallback: (RCTResponseSenderBlock)c
{
    self = [super init];
    if (self) {
        self.jsCallback = c;
    }
    return self;
}

- (void)onError:(NSError *)p0 {
    NSLog(@"Got error %@", p0);
    self.jsCallback(@[p0]);
}

- (void)onResponse:(NSData *)p0 {
    NSLog(@"Go response %@", p0);
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    self.jsCallback(@[[NSNull null], b64]);
}

@end

@implementation LndReactModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)callback)
{
    NSFileManager *fileMgr = [NSFileManager defaultManager];
    NSURL *dir = [[fileMgr URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];

    NSString *lndConf = [[NSBundle mainBundle] pathForResource:@"lnd" ofType:@"conf"];
    NSString *confTarget = [dir.path stringByAppendingString:@"/lnd.conf"];

    [fileMgr removeItemAtPath:confTarget error:nil];
    [fileMgr copyItemAtPath:lndConf toPath: confTarget error:nil];

    RCTLogInfo(@"lnd dir: %@", dir.path);

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        RCTLogInfo(@"Starting lnd");
        NativeCallback* cb = [[NativeCallback alloc] initWithCallback:callback];
        LndmobileStart(dir.path, cb);
    });

}

RCT_EXPORT_METHOD(getInfo:(NSString*)msg callback:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"Getting info from string %@", msg);

    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];
    LndmobileGetInfo(bytes, [[NativeCallback alloc] initWithCallback:callback]);
}

@end
