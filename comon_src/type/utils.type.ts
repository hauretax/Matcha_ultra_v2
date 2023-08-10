export type Vector = {
    x:number;
    y:number;
}

export type Ip2Location = {
    ip: string;
    country_code: string;
    country_name: string;
    region_name: string;
    city_name: string;
    latitude: number;
    longitude: number;
    zip_code: string;
    time_zone: string;
    asn: string;
    as: string;
    is_proxy: boolean;
};

export type OrderBy = "distance" | "age" | "popularity" | "tag"

export type findTenUsersParams = {
    latitude:number;
    longitude:number;
    distanceMax:number;
    ageMin:number;
    ageMax:number;
    orientation:Array<string>;
    interestWanted:Array<string>;
    index:number;
    orderBy: OrderBy;
    userId?:number;
}

export interface filtersList {
  ageRange: number[];
  distance: number;
  orientation: ("Female" | "Male" | "Other")[];
  interests: string[];
  orderBy: OrderBy;
}

export interface Message {
    msg: string;
    sendDate: string;
    displayName: string;
    userIdFrom?: number;
    userIdTo?: number;
}

export interface Profile {
    username: string,
    id: number,
    lastMessage: string,
    messageDate: Date,
    profilePicture: string
}

export type notificationType = "like" | "message" | "visit" | "match" | "unlike"

export interface notification{
    id: number,
    type: notificationType,
    fromId: number,
    toId: number,
    date: Date
}