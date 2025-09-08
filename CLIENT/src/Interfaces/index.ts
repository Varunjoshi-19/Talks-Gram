export interface ProfilePayload {
  _id: string,
  email: string,
  username: string,
  fullname: string,
  post: number,
  bio: string,
  profileImage: {
    url: string,
    contentType: string
  },

  followers: number,
  following: number
};

export interface AllPostsProps {

  _id: string;
  likeStatus: boolean;
  postLike: number;
  postComment: number;
  postShare: number;
  postDescription: string;
  createdAt: string,
  postImage: {
    url: string
    contentType: string
  },
  authorId: {
    _id: string,
    profileImage: {
      url: string,
      contentType: string
    },
    username: string
  }
}[];

export interface CreatePostProps {
  s: () => void;
}


export interface UserInfoProps {
  username: string,
  userId: string
}

export interface PostIdProps {

  id: string;
  toogleBox: () => void;
  postType: string;
  userInfoF: () => UserInfoProps
  postUrl: string;
  userImageUrl?: string;
  currentLikes: number;
  createdAt: string;

}

export interface CommentProps {
  userId: {
    _id: string,
    name: string;
    profileImage: {
      url: string,
      contentType: string

    }
  }
  username: string | any,
  comment: string,
  time: string,

  initiateTime: number
}

export interface EditProfileProps {

  profileInfo: {
    _id: string;
    username: string;
    fullname: string;
    post: number,
    profileImage: {
      url: string,
      contentType: string
    },
    bio: string;
    followers: number;
    following: number
  };

  s: () => void;
}


export interface MenuOptionProps {

  profile: {
    _id: string,
    username: string,
    fullname: string,
    post: number,
    bio: string,
    followers: number,
    following: number
  }


}

export interface notificationPayload {

  userId: {
    _id: string,
    profileImage: {
      url: string,
      contentType: string
    }
  }
  userIdOf: string,
  usernameOf: string
};



export interface ProfileInfo {
  _id: string | any,
  username: string,
  fullname: string,
  post: number,
  bio: string,
  followers: number,
  following: number
};



export type RecievedReelType = {

  _id: string;
  reelLike: number;
  reelComment: number;
  reelDescription: string;
  authorUserId: {
    _id: string,
    profileImage: {
      url: string,
      contentType: string
    },
    username: string

  },
  reelVideo: {
    url: string,
    contentType: string,
  },


}

export type AllReelsType = {

  _id: string;
  likeStatus: boolean;
  reelLike: number;

  reelComment: number;
  reelDescription: string;
  authorUserId: {
    _id: string,
    profileImage: {
      url: string,
      contentType: string
    },
    username: string

  },
  reelVideo: {
    url: string,
    contentType: string,
  },
  videoRef: any;

}

export type ReelLikeAndStatus = {

  likes: number,
  likeStatus: boolean

}


export interface searchAccount {
  _id: string,
  profileImage: {
    url: string,
    contentType: string
  },
  username: string,
  fullname: string,
  followers: number,
  following: number
}



export interface ToMessageProps {

  toogleButton: React.Dispatch<React.SetStateAction<boolean>>;
  EnableMessageTab: (value: string) => void;
}


export interface ShareThoughtProps {
  userId: string;
  setNote : React.Dispatch<React.SetStateAction<{ noteMessage: string }>> ; 
  closeDilogBox: React.Dispatch<React.SetStateAction<boolean>> ;
  imageSrc: string;

}

export interface StoryDilogBoxProps {
  id: string;
  username: string;
  itemUrl: string;
  type: string;
  storyDuration: number;
  storyFile: File;
  closeDilogBox: React.Dispatch<React.SetStateAction<File | null>>;
}


export interface PlayStoryProps {
  allStories: any[];
  currentSelectedStory: {
    story: any;
    currentIndex: number;
  };
  closeDilogBox: React.Dispatch<React.SetStateAction<boolean>>;
}



interface StoryProps {
    _id: string,
    userId: {
        _id: string,
        profileImage: {
            url: string,
            contentType: string
        }
    },
    username: string,
    storyData: { duration: number, contentType: string }
};


export interface StoryCardProps {
    setCurrentStory: React.Dispatch<React.SetStateAction<number>>;
    index: number;
    allStoriesLength: number;
    currentStory: number;
    closeDilogBox: React.Dispatch<React.SetStateAction<boolean>>;
    story: StoryProps,
    className: { name: string, positions: string };
    logoIcon?: string;
}