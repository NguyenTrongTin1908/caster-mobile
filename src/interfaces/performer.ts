export interface IPerformer {
  map(arg0: (performer: any) => JSX.Element): import('react').ReactNode;
  length: number;
  _id: string;
  performerId: string;
  isFollowed: boolean;
  canLive;
  canPrivateChat;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  phoneCode: string;
  avatarPath: string;
  avatar: any;
  coverPath: string;
  cover: any;
  gender: string;
  country: string;
  city: string;
  state: string;
  zipcode: string;
  address: string;
  languages: string[];
  studioId: string;
  categoryIds: string[];
  timezone: string;
  noteForUser: string;
  height: string;
  weight: string;
  bio: string;
  eyes: string;
  sexualOrientation: string;
  isFreeSubscription: boolean;
  durationFreeSubscriptionDays: number;
  monthlyPrice: number;
  yearlyPrice: number;
  stats: {
    likes: number;
    subscribers: number;
    views: number;
    totalVideos: number;
    totalPhotos: number;
    totalGalleries: number;
    totalProducts: number;
    totalFeeds: number;
    totalStories: number;
    totalBlogs: number;
    totalRating: number;
    avgRating: number;
    totalFollower: number;
    totalFollowing: number;
  };
  score: number;
  bankingInformation: IBanking;
  stripeAccount: any;
  paypalSetting: any;
  blockCountries: IBlockCountries;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  offlineAt:Date
  isOnline: number;
  verifiedAccount: boolean;
  verifiedEmail: boolean;
  verifiedDocument: boolean;
  twitterConnected: boolean;
  googleConnected: boolean;
  welcomeVideoId: string;
  welcomeVideoPath: string;
  welcomeVideoName: string;
  activateWelcomeVideo: boolean;
  isBookMarked: boolean;
  isSubscribed: boolean;
  live: number;
  privateChat: number;
  streamingStatus: string;
  ethnicity: string;
  butt: string;
  hair: string;
  pubicHair: string;
  idVerification: any;
  documentVerification: any;
  bodyType: string;
  dateOfBirth: Date;
  publicChatPrice: number;
  groupChatPrice: number;
  privateChatPrice: number;
  rubyBalance: number;
  balance: number;
  socialsLink: {
    facebook: string;
    google: string;
    instagram: string;
    twitter: string;
    linkedIn: string;
  };
  isPerformer: boolean;
  notificationSetting:

  {
  active: boolean,
  receiveOnDesktop: boolean,
  mail: boolean,
  comment: boolean,
  follower: boolean,
  newContent: boolean,
  followingGoLive: boolean,
  followingPrivateChat: boolean,
  moderator: boolean,
  privateChatRequest: boolean,
  casterAdminMessage: boolean,
  upgradedComplete: boolean,
  sposorship: boolean,


  }
}

export interface IBanking {
  firstName: string;
  lastName: string;
  SSN: string;
  bankName: string;
  bankAccount: string;
  bankRouting: string;
  bankSwiftCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  performerId: string;
}

export interface IPerformerStats {
  totalGrossPrice: number;
  totalSiteCommission: number;
  totalNetPrice: number;
}

export interface IBlockCountries {
  countryCodes: string[];
}

export interface IBlockedByPerformer {
  userId: string;
  description: string;
}
