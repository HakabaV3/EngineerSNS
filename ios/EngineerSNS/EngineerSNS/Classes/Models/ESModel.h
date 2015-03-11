//
//  ESModel.h
//  EngineerSNS
//
//  Created by Jin Sasaki on 2015/03/11.
//  Copyright (c) 2015年 hakaba. All rights reserved.
//

#import <Foundation/Foundation.h>

@class ESModel;

@protocol ESModelDelegate <NSObject>
@optional
// - (ESModel *)model didRecievedData:(NSData *)data;
@end

/**
 *  APIとの通信を管理
 */

@interface ESModel : NSObject
- (void)sendRequest;
@end
